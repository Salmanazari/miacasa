export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          custom_id: string
          title: string
          description: string
          price: number
          bedrooms: number
          bathrooms: number
          area_sqm: number
          property_type: string
          status: string
          address: string
          city: string
          province: string
          zip_code: string
          country: string
          latitude: number
          longitude: number
          user_id: string
          slug: string
          seo_title: string
          meta_description: string
          investment_note: string
          urgency_note: string
          features: string
          category_tags: string
          label_tags: string
          enhancement_level: number
          final_status: string
          summary_comment: string
          updated_by: string
          responsible_contact: string
          listing_status: string
          images: string
          hero_image_url: string
          created_at: string
          updated_at: string
          raw_image_urls: string | null
          video_url: string
          plot_sqm: number
          transaction_type: string
          investment_tier: string
          development_type: string
          availability_status: string
          yearly_taxes: number
          community_fees: number
          maintenance_costs: number
          is_featured: boolean
        }
        Insert: {
          id?: string
          custom_id: string
          title: string
          description: string
          price: number
          bedrooms: number
          bathrooms: number
          area_sqm: number
          property_type: string
          status: string
          address: string
          city: string
          province: string
          zip_code: string
          country: string
          latitude: number
          longitude: number
          user_id: string
          slug: string
          seo_title?: string
          meta_description?: string
          investment_note?: string
          urgency_note?: string
          features: string
          category_tags: string
          label_tags: string
          enhancement_level: number
          final_status: string
          summary_comment?: string
          updated_by: string
          responsible_contact: string
          listing_status: string
          images: string
          hero_image_url: string
          created_at?: string
          updated_at?: string
          raw_image_urls?: string | null
          video_url?: string
          plot_sqm?: number
          transaction_type: string
          investment_tier: string
          development_type?: string
          availability_status: string
          yearly_taxes?: number
          community_fees?: number
          maintenance_costs?: number
          is_featured?: boolean
        }
        Update: {
          id?: string
          custom_id?: string
          title?: string
          description?: string
          price?: number
          bedrooms?: number
          bathrooms?: number
          area_sqm?: number
          property_type?: string
          status?: string
          address?: string
          city?: string
          province?: string
          zip_code?: string
          country?: string
          latitude?: number
          longitude?: number
          user_id?: string
          slug?: string
          seo_title?: string
          meta_description?: string
          investment_note?: string
          urgency_note?: string
          features?: string
          category_tags?: string
          label_tags?: string
          enhancement_level?: number
          final_status?: string
          summary_comment?: string
          updated_by?: string
          responsible_contact?: string
          listing_status?: string
          images?: string
          hero_image_url?: string
          created_at?: string
          updated_at?: string
          raw_image_urls?: string | null
          video_url?: string
          plot_sqm?: number
          transaction_type?: string
          investment_tier?: string
          development_type?: string
          availability_status?: string
          yearly_taxes?: number
          community_fees?: number
          maintenance_costs?: number
          is_featured?: boolean
        }
      }
      saved_properties: {
        Row: {
          id: string
          property_id: string | null
          user_id: string | null
          created_at: string
          notes: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          user_id?: string | null
          created_at?: string
          notes?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          user_id?: string | null
          created_at?: string
          notes?: string
        }
      }
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          avatar_url: string
          email_verified: boolean
          phone: string
          role: string
          preferences: Json | null
          created_at: string
          updated_at: string
          user_bio: string
          languages: string
          email: string
          marketexperience: number
          verifiedmiacasa: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          avatar_url?: string
          email_verified?: boolean
          phone?: string
          role?: string
          preferences?: Json | null
          created_at?: string
          updated_at?: string
          user_bio?: string
          languages?: string
          email: string
          marketexperience?: number
          verifiedmiacasa?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          avatar_url?: string
          email_verified?: boolean
          phone?: string
          role?: string
          preferences?: Json | null
          created_at?: string
          updated_at?: string
          user_bio?: string
          languages?: string
          email?: string
          marketexperience?: number
          verifiedmiacasa?: string
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          image_urls: string
          region: string
          lifestyle_tags: string
          display_priority: number
          parent_id: string | null
          latitude: string
          longitude: string
          population: string
          area_km2: string
          timezone: string
          famous_for: string
          climate: string
          bio: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          image_urls: string
          region: string
          lifestyle_tags?: string
          display_priority?: number
          parent_id?: string | null
          latitude?: string
          longitude?: string
          population?: string
          area_km2?: string
          timezone?: string
          famous_for?: string
          climate?: string
          bio?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          image_urls?: string
          region?: string
          lifestyle_tags?: string
          display_priority?: number
          parent_id?: string | null
          latitude?: string
          longitude?: string
          population?: string
          area_km2?: string
          timezone?: string
          famous_for?: string
          climate?: string
          bio?: string
        }
      }
      international_partners: {
        Row: {
          id: string
          country_name: string
          country_code: string
          flag_emoji: string
          region: string
          city: string
          location_lat: number
          location_lng: number
          partner_name: string
          partner_type: string
          contact_name: string
          email: string
          phone: string
          website_url: string
          profile_image_url: string
          description: string
          specialties: string
          languages_spoken: string
          years_experience: string
          notable_projects: string
          video_intro_url: string
          social_links: string
          status: string
          featured: boolean
          created_at: string
          badge: string
        }
        Insert: {
          id?: string
          country_name: string
          country_code: string
          flag_emoji: string
          region: string
          city: string
          location_lat: number
          location_lng: number
          partner_name: string
          partner_type: string
          contact_name: string
          email: string
          phone: string
          website_url: string
          profile_image_url?: string
          description: string
          specialties: string
          languages_spoken: string
          years_experience: string
          notable_projects?: string
          video_intro_url?: string
          social_links?: string
          status?: string
          featured?: boolean
          created_at?: string
          badge?: string
        }
        Update: {
          id?: string
          country_name?: string
          country_code?: string
          flag_emoji?: string
          region?: string
          city?: string
          location_lat?: number
          location_lng?: number
          partner_name?: string
          partner_type?: string
          contact_name?: string
          email?: string
          phone?: string
          website_url?: string
          profile_image_url?: string
          description?: string
          specialties?: string
          languages_spoken?: string
          years_experience?: string
          notable_projects?: string
          video_intro_url?: string
          social_links?: string
          status?: string
          featured?: boolean
          created_at?: string
          badge?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          property_id: string
          user_id: string | null
          name: string
          email: string
          phone: string
          message: string
          status: string
          created_at: string
          updated_at: string
          assigned_to: string | null
          full_name: string | null
          agent_id: string | null
          source: string
          reveal: boolean
          property_custom_id: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id?: string | null
          name: string
          email: string
          phone: string
          message: string
          status?: string
          created_at?: string
          updated_at?: string
          assigned_to?: string | null
          full_name?: string | null
          agent_id?: string | null
          source?: string
          reveal?: boolean
          property_custom_id?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string | null
          name?: string
          email?: string
          phone?: string
          message?: string
          status?: string
          created_at?: string
          updated_at?: string
          assigned_to?: string | null
          full_name?: string | null
          agent_id?: string | null
          source?: string
          reveal?: boolean
          property_custom_id?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          category: string
          excerpt: string
          body: string
          image_urls: string
          location_slug: string
          published: boolean
          created_at: string
          tags: string
          related_location_slug: string
          seo_title: string | null
          seo_description: string | null
          og_image_url: string | null
          reading_time: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          category: string
          excerpt: string
          body: string
          image_urls: string
          location_slug: string
          published?: boolean
          created_at?: string
          tags: string
          related_location_slug?: string
          seo_title?: string | null
          seo_description?: string | null
          og_image_url?: string | null
          reading_time?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          category?: string
          excerpt?: string
          body?: string
          image_urls?: string
          location_slug?: string
          published?: boolean
          created_at?: string
          tags?: string
          related_location_slug?: string
          seo_title?: string | null
          seo_description?: string | null
          og_image_url?: string | null
          reading_time?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

