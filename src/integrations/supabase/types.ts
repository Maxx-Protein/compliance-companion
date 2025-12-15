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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          description: string | null
          id: string
          ip_address: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          id?: string
          ip_address?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_checklist: {
        Row: {
          compliance_date: string | null
          compliance_item: string
          compliance_status: string | null
          created_at: string
          document_url: string | null
          expiry_date: string | null
          id: string
          notes: string | null
          reminder_date: string | null
          reminder_set: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          compliance_date?: string | null
          compliance_item: string
          compliance_status?: string | null
          created_at?: string
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          notes?: string | null
          reminder_date?: string | null
          reminder_set?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          compliance_date?: string | null
          compliance_item?: string
          compliance_status?: string | null
          created_at?: string
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          notes?: string | null
          reminder_date?: string | null
          reminder_set?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_checklist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gst_filings: {
        Row: {
          created_at: string
          due_date: string | null
          filed_on_time: boolean | null
          filing_deadline: string | null
          filing_status: string | null
          financial_month: string
          gst_liability: number | null
          gstr_1_filed: boolean | null
          gstr_1_filed_date: string | null
          gstr_3b_filed: boolean | null
          gstr_3b_filed_date: string | null
          gstr_6_filed: boolean | null
          gstr_9_filed: boolean | null
          gstr_9_filed_date: string | null
          id: string
          itc_claimed: number | null
          net_payable: number | null
          tcs_liability: number | null
          total_purchases: number | null
          total_sales: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          due_date?: string | null
          filed_on_time?: boolean | null
          filing_deadline?: string | null
          filing_status?: string | null
          financial_month: string
          gst_liability?: number | null
          gstr_1_filed?: boolean | null
          gstr_1_filed_date?: string | null
          gstr_3b_filed?: boolean | null
          gstr_3b_filed_date?: string | null
          gstr_6_filed?: boolean | null
          gstr_9_filed?: boolean | null
          gstr_9_filed_date?: string | null
          id?: string
          itc_claimed?: number | null
          net_payable?: number | null
          tcs_liability?: number | null
          total_purchases?: number | null
          total_sales?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          due_date?: string | null
          filed_on_time?: boolean | null
          filing_deadline?: string | null
          filing_status?: string | null
          financial_month?: string
          gst_liability?: number | null
          gstr_1_filed?: boolean | null
          gstr_1_filed_date?: string | null
          gstr_3b_filed?: boolean | null
          gstr_3b_filed_date?: string | null
          gstr_6_filed?: boolean | null
          gstr_9_filed?: boolean | null
          gstr_9_filed_date?: string | null
          id?: string
          itc_claimed?: number | null
          net_payable?: number | null
          tcs_liability?: number | null
          total_purchases?: number | null
          total_sales?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gst_filings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          cgst_amount: number
          created_at: string
          customer_gstin: string | null
          customer_name: string
          customer_state: string
          discount_amount: number | null
          gst_slab: string | null
          id: string
          igst_amount: number
          invoice_date: string
          invoice_number: string
          invoice_status: string | null
          issued_at: string | null
          items: Json
          notes: string | null
          payment_status: string | null
          place_of_supply: string
          sgst_amount: number
          subtotal: number
          tcs_deducted: number | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          cgst_amount?: number
          created_at?: string
          customer_gstin?: string | null
          customer_name: string
          customer_state: string
          discount_amount?: number | null
          gst_slab?: string | null
          id?: string
          igst_amount?: number
          invoice_date?: string
          invoice_number: string
          invoice_status?: string | null
          issued_at?: string | null
          items?: Json
          notes?: string | null
          payment_status?: string | null
          place_of_supply: string
          sgst_amount?: number
          subtotal?: number
          tcs_deducted?: number | null
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          cgst_amount?: number
          created_at?: string
          customer_gstin?: string | null
          customer_name?: string
          customer_state?: string
          discount_amount?: number | null
          gst_slab?: string | null
          id?: string
          igst_amount?: number
          invoice_date?: string
          invoice_number?: string
          invoice_status?: string | null
          issued_at?: string | null
          items?: Json
          notes?: string | null
          payment_status?: string | null
          place_of_supply?: string
          sgst_amount?: number
          subtotal?: number
          tcs_deducted?: number | null
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          error_message: string | null
          id: string
          payment_method: string | null
          processed_at: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          error_message?: string | null
          id?: string
          payment_method?: string | null
          processed_at?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          error_message?: string | null
          id?: string
          payment_method?: string | null
          processed_at?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          bis_certificate_number: string | null
          bis_certified: boolean | null
          bis_expiry_date: string | null
          category: string | null
          created_at: string
          gst_rate: string
          hsn_code: string
          id: string
          product_name: string
          sku: string | null
          unit_price: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bis_certificate_number?: string | null
          bis_certified?: boolean | null
          bis_expiry_date?: string | null
          category?: string | null
          created_at?: string
          gst_rate?: string
          hsn_code: string
          id?: string
          product_name: string
          sku?: string | null
          unit_price?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bis_certificate_number?: string | null
          bis_certified?: boolean | null
          bis_expiry_date?: string | null
          category?: string | null
          created_at?: string
          gst_rate?: string
          hsn_code?: string
          id?: string
          product_name?: string
          sku?: string | null
          unit_price?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      seller_profiles: {
        Row: {
          bank_account_number: string | null
          bank_ifsc: string | null
          bis_certified_products: string[] | null
          business_address: string | null
          business_name: string | null
          business_type: Database["public"]["Enums"]["business_type"] | null
          created_at: string
          financial_year_start: string | null
          gst_registration_date: string | null
          gstin: string | null
          id: string
          last_payment_id: string | null
          pan: string | null
          platforms_selling: string[] | null
          product_categories: string[] | null
          razorpay_customer_id: string | null
          registered_address: string | null
          seller_accounts: Json | null
          subscription_active: boolean | null
          subscription_plan_id: string | null
          subscription_status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bank_account_number?: string | null
          bank_ifsc?: string | null
          bis_certified_products?: string[] | null
          business_address?: string | null
          business_name?: string | null
          business_type?: Database["public"]["Enums"]["business_type"] | null
          created_at?: string
          financial_year_start?: string | null
          gst_registration_date?: string | null
          gstin?: string | null
          id?: string
          last_payment_id?: string | null
          pan?: string | null
          platforms_selling?: string[] | null
          product_categories?: string[] | null
          razorpay_customer_id?: string | null
          registered_address?: string | null
          seller_accounts?: Json | null
          subscription_active?: boolean | null
          subscription_plan_id?: string | null
          subscription_status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bank_account_number?: string | null
          bank_ifsc?: string | null
          bis_certified_products?: string[] | null
          business_address?: string | null
          business_name?: string | null
          business_type?: Database["public"]["Enums"]["business_type"] | null
          created_at?: string
          financial_year_start?: string | null
          gst_registration_date?: string | null
          gstin?: string | null
          id?: string
          last_payment_id?: string | null
          pan?: string | null
          platforms_selling?: string[] | null
          product_categories?: string[] | null
          razorpay_customer_id?: string | null
          registered_address?: string | null
          seller_accounts?: Json | null
          subscription_active?: boolean | null
          subscription_plan_id?: string | null
          subscription_status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seller_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number
          billing_cycle: string
          created_at: string
          current_end_date: string | null
          current_start_date: string | null
          id: string
          next_payment_date: string | null
          plan_name: string
          razorpay_plan_id: string | null
          razorpay_subscription_id: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          billing_cycle: string
          created_at?: string
          current_end_date?: string | null
          current_start_date?: string | null
          id?: string
          next_payment_date?: string | null
          plan_name: string
          razorpay_plan_id?: string | null
          razorpay_subscription_id?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          billing_cycle?: string
          created_at?: string
          current_end_date?: string | null
          current_start_date?: string | null
          id?: string
          next_payment_date?: string | null
          plan_name?: string
          razorpay_plan_id?: string | null
          razorpay_subscription_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_calculations: {
        Row: {
          calculation_month: string | null
          calculation_type: string
          created_at: string
          id: string
          input_values: Json
          output_results: Json
          user_id: string
        }
        Insert: {
          calculation_month?: string | null
          calculation_type: string
          created_at?: string
          id?: string
          input_values?: Json
          output_results?: Json
          user_id: string
        }
        Update: {
          calculation_month?: string | null
          calculation_type?: string
          created_at?: string
          id?: string
          input_values?: Json
          output_results?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_calculations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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
      app_role: "admin" | "user"
      business_type: "sole_proprietor" | "partnership" | "pvt_ltd" | "llp"
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
      app_role: ["admin", "user"],
      business_type: ["sole_proprietor", "partnership", "pvt_ltd", "llp"],
    },
  },
} as const
