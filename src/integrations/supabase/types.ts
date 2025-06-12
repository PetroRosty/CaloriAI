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
      chat_logs: {
        Row: {
          chat_id: number
          content: string
          created_at: string
          first_name: string | null
          id: number
          metadata: Json | null
          role: string
          session_id: string
          username: string | null
        }
        Insert: {
          chat_id: number
          content: string
          created_at?: string
          first_name?: string | null
          id?: number
          metadata?: Json | null
          role: string
          session_id: string
          username?: string | null
        }
        Update: {
          chat_id?: number
          content?: string
          created_at?: string
          first_name?: string | null
          id?: number
          metadata?: Json | null
          role?: string
          session_id?: string
          username?: string | null
        }
        Relationships: []
      }
      digests: {
        Row: {
          carb: number
          chat_id: number
          fat: number
          for_date: string
          id: number
          kcal: number
          meals_json: Json
          msg_id: number | null
          prot: number
          summary_md: string
          updated_at: string
        }
        Insert: {
          carb: number
          chat_id: number
          fat: number
          for_date: string
          id?: number
          kcal: number
          meals_json: Json
          msg_id?: number | null
          prot: number
          summary_md: string
          updated_at?: string
        }
        Update: {
          carb?: number
          chat_id?: number
          fat?: number
          for_date?: string
          id?: number
          kcal?: number
          meals_json?: Json
          msg_id?: number | null
          prot?: number
          summary_md?: string
          updated_at?: string
        }
        Relationships: []
      }
      meals: {
        Row: {
          carb: number
          chat_id: number
          created_at: string
          deleted: boolean
          dish: string
          eaten_at: string
          eaten_day: string | null
          fat: number
          grams: number
          id: number
          kcal: number
          prot: number
          updated_at: string
        }
        Insert: {
          carb: number
          chat_id: number
          created_at?: string
          deleted?: boolean
          dish: string
          eaten_at: string
          eaten_day?: string | null
          fat: number
          grams: number
          id?: number
          kcal: number
          prot: number
          updated_at?: string
        }
        Update: {
          carb?: number
          chat_id?: number
          created_at?: string
          deleted?: boolean
          dish?: string
          eaten_at?: string
          eaten_day?: string | null
          fat?: number
          grams?: number
          id?: number
          kcal?: number
          prot?: number
          updated_at?: string
        }
        Relationships: []
      }
      meals_draft: {
        Row: {
          candidates: Json | null
          chat_id: number
          chosen_name: string | null
          created_at: string
          grams_pred: number | null
          id: number
          message_id: number
          photo_file_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          candidates?: Json | null
          chat_id: number
          chosen_name?: string | null
          created_at?: string
          grams_pred?: number | null
          id?: number
          message_id: number
          photo_file_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          candidates?: Json | null
          chat_id?: number
          chosen_name?: string | null
          created_at?: string
          grams_pred?: number | null
          id?: number
          message_id?: number
          photo_file_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: number
          locale: string | null
          telegram_id: number
          username: string | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id?: number
          locale?: string | null
          telegram_id: number
          username?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: number
          locale?: string | null
          telegram_id?: number
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_summary: {
        Args: { _chat_id: number }
        Returns: {
          chat_id: number
          for_date: string
          kcal: number
          prot: number
          fat: number
          carb: number
          meals_json: Json
          summary_md: string
        }[]
      }
      upsert_digest: {
        Args: {
          _chat_id: number
          _for_date: string
          _kcal: number
          _prot: number
          _fat: number
          _carb: number
          _meals_json: Json
          _summary_md: string
          _msg_id: number
        }
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
