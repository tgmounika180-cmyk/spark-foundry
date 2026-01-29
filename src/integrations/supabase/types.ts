export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          answers: Json
          created_at: string | null
          id: string
          program_id: string | null
          program_type: string
          stage: string | null
          startup_description: string | null
          startup_name: string
          status: string | null
          team_size: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          answers?: Json
          created_at?: string | null
          id?: string
          program_id?: string | null
          program_type: string
          stage?: string | null
          startup_description?: string | null
          startup_name: string
          status?: string | null
          team_size?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          answers?: Json
          created_at?: string | null
          id?: string
          program_id?: string | null
          program_type?: string
          stage?: string | null
          startup_description?: string | null
          startup_name?: string
          status?: string | null
          team_size?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          message: string
          status: string | null
          subject: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          message: string
          status?: string | null
          subject: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          message?: string
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          created_at: string | null
          email: string
          event_id: string | null
          full_name: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          event_id?: string | null
          full_name: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          event_id?: string | null
          full_name?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          banner_image_url: string | null
          created_at: string | null
          description: string | null
          event_date: string
          event_time: string
          event_type: string
          id: string
          is_virtual: boolean | null
          location: string
          max_attendees: number | null
          online_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          banner_image_url?: string | null
          created_at?: string | null
          description?: string | null
          event_date: string
          event_time: string
          event_type: string
          id?: string
          is_virtual?: boolean | null
          location: string
          max_attendees?: number | null
          online_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          banner_image_url?: string | null
          created_at?: string | null
          description?: string | null
          event_date?: string
          event_time?: string
          event_type?: string
          id?: string
          is_virtual?: boolean | null
          location?: string
          max_attendees?: number | null
          online_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hero_banners: {
        Row: {
          created_at: string
          cta_href: string | null
          cta_label: string | null
          id: string
          image_url: string | null
          is_active: boolean
          sort_order: number
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      mentors: {
        Row: {
          background: string | null
          bio: string | null
          companies: string | null
          created_at: string | null
          expertise: string[]
          id: string
          is_active: boolean | null
          linkedin_url: string | null
          name: string
          photo_url: string | null
          role: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          background?: string | null
          bio?: string | null
          companies?: string | null
          created_at?: string | null
          expertise: string[]
          id?: string
          is_active?: boolean | null
          linkedin_url?: string | null
          name: string
          photo_url?: string | null
          role: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          background?: string | null
          bio?: string | null
          companies?: string | null
          created_at?: string | null
          expertise?: string[]
          id?: string
          is_active?: boolean | null
          linkedin_url?: string | null
          name?: string
          photo_url?: string | null
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          application_url: string | null
          applications_open: boolean
          category: Database["public"]["Enums"]["program_category"]
          created_at: string
          description: string | null
          duration: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          application_url?: string | null
          applications_open?: boolean
          category: Database["public"]["Enums"]["program_category"]
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          application_url?: string | null
          applications_open?: boolean
          category?: Database["public"]["Enums"]["program_category"]
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      startups: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_featured: boolean | null
          is_public: boolean
          logo_url: string | null
          name: string
          sector: string
          stage: string
          status: string | null
          team_size: number | null
          traction: string | null
          updated_at: string | null
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_public?: boolean
          logo_url?: string | null
          name: string
          sector: string
          stage: string
          status?: string | null
          team_size?: number | null
          traction?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_public?: boolean
          logo_url?: string | null
          name?: string
          sector?: string
          stage?: string
          status?: string | null
          team_size?: number | null
          traction?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      admin_user_overview: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          roles: string[] | null
          updated_at: string | null
        }
        Relationships: []
      }
      startups_public: {
        Row: {
          created_at: string | null
          description: string | null
          id: string | null
          is_featured: boolean | null
          logo_url: string | null
          name: string | null
          sector: string | null
          stage: string | null
          team_size: number | null
          traction: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_featured?: boolean | null
          logo_url?: string | null
          name?: string | null
          sector?: string | null
          stage?: string | null
          team_size?: number | null
          traction?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_featured?: boolean | null
          logo_url?: string | null
          name?: string | null
          sector?: string | null
          stage?: string | null
          team_size?: number | null
          traction?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      stats: {
        Row: {
          events_count: number | null
          mentors_count: number | null
          programs_count: number | null
          startups_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "startup" | "mentor" | "investor"
      program_category: "pre-incubation" | "incubation" | "accelerator"
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
    Enums: {
      app_role: ["admin", "startup", "mentor", "investor"],
      program_category: ["pre-incubation", "incubation", "accelerator"],
    },
  },
} as const
