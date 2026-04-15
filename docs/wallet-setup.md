# Wallet Pass Setup Guide

## Apple Wallet (.pkpass)

### 1. Register a Pass Type ID

1. Go to [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers/list/passTypeId)
2. Click **+** to register a new Pass Type ID
3. Enter description: "Kyro Loyalty Card"
4. Enter identifier: `pass.com.kyro.loyalty`
5. Click **Register**

### 2. Create a Pass Signing Certificate

1. Go to [Certificates](https://developer.apple.com/account/resources/certificates/list)
2. Click **+** > choose **Pass Type ID Certificate**
3. Select your Pass Type ID (`pass.com.kyro.loyalty`)
4. Follow the CSR creation steps (Keychain Access > Certificate Assistant > Request a Certificate)
5. Upload CSR, download the `.cer` file

### 3. Export the Certificate and Key

```bash
# In Keychain Access, find the Pass Type ID certificate
# Right-click > Export > save as pass.p12

# Convert to PEM files:
openssl pkcs12 -in pass.p12 -clcerts -nokeys -out certs/pass.pem
openssl pkcs12 -in pass.p12 -nocerts -out certs/pass-key.pem
```

### 4. Download WWDR Certificate

```bash
curl -o certs/wwdr.cer https://www.apple.com/certificateauthority/AppleWWDRCAG4.cer
openssl x509 -inform DER -in certs/wwdr.cer -out certs/wwdr.pem
```

### 5. Set Environment Variables

```bash
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_PASS_TYPE_ID=pass.com.kyro.loyalty
APPLE_PASS_CERT_PATH=./certs/pass.pem
APPLE_PASS_KEY_PATH=./certs/pass-key.pem
APPLE_PASS_CERT_PASSWORD=your_p12_password
APPLE_WWDR_CERT_PATH=./certs/wwdr.pem
```

---

## Google Wallet

### 1. Enable the Google Wallet API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable the **Google Wallet API**

### 2. Create a Service Account

1. Go to **IAM & Admin > Service Accounts**
2. Create a new service account
3. Grant role: **Editor**
4. Create a JSON key and download it

### 3. Set Up Issuer Account

1. Go to [Google Pay & Wallet Console](https://pay.google.com/business/console/)
2. Create an issuer account
3. Note your **Issuer ID**
4. Add the service account email as a user

### 4. Set Environment Variables

```bash
GOOGLE_WALLET_ISSUER_ID=your_issuer_id
GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL=wallet@your-project.iam.gserviceaccount.com
GOOGLE_WALLET_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

---

## Directory Structure

```
kyro-card/
  certs/                    # DO NOT COMMIT
    pass.pem
    pass-key.pem
    wwdr.pem
  .env.local                # Your actual env vars
  .env.example              # Template (committed)
```

## Testing

**Apple Wallet:**
```
GET http://localhost:3000/api/wallet/apple/discount
```

**Google Wallet:**
```
GET http://localhost:3000/api/wallet/google/discount
```
