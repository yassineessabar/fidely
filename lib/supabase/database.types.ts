export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          website: string | null
          business_type: string | null
          company_size: Database['public']['Enums']['company_size'] | null
          logo_url: string | null
          brand_color: string
          card_style: Database['public']['Enums']['card_style']
          card_title: string | null
          card_subtitle: string | null
          notify_welcome: boolean
          notify_reward_reminders: boolean
          notify_birthday: boolean
          notify_inactivity: boolean
          notify_weekly_summary: boolean
          notify_campaign_reports: boolean
          inactivity_threshold_days: number
          plan: Database['public']['Enums']['plan_tier']
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          api_key: string | null
          webhook_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          website?: string | null
          business_type?: string | null
          company_size?: Database['public']['Enums']['company_size'] | null
          logo_url?: string | null
          brand_color?: string
          card_style?: Database['public']['Enums']['card_style']
          card_title?: string | null
          card_subtitle?: string | null
          notify_welcome?: boolean
          notify_reward_reminders?: boolean
          notify_birthday?: boolean
          notify_inactivity?: boolean
          notify_weekly_summary?: boolean
          notify_campaign_reports?: boolean
          inactivity_threshold_days?: number
          plan?: Database['public']['Enums']['plan_tier']
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          api_key?: string | null
          webhook_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          website?: string | null
          business_type?: string | null
          company_size?: Database['public']['Enums']['company_size'] | null
          logo_url?: string | null
          brand_color?: string
          card_style?: Database['public']['Enums']['card_style']
          card_title?: string | null
          card_subtitle?: string | null
          notify_welcome?: boolean
          notify_reward_reminders?: boolean
          notify_birthday?: boolean
          notify_inactivity?: boolean
          notify_weekly_summary?: boolean
          notify_campaign_reports?: boolean
          inactivity_threshold_days?: number
          plan?: Database['public']['Enums']['plan_tier']
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          api_key?: string | null
          webhook_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          business_id: string
          first_name: string | null
          last_name: string | null
          email: string
          phone: string | null
          role: Database['public']['Enums']['team_role']
          signup_role: Database['public']['Enums']['signup_role'] | null
          user_type: Database['public']['Enums']['user_type']
          avatar_url: string | null
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          business_id: string
          first_name?: string | null
          last_name?: string | null
          email: string
          phone?: string | null
          role?: Database['public']['Enums']['team_role']
          signup_role?: Database['public']['Enums']['signup_role'] | null
          user_type?: Database['public']['Enums']['user_type']
          avatar_url?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string
          phone?: string | null
          role?: Database['public']['Enums']['team_role']
          signup_role?: Database['public']['Enums']['signup_role'] | null
          user_type?: Database['public']['Enums']['user_type']
          avatar_url?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'profiles_id_fkey'; columns: ['id']; referencedRelation: 'users'; referencedColumns: ['id'] },
          { foreignKeyName: 'profiles_business_id_fkey'; columns: ['business_id']; referencedRelation: 'businesses'; referencedColumns: ['id'] },
        ]
      }
      locations: {
        Row: {
          id: string
          business_id: string
          name: string
          address: string | null
          city: string | null
          postal_code: string | null
          latitude: number | null
          longitude: number | null
          status: Database['public']['Enums']['location_status']
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          address?: string | null
          city?: string | null
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          status?: Database['public']['Enums']['location_status']
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          address?: string | null
          city?: string | null
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          status?: Database['public']['Enums']['location_status']
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'locations_business_id_fkey'; columns: ['business_id']; referencedRelation: 'businesses'; referencedColumns: ['id'] },
        ]
      }
      customers: {
        Row: {
          id: string
          business_id: string
          email: string | null
          name: string | null
          phone: string | null
          date_of_birth: string | null
          status: Database['public']['Enums']['customer_status']
          card_tier: Database['public']['Enums']['card_tier']
          total_visits: number
          total_spend: number
          total_points: number
          last_visit_at: string | null
          referral_code: string | null
          referred_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          email?: string | null
          name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          status?: Database['public']['Enums']['customer_status']
          card_tier?: Database['public']['Enums']['card_tier']
          total_visits?: number
          total_spend?: number
          total_points?: number
          last_visit_at?: string | null
          referral_code?: string | null
          referred_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          email?: string | null
          name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          status?: Database['public']['Enums']['customer_status']
          card_tier?: Database['public']['Enums']['card_tier']
          total_visits?: number
          total_spend?: number
          total_points?: number
          last_visit_at?: string | null
          referral_code?: string | null
          referred_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'customers_business_id_fkey'; columns: ['business_id']; referencedRelation: 'businesses'; referencedColumns: ['id'] },
          { foreignKeyName: 'customers_referred_by_fkey'; columns: ['referred_by']; referencedRelation: 'customers'; referencedColumns: ['id'] },
        ]
      }
      visits: {
        Row: {
          id: string
          business_id: string
          customer_id: string
          location_id: string | null
          amount: number | null
          points_earned: number
          stamps_earned: number
          visited_at: string
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          customer_id: string
          location_id?: string | null
          amount?: number | null
          points_earned?: number
          stamps_earned?: number
          visited_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          customer_id?: string
          location_id?: string | null
          amount?: number | null
          points_earned?: number
          stamps_earned?: number
          visited_at?: string
          created_at?: string
        }
        Relationships: [
          { foreignKeyName: 'visits_business_id_fkey'; columns: ['business_id']; referencedRelation: 'businesses'; referencedColumns: ['id'] },
          { foreignKeyName: 'visits_customer_id_fkey'; columns: ['customer_id']; referencedRelation: 'customers'; referencedColumns: ['id'] },
          { foreignKeyName: 'visits_location_id_fkey'; columns: ['location_id']; referencedRelation: 'locations'; referencedColumns: ['id'] },
        ]
      }
      loyalty_programs: {
        Row: {
          id: string
          business_id: string
          type: Database['public']['Enums']['program_type']
          name: string
          description: string | null
          is_active: boolean
          config: Json
          member_count: number
          redemption_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          type: Database['public']['Enums']['program_type']
          name: string
          description?: string | null
          is_active?: boolean
          config?: Json
          member_count?: number
          redemption_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          type?: Database['public']['Enums']['program_type']
          name?: string
          description?: string | null
          is_active?: boolean
          config?: Json
          member_count?: number
          redemption_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'loyalty_programs_business_id_fkey'; columns: ['business_id']; referencedRelation: 'businesses'; referencedColumns: ['id'] },
        ]
      }
      redemptions: {
        Row: {
          id: string
          business_id: string
          customer_id: string
          program_id: string
          location_id: string | null
          points_spent: number
          reward_description: string | null
          redeemed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          customer_id: string
          program_id: string
          location_id?: string | null
          points_spent?: number
          reward_description?: string | null
          redeemed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          customer_id?: string
          program_id?: string
          location_id?: string | null
          points_spent?: number
          reward_description?: string | null
          redeemed_at?: string
          created_at?: string
        }
        Relationships: [
          { foreignKeyName: 'redemptions_business_id_fkey'; columns: ['business_id']; referencedRelation: 'businesses'; referencedColumns: ['id'] },
          { foreignKeyName: 'redemptions_customer_id_fkey'; columns: ['customer_id']; referencedRelation: 'customers'; referencedColumns: ['id'] },
          { foreignKeyName: 'redemptions_program_id_fkey'; columns: ['program_id']; referencedRelation: 'loyalty_programs'; referencedColumns: ['id'] },
          { foreignKeyName: 'redemptions_location_id_fkey'; columns: ['location_id']; referencedRelation: 'locations'; referencedColumns: ['id'] },
        ]
      }
      campaigns: {
        Row: {
          id: string
          business_id: string
          name: string
          status: Database['public']['Enums']['campaign_status']
          template_key: string | null
          audience_segment: string | null
          message_title: string | null
          message_body: string | null
          sent_count: number
          open_count: number
          revenue: number
          scheduled_at: string | null
          sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          status?: Database['public']['Enums']['campaign_status']
          template_key?: string | null
          audience_segment?: string | null
          message_title?: string | null
          message_body?: string | null
          sent_count?: number
          open_count?: number
          revenue?: number
          scheduled_at?: string | null
          sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          status?: Database['public']['Enums']['campaign_status']
          template_key?: string | null
          audience_segment?: string | null
          message_title?: string | null
          message_body?: string | null
          sent_count?: number
          open_count?: number
          revenue?: number
          scheduled_at?: string | null
          sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'campaigns_business_id_fkey'; columns: ['business_id']; referencedRelation: 'businesses'; referencedColumns: ['id'] },
        ]
      }
      campaign_sends: {
        Row: {
          id: string
          campaign_id: string
          customer_id: string
          opened: boolean
          opened_at: string | null
          sent_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          customer_id: string
          opened?: boolean
          opened_at?: string | null
          sent_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          customer_id?: string
          opened?: boolean
          opened_at?: string | null
          sent_at?: string
        }
        Relationships: [
          { foreignKeyName: 'campaign_sends_campaign_id_fkey'; columns: ['campaign_id']; referencedRelation: 'campaigns'; referencedColumns: ['id'] },
          { foreignKeyName: 'campaign_sends_customer_id_fkey'; columns: ['customer_id']; referencedRelation: 'customers'; referencedColumns: ['id'] },
        ]
      }
      wallet_passes: {
        Row: {
          id: string
          business_id: string
          customer_id: string
          pass_type: string
          serial_number: string
          barcode_format: string
          barcode_value: string | null
          platform: string | null
          is_active: boolean
          pass_data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          customer_id: string
          pass_type: string
          serial_number: string
          barcode_format?: string
          barcode_value?: string | null
          platform?: string | null
          is_active?: boolean
          pass_data?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          customer_id?: string
          pass_type?: string
          serial_number?: string
          barcode_format?: string
          barcode_value?: string | null
          platform?: string | null
          is_active?: boolean
          pass_data?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'wallet_passes_business_id_fkey'; columns: ['business_id']; referencedRelation: 'businesses'; referencedColumns: ['id'] },
          { foreignKeyName: 'wallet_passes_customer_id_fkey'; columns: ['customer_id']; referencedRelation: 'customers'; referencedColumns: ['id'] },
        ]
      }
      integrations: {
        Row: {
          id: string
          business_id: string
          provider: string
          is_connected: boolean
          config: Json
          connected_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          provider: string
          is_connected?: boolean
          config?: Json
          connected_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          provider?: string
          is_connected?: boolean
          config?: Json
          connected_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'integrations_business_id_fkey'; columns: ['business_id']; referencedRelation: 'businesses'; referencedColumns: ['id'] },
        ]
      }
      invoices: {
        Row: {
          id: string
          business_id: string
          stripe_invoice_id: string | null
          amount: number
          currency: string
          plan: Database['public']['Enums']['plan_tier']
          status: Database['public']['Enums']['invoice_status']
          invoice_date: string
          pdf_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          stripe_invoice_id?: string | null
          amount: number
          currency?: string
          plan: Database['public']['Enums']['plan_tier']
          status?: Database['public']['Enums']['invoice_status']
          invoice_date: string
          pdf_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          stripe_invoice_id?: string | null
          amount?: number
          currency?: string
          plan?: Database['public']['Enums']['plan_tier']
          status?: Database['public']['Enums']['invoice_status']
          invoice_date?: string
          pdf_url?: string | null
          created_at?: string
        }
        Relationships: [
          { foreignKeyName: 'invoices_business_id_fkey'; columns: ['business_id']; referencedRelation: 'businesses'; referencedColumns: ['id'] },
        ]
      }
      signup_applications: {
        Row: {
          id: string
          company_name: string
          company_size: Database['public']['Enums']['company_size'] | null
          role: string | null
          first_name: string
          last_name: string
          email: string
          phone: string | null
          status: Database['public']['Enums']['application_status']
          reviewed_by: string | null
          reviewed_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_name: string
          company_size?: Database['public']['Enums']['company_size'] | null
          role?: string | null
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          status?: Database['public']['Enums']['application_status']
          reviewed_by?: string | null
          reviewed_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          company_size?: Database['public']['Enums']['company_size'] | null
          role?: string | null
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          status?: Database['public']['Enums']['application_status']
          reviewed_by?: string | null
          reviewed_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      loyalty_cards: {
        Row: {
          id: string
          business_id: string
          type: Database['public']['Enums']['card_type']
          name: string
          status: Database['public']['Enums']['card_status']
          business_details: Json
          branding: Json
          logic: Json
          share_url: string | null
          qr_code_data: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          type: Database['public']['Enums']['card_type']
          name: string
          status?: Database['public']['Enums']['card_status']
          business_details?: Json
          branding?: Json
          logic?: Json
          share_url?: string | null
          qr_code_data?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          type?: Database['public']['Enums']['card_type']
          name?: string
          status?: Database['public']['Enums']['card_status']
          business_details?: Json
          branding?: Json
          logic?: Json
          share_url?: string | null
          qr_code_data?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'loyalty_cards_business_id_fkey'; columns: ['business_id']; referencedRelation: 'businesses'; referencedColumns: ['id'] },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_business_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      application_status: 'pending' | 'approved' | 'rejected'
      company_size: '1' | '2-5' | '6-20' | '20+'
      team_role: 'owner' | 'manager' | 'staff'
      signup_role: 'owner_founder' | 'manager' | 'marketing' | 'operations' | 'other'
      customer_status: 'vip' | 'active' | 'inactive' | 'new'
      card_tier: 'gold' | 'silver' | 'bronze' | 'basic'
      campaign_status: 'draft' | 'active' | 'sent' | 'paused'
      program_type: 'stamp_card' | 'points' | 'cashback' | 'referral' | 'vip_tiers' | 'subscriptions' | 'gift_rewards' | 'passes'
      card_style: 'gradient' | 'dark' | 'light'
      card_type: 'coupon' | 'stamp' | 'points'
      card_status: 'draft' | 'active' | 'archived'
      plan_tier: 'starter' | 'growth' | 'enterprise'
      invoice_status: 'paid' | 'pending' | 'failed'
      location_status: 'active' | 'inactive'
      user_type: 'merchant' | 'admin'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience type aliases
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
