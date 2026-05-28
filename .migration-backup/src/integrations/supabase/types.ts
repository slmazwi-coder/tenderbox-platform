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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bids: {
        Row: {
          bbbee_score: number | null
          compliance_score: number | null
          contractor_id: string | null
          functionality_score: number | null
          id: string
          price_score: number | null
          rank: number | null
          red_flags: string | null
          status: string | null
          submission_timestamp: string | null
          tender_id: string | null
          total_bid_price: number | null
          total_score: number | null
          tracking_id: string | null
        }
        Insert: {
          bbbee_score?: number | null
          compliance_score?: number | null
          contractor_id?: string | null
          functionality_score?: number | null
          id?: string
          price_score?: number | null
          rank?: number | null
          red_flags?: string | null
          status?: string | null
          submission_timestamp?: string | null
          tender_id?: string | null
          total_bid_price?: number | null
          total_score?: number | null
          tracking_id?: string | null
        }
        Update: {
          bbbee_score?: number | null
          compliance_score?: number | null
          contractor_id?: string | null
          functionality_score?: number | null
          id?: string
          price_score?: number | null
          rank?: number | null
          red_flags?: string | null
          status?: string | null
          submission_timestamp?: string | null
          tender_id?: string | null
          total_bid_price?: number | null
          total_score?: number | null
          tracking_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bids_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      briefing_attendance: {
        Row: {
          attendance_confirmed: boolean
          attendee_designation: string | null
          attendee_name: string | null
          contractor_id: string | null
          id: string
          sign_in_time: string | null
          sign_out_time: string | null
          tender_id: string | null
        }
        Insert: {
          attendance_confirmed?: boolean
          attendee_designation?: string | null
          attendee_name?: string | null
          contractor_id?: string | null
          id?: string
          sign_in_time?: string | null
          sign_out_time?: string | null
          tender_id?: string | null
        }
        Update: {
          attendance_confirmed?: boolean
          attendee_designation?: string | null
          attendee_name?: string | null
          contractor_id?: string | null
          id?: string
          sign_in_time?: string | null
          sign_out_time?: string | null
          tender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "briefing_attendance_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "briefing_attendance_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_documents: {
        Row: {
          contractor_id: string | null
          doc_type: string | null
          expiry_date: string | null
          id: string
          upload_date: string
          verification_status: string | null
        }
        Insert: {
          contractor_id?: string | null
          doc_type?: string | null
          expiry_date?: string | null
          id?: string
          upload_date?: string
          verification_status?: string | null
        }
        Update: {
          contractor_id?: string | null
          doc_type?: string | null
          expiry_date?: string | null
          id?: string
          upload_date?: string
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_documents_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      contractors: {
        Row: {
          bbbee_level: number | null
          cidb_grade: string | null
          cipc_number: string | null
          company_name: string
          created_at: string
          csd_number: string | null
          id: string
          profile_type: string | null
          sectors: string | null
          tender_readiness_score: number | null
          vat_number: string | null
        }
        Insert: {
          bbbee_level?: number | null
          cidb_grade?: string | null
          cipc_number?: string | null
          company_name: string
          created_at?: string
          csd_number?: string | null
          id?: string
          profile_type?: string | null
          sectors?: string | null
          tender_readiness_score?: number | null
          vat_number?: string | null
        }
        Update: {
          bbbee_level?: number | null
          cidb_grade?: string | null
          cipc_number?: string | null
          company_name?: string
          created_at?: string
          csd_number?: string | null
          id?: string
          profile_type?: string | null
          sectors?: string | null
          tender_readiness_score?: number | null
          vat_number?: string | null
        }
        Relationships: []
      }
      payment_certificates: {
        Row: {
          certificate_number: string | null
          certified_amount: number | null
          cfo_signed: boolean
          cfo_signed_date: string | null
          contractor_id: string | null
          due_date: string | null
          id: string
          invoice_submitted_date: string | null
          mm_signed: boolean
          mm_signed_date: string | null
          pa_signed: boolean
          pa_signed_date: string | null
          payment_released: boolean
          payment_released_date: string | null
          pm_signed: boolean
          pm_signed_date: string | null
          pmu_signed: boolean
          pmu_signed_date: string | null
          qs_signed: boolean
          qs_signed_date: string | null
          status: string | null
          tender_id: string | null
        }
        Insert: {
          certificate_number?: string | null
          certified_amount?: number | null
          cfo_signed?: boolean
          cfo_signed_date?: string | null
          contractor_id?: string | null
          due_date?: string | null
          id?: string
          invoice_submitted_date?: string | null
          mm_signed?: boolean
          mm_signed_date?: string | null
          pa_signed?: boolean
          pa_signed_date?: string | null
          payment_released?: boolean
          payment_released_date?: string | null
          pm_signed?: boolean
          pm_signed_date?: string | null
          pmu_signed?: boolean
          pmu_signed_date?: string | null
          qs_signed?: boolean
          qs_signed_date?: string | null
          status?: string | null
          tender_id?: string | null
        }
        Update: {
          certificate_number?: string | null
          certified_amount?: number | null
          cfo_signed?: boolean
          cfo_signed_date?: string | null
          contractor_id?: string | null
          due_date?: string | null
          id?: string
          invoice_submitted_date?: string | null
          mm_signed?: boolean
          mm_signed_date?: string | null
          pa_signed?: boolean
          pa_signed_date?: string | null
          payment_released?: boolean
          payment_released_date?: string | null
          pm_signed?: boolean
          pm_signed_date?: string | null
          pmu_signed?: boolean
          pmu_signed_date?: string | null
          qs_signed?: boolean
          qs_signed_date?: string | null
          status?: string | null
          tender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_certificates_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_certificates_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tenders: {
        Row: {
          briefing_date: string | null
          briefing_type: string | null
          budget: number | null
          category: string | null
          cidb_grade_required: string | null
          closing_date: string | null
          created_at: string
          description: string | null
          id: string
          province: string | null
          status: string | null
          tender_ref: string | null
          title: string
        }
        Insert: {
          briefing_date?: string | null
          briefing_type?: string | null
          budget?: number | null
          category?: string | null
          cidb_grade_required?: string | null
          closing_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          province?: string | null
          status?: string | null
          tender_ref?: string | null
          title: string
        }
        Update: {
          briefing_date?: string | null
          briefing_type?: string | null
          budget?: number | null
          category?: string | null
          cidb_grade_required?: string | null
          closing_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          province?: string | null
          status?: string | null
          tender_ref?: string | null
          title?: string
        }
        Relationships: []
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
