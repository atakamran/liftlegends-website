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
            foreignKeyName: "blog_posts_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
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
          id: string
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
      fitness_plans: {
        Row: {
          coach_id: string
          created_at: string | null
          description: string
          duration_weeks: number
          id: string
          image_url: string | null
          price: number
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          coach_id: string
          created_at?: string | null
          description: string
          duration_weeks: number
          id?: string
          image_url?: string | null
          price: number
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          coach_id?: string
          created_at?: string | null
          description?: string
          duration_weeks?: number
          id?: string
          image_url?: string | null
          price?: number
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fitness_plans_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          age: number | null
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
          age?: number | null
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
          age?: number | null
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
          plan_id: string
          purchase_date: string | null
          user_id: string
        }
        Insert: {
          amount: number
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          payment_status?: string | null
          plan_id: string
          purchase_date?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          payment_status?: string | null
          plan_id?: string
          purchase_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_purchases_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "fitness_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_logs: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          period: 'monthly' | 'yearly'
          amount: number
          start_date: string
          end_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          period: 'monthly' | 'yearly'
          amount: number
          start_date: string
          end_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          period?: 'monthly' | 'yearly'
          amount?: number
          start_date?: string
          end_date?: string
          created_at?: string
        }
        Relationships: []
      }
      programs_sale: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          category: 'training' | 'diet' | 'supplement'
          image_url: string | null
          program_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          category: 'training' | 'diet' | 'supplement'
          image_url?: string | null
          program_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          category?: 'training' | 'diet' | 'supplement'
          image_url?: string | null
          program_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          user_id: string
          program_id: string
          amount: number
          discount_amount: number
          status: string
          phone_number: string
          discount_code: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          program_id: string
          amount: number
          discount_amount: number
          status: string
          phone_number: string
          discount_code?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          program_id?: string
          amount?: number
          discount_amount?: number
          status?: string
          phone_number?: string
          discount_code?: string | null
          created_at?: string
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          id: string
          code: string
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          is_active: boolean
          program_id: string | null
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          code: string
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          is_active: boolean
          program_id?: string | null
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          code?: string
          discount_type?: 'percentage' | 'fixed'
          discount_value?: number
          is_active?: boolean
          program_id?: string | null
          created_at?: string
          expires_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
