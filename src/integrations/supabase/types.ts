export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      aggregate_ratings: {
        Row: {
          average_rating: number
          average_verified_rating: number | null
          helpful_votes_total: number | null
          id: string
          last_review_date: string | null
          last_updated: string | null
          product_id: string
          rating_1_count: number | null
          rating_2_count: number | null
          rating_3_count: number | null
          rating_4_count: number | null
          rating_5_count: number | null
          recommendation_percentage: number | null
          total_reviews: number
          total_votes_total: number | null
          verified_reviews_count: number | null
          would_not_recommend_count: number | null
          would_recommend_count: number | null
        }
        Insert: {
          average_rating?: number
          average_verified_rating?: number | null
          helpful_votes_total?: number | null
          id?: string
          last_review_date?: string | null
          last_updated?: string | null
          product_id: string
          rating_1_count?: number | null
          rating_2_count?: number | null
          rating_3_count?: number | null
          rating_4_count?: number | null
          rating_5_count?: number | null
          recommendation_percentage?: number | null
          total_reviews?: number
          total_votes_total?: number | null
          verified_reviews_count?: number | null
          would_not_recommend_count?: number | null
          would_recommend_count?: number | null
        }
        Update: {
          average_rating?: number
          average_verified_rating?: number | null
          helpful_votes_total?: number | null
          id?: string
          last_review_date?: string | null
          last_updated?: string | null
          product_id?: string
          rating_1_count?: number | null
          rating_2_count?: number | null
          rating_3_count?: number | null
          rating_4_count?: number | null
          rating_5_count?: number | null
          recommendation_percentage?: number | null
          total_reviews?: number
          total_votes_total?: number | null
          verified_reviews_count?: number | null
          would_not_recommend_count?: number | null
          would_recommend_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "aggregate_ratings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "programs_sale"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string
          category: string | null
          category_id: string | null
          coach_id: string | null
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category?: string | null
          category_id?: string | null
          coach_id?: string | null
          content: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string | null
          category_id?: string | null
          coach_id?: string | null
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      bundle_items: {
        Row: {
          bundle_id: string
          created_at: string | null
          id: string
          program_id: string
        }
        Insert: {
          bundle_id: string
          created_at?: string | null
          id?: string
          program_id: string
        }
        Update: {
          bundle_id?: string
          created_at?: string | null
          id?: string
          program_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bundle_items_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundle_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_items_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "product_bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_items_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs_sale"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_applications: {
        Row: {
          created_at: string | null
          email: string
          experience_years: number
          expertise: string
          full_name: string
          id: string
          message: string | null
          phone: string | null
          resume_url: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          experience_years: number
          expertise: string
          full_name: string
          id?: string
          message?: string | null
          phone?: string | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          experience_years?: number
          expertise?: string
          full_name?: string
          id?: string
          message?: string | null
          phone?: string | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      coaches: {
        Row: {
          bio: string | null
          created_at: string | null
          experience_years: number | null
          expertise: string
          full_name: string
          id: string
          profile_id: string | null
          profile_image: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          experience_years?: number | null
          expertise: string
          full_name: string
          id?: string
          profile_id?: string | null
          profile_image?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          experience_years?: number | null
          expertise?: string
          full_name?: string
          id?: string
          profile_id?: string | null
          profile_image?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coaches_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_codes: {
        Row: {
          bundle_id: string | null
          code: string
          created_at: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean
          program_id: string | null
        }
        Insert: {
          bundle_id?: string | null
          code: string
          created_at?: string | null
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          program_id?: string | null
        }
        Update: {
          bundle_id?: string | null
          code?: string
          created_at?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          program_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discount_codes_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundle_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discount_codes_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "product_bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discount_codes_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs_sale"
            referencedColumns: ["id"]
          },
        ]
      }
      gyms: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          facilities: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          location: string | null
          membership_types: Json | null
          name: string
          operating_hours: Json | null
          price_range: string | null
          rating: number | null
          total_reviews: number | null
          updated_at: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          facilities?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string | null
          membership_types?: Json | null
          name: string
          operating_hours?: Json | null
          price_range?: string | null
          rating?: number | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          facilities?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string | null
          membership_types?: Json | null
          name?: string
          operating_hours?: Json | null
          price_range?: string | null
          rating?: number | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      offers: {
        Row: {
          availability: string | null
          availability_ends: string | null
          availability_starts: string | null
          condition: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          description: string | null
          id: string
          inventory_level: number | null
          is_active: boolean | null
          low_stock_threshold: number | null
          name: string
          offer_type: string | null
          original_price: number | null
          price: number
          product_id: string
          return_policy: string | null
          seller_name: string | null
          seller_url: string | null
          shipping_details: string | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
          warranty: string | null
        }
        Insert: {
          availability?: string | null
          availability_ends?: string | null
          availability_starts?: string | null
          condition?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          inventory_level?: number | null
          is_active?: boolean | null
          low_stock_threshold?: number | null
          name: string
          offer_type?: string | null
          original_price?: number | null
          price: number
          product_id: string
          return_policy?: string | null
          seller_name?: string | null
          seller_url?: string | null
          shipping_details?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
          warranty?: string | null
        }
        Update: {
          availability?: string | null
          availability_ends?: string | null
          availability_starts?: string | null
          condition?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          inventory_level?: number | null
          is_active?: boolean | null
          low_stock_threshold?: number | null
          name?: string
          offer_type?: string | null
          original_price?: number | null
          price?: number
          product_id?: string
          return_policy?: string | null
          seller_name?: string | null
          seller_url?: string | null
          shipping_details?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
          warranty?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "programs_sale"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          bundle_id: string | null
          created_at: string | null
          discount_amount: number
          discount_code: string | null
          id: string
          phone_number: string
          program_id: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          bundle_id?: string | null
          created_at?: string | null
          discount_amount?: number
          discount_code?: string | null
          id?: string
          phone_number: string
          program_id: string
          status: string
          user_id: string
        }
        Update: {
          amount?: number
          bundle_id?: string | null
          created_at?: string | null
          discount_amount?: number
          discount_code?: string | null
          id?: string
          phone_number?: string
          program_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundle_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "product_bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs_sale"
            referencedColumns: ["id"]
          },
        ]
      }
      product_bundles: {
        Row: {
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_legend: boolean | null
          price: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_legend?: boolean | null
          price?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_legend?: boolean | null
          price?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      program_details: {
        Row: {
          created_at: string | null
          description: string
          details: Json | null
          id: string
          program_id: string
          title: string
          updated_at: string | null
          weeks: Json | null
        }
        Insert: {
          created_at?: string | null
          description: string
          details?: Json | null
          id?: string
          program_id: string
          title: string
          updated_at?: string | null
          weeks?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string
          details?: Json | null
          id?: string
          program_id?: string
          title?: string
          updated_at?: string | null
          weeks?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "program_details_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs_sale"
            referencedColumns: ["id"]
          },
        ]
      }
      programs_sale: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          price: number
          program_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          price: number
          program_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          price?: number
          program_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          cons: string | null
          created_at: string | null
          helpful_votes: number | null
          id: string
          is_featured: boolean | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_notes: string | null
          product_id: string
          pros: string | null
          rating: number
          review_body: string
          review_date: string | null
          reviewer_email: string | null
          reviewer_id: string | null
          reviewer_name: string
          seller_response: string | null
          seller_response_by: string | null
          seller_response_date: string | null
          status: string | null
          title: string | null
          total_votes: number | null
          updated_at: string | null
          usage_duration: string | null
          verified_purchase: boolean | null
          would_recommend: boolean | null
        }
        Insert: {
          cons?: string | null
          created_at?: string | null
          helpful_votes?: number | null
          id?: string
          is_featured?: boolean | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          product_id: string
          pros?: string | null
          rating: number
          review_body: string
          review_date?: string | null
          reviewer_email?: string | null
          reviewer_id?: string | null
          reviewer_name: string
          seller_response?: string | null
          seller_response_by?: string | null
          seller_response_date?: string | null
          status?: string | null
          title?: string | null
          total_votes?: number | null
          updated_at?: string | null
          usage_duration?: string | null
          verified_purchase?: boolean | null
          would_recommend?: boolean | null
        }
        Update: {
          cons?: string | null
          created_at?: string | null
          helpful_votes?: number | null
          id?: string
          is_featured?: boolean | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          product_id?: string
          pros?: string | null
          rating?: number
          review_body?: string
          review_date?: string | null
          reviewer_email?: string | null
          reviewer_id?: string | null
          reviewer_name?: string
          seller_response?: string | null
          seller_response_by?: string | null
          seller_response_date?: string | null
          status?: string | null
          title?: string | null
          total_votes?: number | null
          updated_at?: string | null
          usage_duration?: string | null
          verified_purchase?: boolean | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "programs_sale"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          admin: boolean | null
          age: number | null
          coach: boolean | null
          created_at: string | null
          currentWeight: number | null
          email: string | null
          gender: string | null
          goal: string | null
          height: number | null
          id: string
          is_admin: boolean | null
          is_coach: boolean | null
          name: string | null
          permissions: string | null
          phoneNumber: string | null
          subscription_end_date: string | null
          subscription_plan: string | null
          subscription_start_date: string | null
          targetWeight: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin?: boolean | null
          age?: number | null
          coach?: boolean | null
          created_at?: string | null
          currentWeight?: number | null
          email?: string | null
          gender?: string | null
          goal?: string | null
          height?: number | null
          id?: string
          is_admin?: boolean | null
          is_coach?: boolean | null
          name?: string | null
          permissions?: string | null
          phoneNumber?: string | null
          subscription_end_date?: string | null
          subscription_plan?: string | null
          subscription_start_date?: string | null
          targetWeight?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin?: boolean | null
          age?: number | null
          coach?: boolean | null
          created_at?: string | null
          currentWeight?: number | null
          email?: string | null
          gender?: string | null
          goal?: string | null
          height?: number | null
          id?: string
          is_admin?: boolean | null
          is_coach?: boolean | null
          name?: string | null
          permissions?: string | null
          phoneNumber?: string | null
          subscription_end_date?: string | null
          subscription_plan?: string | null
          subscription_start_date?: string | null
          targetWeight?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_purchases: {
        Row: {
          amount: number
          expires_at: string | null
          id: string
          payment_id: string | null
          payment_status: string | null
          program_id: string | null
          purchase_date: string | null
          user_id: string
        }
        Insert: {
          amount: number
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          payment_status?: string | null
          program_id?: string | null
          purchase_date?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          payment_status?: string | null
          program_id?: string | null
          purchase_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_purchases_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs_sale"
            referencedColumns: ["id"]
          },
        ]
      }
      web_auth_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          updated_at: string | null
          used: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          updated_at?: string | null
          used?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          updated_at?: string | null
          used?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      bundle_details: {
        Row: {
          bundle_items: Json | null
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          id: string | null
          image_url: string | null
          is_active: boolean | null
          is_legend: boolean | null
          price: number | null
          title: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_bundle_total_price: {
        Args: { bundle_uuid: string }
        Returns: number
      }
      cleanup_expired_web_auth_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_bundle_discount_amount: {
        Args: { bundle_uuid: string }
        Returns: number
      }
      get_bundle_final_price: {
        Args: { bundle_uuid: string }
        Returns: number
      }
      get_product_with_schema_data: {
        Args: { p_product_id: string }
        Returns: Json
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      is_blog_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      is_coach: {
        Args: { _user_id: string }
        Returns: boolean
      }
      update_aggregate_ratings: {
        Args: { p_product_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
