export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      application_stage_history: {
        Row: {
          application_id: string
          id: string
          note: string | null
          occurred_at: string
          stage: Database["public"]["Enums"]["application_stage"]
        }
        Insert: {
          application_id: string
          id?: string
          note?: string | null
          occurred_at?: string
          stage: Database["public"]["Enums"]["application_stage"]
        }
        Update: {
          application_id?: string
          id?: string
          note?: string | null
          occurred_at?: string
          stage?: Database["public"]["Enums"]["application_stage"]
        }
        Relationships: [
          {
            foreignKeyName: "application_stage_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          applied_at: string
          current_stage: Database["public"]["Enums"]["application_stage"]
          id: string
          opportunity_id: string
          student_id: string
        }
        Insert: {
          applied_at?: string
          current_stage?: Database["public"]["Enums"]["application_stage"]
          id?: string
          opportunity_id: string
          student_id: string
        }
        Update: {
          applied_at?: string
          current_stage?: Database["public"]["Enums"]["application_stage"]
          id?: string
          opportunity_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          date: string
          id: string
          level: number
          max_score: number
          score: number
          skill_id: string | null
          student_id: string | null
        }
        Insert: {
          date: string
          id?: string
          level: number
          max_score: number
          score: number
          skill_id?: string | null
          student_id?: string | null
        }
        Update: {
          date?: string
          id?: string
          level?: number
          max_score?: number
          score?: number
          skill_id?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessments_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          date: string
          id: string
          issuer: string
          name: string
          student_id: string | null
          verified: boolean
        }
        Insert: {
          date: string
          id?: string
          issuer: string
          name: string
          student_id?: string | null
          verified?: boolean
        }
        Update: {
          date?: string
          id?: string
          issuer?: string
          name?: string
          student_id?: string | null
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "certifications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          id: string
          industry: string
          location: string
          logo: string | null
          name: string
          size: string
        }
        Insert: {
          id?: string
          industry: string
          location: string
          logo?: string | null
          name: string
          size: string
        }
        Update: {
          id?: string
          industry?: string
          location?: string
          logo?: string | null
          name?: string
          size?: string
        }
        Relationships: []
      }
      learning_path_skills: {
        Row: {
          learning_path_id: string
          skill_id: string
        }
        Insert: {
          learning_path_id: string
          skill_id: string
        }
        Update: {
          learning_path_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_path_skills_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_path_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_paths: {
        Row: {
          duration: string
          id: string
          level: number
          provider: string
          rating: number
          title: string
          url: string
        }
        Insert: {
          duration?: string
          id: string
          level?: number
          provider: string
          rating?: number
          title: string
          url: string
        }
        Update: {
          duration?: string
          id?: string
          level?: number
          provider?: string
          rating?: number
          title?: string
          url?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          active: boolean
          company_id: string | null
          compensation: string
          deadline: string | null
          description: string
          domain: Database["public"]["Enums"]["skill_domain"]
          duration: string | null
          eligibility: string
          id: string
          location: string
          posted_at: string
          recruiter_id: string | null
          title: string
          type: Database["public"]["Enums"]["opportunity_type"]
        }
        Insert: {
          active?: boolean
          company_id?: string | null
          compensation?: string
          deadline?: string | null
          description?: string
          domain?: Database["public"]["Enums"]["skill_domain"]
          duration?: string | null
          eligibility?: string
          id?: string
          location?: string
          posted_at?: string
          recruiter_id?: string | null
          title: string
          type?: Database["public"]["Enums"]["opportunity_type"]
        }
        Update: {
          active?: boolean
          company_id?: string | null
          compensation?: string
          deadline?: string | null
          description?: string
          domain?: Database["public"]["Enums"]["skill_domain"]
          duration?: string | null
          eligibility?: string
          id?: string
          location?: string
          posted_at?: string
          recruiter_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["opportunity_type"]
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "recruiters"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_skills: {
        Row: {
          opportunity_id: string
          preferred: boolean
          required_level: number
          skill_id: string
        }
        Insert: {
          opportunity_id: string
          preferred?: boolean
          required_level?: number
          skill_id: string
        }
        Update: {
          opportunity_id?: string
          preferred?: boolean
          required_level?: number
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_skills_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          slug: string
        }
        Insert: {
          avatar?: string | null
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          slug: string
        }
        Update: {
          avatar?: string | null
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          slug?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          description: string
          id: string
          student_id: string | null
          tech_stack: string[]
          title: string
          url: string | null
          verified: boolean
        }
        Insert: {
          description: string
          id?: string
          student_id?: string | null
          tech_stack?: string[]
          title: string
          url?: string | null
          verified?: boolean
        }
        Update: {
          description?: string
          id?: string
          student_id?: string | null
          tech_stack?: string[]
          title?: string
          url?: string | null
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "projects_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      lectures: {
        Row: {
          id: string
          academician_id: string
          institution_id: string
          title: string
          description: string | null
          scheduled_start: string
          scheduled_end: string | null
          meet_url: string
          status: string
          audience: string | null
          course: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          academician_id: string
          institution_id: string
          title: string
          description?: string | null
          scheduled_start: string
          scheduled_end?: string | null
          meet_url: string
          status?: string
          audience?: string | null
          course?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          academician_id?: string
          title?: string
          description?: string | null
          scheduled_start?: string
          scheduled_end?: string | null
          meet_url?: string
          status?: string
          audience?: string | null
          course?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      recruiters: {
        Row: {
          company_id: string | null
          id: string
        }
        Insert: {
          company_id?: string | null
          id: string
        }
        Update: {
          company_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recruiters_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recruiters_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          domain: Database["public"]["Enums"]["skill_domain"]
          id: string
          market_demand: number
          name: string
        }
        Insert: {
          domain: Database["public"]["Enums"]["skill_domain"]
          id: string
          market_demand: number
          name: string
        }
        Update: {
          domain?: Database["public"]["Enums"]["skill_domain"]
          id?: string
          market_demand?: number
          name?: string
        }
        Relationships: []
      }
      student_skills: {
        Row: {
          level: number
          skill_id: string
          student_id: string
          verification: Database["public"]["Enums"]["verification_type"]
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          level: number
          skill_id: string
          student_id: string
          verification: Database["public"]["Enums"]["verification_type"]
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          level?: number
          skill_id?: string
          student_id?: string
          verification?: Database["public"]["Enums"]["verification_type"]
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_skills_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          bio: string | null
          degree: string
          field: string
          gpa: number | null
          id: string
          institution: string
          institution_id: string | null
          onboarding_complete: boolean
          year: number
        }
        Insert: {
          bio?: string | null
          degree: string
          field: string
          gpa?: number | null
          id: string
          institution: string
          institution_id: string | null
          onboarding_complete?: boolean
          year: number
        }
        Update: {
          bio?: string | null
          degree?: string
          field?: string
          gpa?: number | null
          id?: string
          institution?: string
          onboarding_complete?: boolean
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "students_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      application_stage:
        | "applied"
        | "screening"
        | "interview"
        | "assessment"
        | "offer"
        | "accepted"
        | "rejected"
        | "withdrawn"
      opportunity_type: "internship" | "full-time" | "contract"
      skill_domain:
        | "frontend"
        | "backend"
        | "data-ai"
        | "cloud"
        | "devops"
        | "mobile"
        | "general"
      user_role: "student" | "recruiter" | "academician" | "institution"
      verification_type:
        | "self-declared"
        | "assessed"
        | "project-verified"
        | "industry-verified"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      application_stage: [
        "applied",
        "screening",
        "interview",
        "assessment",
        "offer",
        "accepted",
        "rejected",
        "withdrawn",
      ],
      opportunity_type: ["internship", "full-time", "contract"],
      skill_domain: [
        "frontend",
        "backend",
        "data-ai",
        "cloud",
        "devops",
        "mobile",
        "general",
      ],
      user_role: ["student", "recruiter", "academician", "institution"],
      verification_type: [
        "self-declared",
        "assessed",
        "project-verified",
        "industry-verified",
      ],
    },
  },
} as const