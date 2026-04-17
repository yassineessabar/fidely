# Wallet Pass Notifications — Phase 1 Design

## Overview

Add three notification mechanisms to Apple Wallet passes: location-based geo-fencing, date-based triggers (birthday + expiry), and merchant-initiated custom messages. All work by updating pass content and sending APNs push — Apple surfaces the updated pass on the lock screen.

## Notification Types

### 1. Location Geo-fence
- Add `locations` array to pass.json with shop lat/long
- Apple handles proximity detection (~100m radius)
- Pass appears on lock screen with `relevantText` message (e.g., "Welcome back to Sonoma! ☕")
- Requires merchant to enter shop address in card builder → auto-geocoded to coordinates

### 2. Birthday
- Daily cron checks `card_enrollments.customer_dob` against today's date
- On match: regenerate pass with `relevantDate` set to 7am that day, change auxiliary field to "HAPPY BIRTHDAY 🎂", send APNs push
- Pass surfaces on lock screen that morning
- Field reverts to normal the next day (next pass refresh)

### 3. Expiry Reminder
- Daily cron checks passes expiring in 7 days
- Set `relevantDate` to that day so pass surfaces with "VALID UNTIL" visible
- Send APNs push to trigger refresh

### 4. Custom Merchant Messages
- Merchant writes title + message from admin dashboard
- Immediate or scheduled delivery
- Updates a back field on the pass with the message, sends APNs push
- Pass surfaces on lock screen

## Data Model Changes

### New table: `card_notifications`

```sql
CREATE TYPE public.notification_status AS ENUM ('pending', 'sent', 'cancelled');
CREATE TYPE public.notification_type AS ENUM ('birthday', 'expiry', 'custom');

CREATE TABLE public.card_notifications (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id         uuid NOT NULL REFERENCES public.loyalty_cards(id) ON DELETE CASCADE,
  type            public.notification_type NOT NULL,
  title           text NOT NULL,
  message         text,
  scheduled_at    timestamptz,
  sent_at         timestamptz,
  recipients      integer DEFAULT 0,
  status          public.notification_status NOT NULL DEFAULT 'pending',
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_card ON public.card_notifications(card_id);
CREATE INDEX idx_notifications_pending ON public.card_notifications(status, scheduled_at);
```

### Modified: `loyalty_cards.business_details` JSONB

Add fields (no migration needed — JSONB is flexible):
```json
{
  "address": "123 Main St, Sydney NSW 2000",
  "latitude": -33.8688,
  "longitude": 151.2093
}
```

### No changes to existing tables
- `card_enrollments` — birthday from existing `customer_dob`
- `pass_registrations` — already tracks devices and push tokens

## Pass.json Changes

### Location (added when coordinates exist)
```json
{
  "locations": [
    {
      "latitude": -33.8688,
      "longitude": 151.2093,
      "relevantText": "Welcome back to Sonoma! ☕"
    }
  ]
}
```

### Birthday (temporary, day-of only)
```json
{
  "relevantDate": "2026-04-17T07:00+10:00"
}
```
Auxiliary field changes from `{ label: "MEMBER", value: "Jane" }` to `{ label: "HAPPY BIRTHDAY 🎂", value: "Jane" }`.

### Expiry (7 days before)
```json
{
  "relevantDate": "2026-04-24T07:00+10:00"
}
```

## API Endpoints

### Cron Job
- `GET /api/cron/notifications` — secured with `CRON_SECRET` header
- Runs daily at 7am AEST via Vercel Cron
- Steps:
  1. Find enrollments with birthday today → regenerate pass + APNs push
  2. Find enrollments with pass expiring in 7 days → set relevantDate + APNs push
  3. Find pending `card_notifications` where `scheduled_at <= now()` → update passes + APNs push + mark sent

### Admin API
- `POST /api/admin/cards/{id}/notify` — create notification
  - Body: `{ title: string, message?: string, scheduled_at?: string }`
  - No `scheduled_at` → sends immediately
  - With `scheduled_at` → saves as pending for cron
  - Returns: `{ id, recipients, status }`

- `GET /api/admin/cards/{id}/notifications` — list notification history
  - Returns: array of past notifications with status, sent count, dates

### Geocoding
- `POST /api/admin/geocode` — geocode address to coordinates
  - Body: `{ address: string }`
  - Uses OpenStreetMap Nominatim (free, no API key)
  - Returns: `{ latitude, longitude, display_name }`

## Admin UI Changes

### Card Builder
- New "Shop Address" text input field
- On blur/submit: auto-geocode via `/api/admin/geocode`
- Show confirmation: "📍 Location set: Sydney NSW" or error
- Coordinates saved in `business_details.latitude` / `business_details.longitude`

### Card Dashboard — Notification Section
- "Send Notification" card with:
  - Title input (required)
  - Message textarea (optional)
  - Schedule date picker (optional — empty = send now)
  - "Send" / "Schedule" button
- Notification history list below:
  - Title, type badge, status, recipient count, date
  - Cancel button for pending scheduled notifications

## Pass Generation Changes

### `enrollmentToPassTemplate()` updates
- Accept optional `notification` parameter for temporary field overrides
- Add `locations` array when `business_details.latitude` exists
- Add `relevantDate` when birthday or expiry notification is active

### `generateApplePass()` updates
- Include `locations` array in pass.json when provided in template
- Include `relevantDate` when provided in template

### `PassTemplate` type updates
- Add optional `locations?: { latitude: number, longitude: number, relevantText: string }[]`
- Add optional `relevantDate?: string`

## Cron Configuration

### `vercel.json`
```json
{
  "crons": [
    {
      "path": "/api/cron/notifications",
      "schedule": "0 21 * * *"
    }
  ]
}
```
Note: `0 21 * * *` = 9pm UTC = 7am AEST (UTC+10)

## Security
- Cron endpoint validates `CRON_SECRET` from Authorization header
- Admin endpoints require authenticated merchant session
- Geocoding endpoint requires authenticated session

## Phase 2 (Future)
- Full campaign builder with audience targeting (stamp count, points, last visit)
- Email + push combined campaigns
- A/B testing for messages
- Campaign analytics dashboard
- Recurring notifications (e.g., "Happy Hour every Friday")
