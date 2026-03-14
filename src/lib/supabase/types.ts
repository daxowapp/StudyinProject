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
      academic_years: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_active: boolean | null
          name: string
          start_date: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_active?: boolean | null
          name: string
          start_date: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          start_date?: string
        }
        Relationships: []
      }
      acceptance_letters: {
        Row: {
          application_id: string
          confirmed_at: string | null
          created_at: string | null
          id: string
          issue_date: string
          issued_by: string | null
          jw202_form_url: string | null
          letter_number: string
          letter_pdf_url: string | null
          notes: string | null
          sent_at: string | null
          sent_to_student: boolean | null
          student_confirmed: boolean | null
          updated_at: string | null
          valid_until: string | null
          visa_letter_url: string | null
        }
        Insert: {
          application_id: string
          confirmed_at?: string | null
          created_at?: string | null
          id?: string
          issue_date: string
          issued_by?: string | null
          jw202_form_url?: string | null
          letter_number: string
          letter_pdf_url?: string | null
          notes?: string | null
          sent_at?: string | null
          sent_to_student?: boolean | null
          student_confirmed?: boolean | null
          updated_at?: string | null
          valid_until?: string | null
          visa_letter_url?: string | null
        }
        Update: {
          application_id?: string
          confirmed_at?: string | null
          created_at?: string | null
          id?: string
          issue_date?: string
          issued_by?: string | null
          jw202_form_url?: string | null
          letter_number?: string
          letter_pdf_url?: string | null
          notes?: string | null
          sent_at?: string | null
          sent_to_student?: boolean | null
          student_confirmed?: boolean | null
          updated_at?: string | null
          valid_until?: string | null
          visa_letter_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "acceptance_letters_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "acceptance_letters_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "v_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "acceptance_letters_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "v_pending_actions"
            referencedColumns: ["application_id"]
          },
        ]
      }
      accommodation_translations: {
        Row: {
          accommodation_description: string | null
          accommodation_features: Json | null
          accommodation_types: Json | null
          created_at: string | null
          id: string
          locale: string
          university_id: string
          updated_at: string | null
        }
        Insert: {
          accommodation_description?: string | null
          accommodation_features?: Json | null
          accommodation_types?: Json | null
          created_at?: string | null
          id?: string
          locale: string
          university_id: string
          updated_at?: string | null
        }
        Update: {
          accommodation_description?: string | null
          accommodation_features?: Json | null
          accommodation_types?: Json | null
          created_at?: string | null
          id?: string
          locale?: string
          university_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accommodation_translations_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accommodation_translations_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["university_id"]
          },
          {
            foreignKeyName: "accommodation_translations_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_universities_search"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accommodation_translations_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_university_stats"
            referencedColumns: ["university_id"]
          },
        ]
      }
      admission_requirements_catalog: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
          is_common: boolean | null
          requirement_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: string
          is_common?: boolean | null
          requirement_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          is_common?: boolean | null
          requirement_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      application_documents: {
        Row: {
          application_id: string
          created_at: string | null
          document_name: string
          document_type: string | null
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_verified: boolean | null
          requirement_id: string
          uploaded_at: string | null
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          application_id: string
          created_at?: string | null
          document_name: string
          document_type?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_verified?: boolean | null
          requirement_id: string
          uploaded_at?: string | null
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string | null
          document_name?: string
          document_type?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_verified?: boolean | null
          requirement_id?: string
          uploaded_at?: string | null
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "v_pending_actions"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "application_documents_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "admission_requirements_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      application_messages: {
        Row: {
          action_completed: boolean | null
          action_completed_at: string | null
          action_deadline: string | null
          action_type: string | null
          application_id: string
          attachments: Json | null
          created_at: string | null
          email_sent: boolean | null
          email_sent_at: string | null
          id: string
          is_read: boolean | null
          message: string
          message_type: string
          parent_message_id: string | null
          read_at: string | null
          requires_action: boolean | null
          sender_id: string
          sender_type: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          action_completed?: boolean | null
          action_completed_at?: string | null
          action_deadline?: string | null
          action_type?: string | null
          application_id: string
          attachments?: Json | null
          created_at?: string | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          message_type: string
          parent_message_id?: string | null
          read_at?: string | null
          requires_action?: boolean | null
          sender_id: string
          sender_type: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          action_completed?: boolean | null
          action_completed_at?: string | null
          action_deadline?: string | null
          action_type?: string | null
          application_id?: string
          attachments?: Json | null
          created_at?: string | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          message_type?: string
          parent_message_id?: string | null
          read_at?: string | null
          requires_action?: boolean | null
          sender_id?: string
          sender_type?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "v_pending_actions"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "application_messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "application_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      application_status_history: {
        Row: {
          application_id: string
          change_reason: string | null
          changed_by: string | null
          created_at: string | null
          id: string
          new_status: string
          notes: string | null
          old_status: string | null
        }
        Insert: {
          application_id: string
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status: string
          notes?: string | null
          old_status?: string | null
        }
        Update: {
          application_id?: string
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status?: string
          notes?: string | null
          old_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_status_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_status_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_status_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "v_pending_actions"
            referencedColumns: ["application_id"]
          },
        ]
      }
      application_status_logs: {
        Row: {
          application_id: string | null
          changed_by: string | null
          created_at: string | null
          id: string
          new_status: string | null
          old_status: string | null
        }
        Insert: {
          application_id?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status?: string | null
          old_status?: string | null
        }
        Update: {
          application_id?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status?: string | null
          old_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_status_logs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_status_logs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_status_logs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "v_pending_actions"
            referencedColumns: ["application_id"]
          },
        ]
      }
      applications: {
        Row: {
          acceptance_letter_url: string | null
          admin_notes: string | null
          contacted_at: string | null
          created_at: string | null
          decision_at: string | null
          documents_complete: boolean | null
          documents_verified: boolean | null
          documents_verified_at: string | null
          documents_verified_by: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          id: string
          payment_amount: number | null
          payment_currency: string | null
          payment_date: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: string | null
          portal_key: string | null
          preferred_intake: string | null
          rejection_reason: string | null
          requested_documents: string[] | null
          reviewed_at: string | null
          status: string | null
          student_country: string | null
          student_email: string
          student_id: string
          student_name: string
          student_passport: string | null
          student_phone: string | null
          submitted_at: string | null
          university_program_id: string
          updated_at: string | null
        }
        Insert: {
          acceptance_letter_url?: string | null
          admin_notes?: string | null
          contacted_at?: string | null
          created_at?: string | null
          decision_at?: string | null
          documents_complete?: boolean | null
          documents_verified?: boolean | null
          documents_verified_at?: string | null
          documents_verified_by?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          id?: string
          payment_amount?: number | null
          payment_currency?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          portal_key?: string | null
          preferred_intake?: string | null
          rejection_reason?: string | null
          requested_documents?: string[] | null
          reviewed_at?: string | null
          status?: string | null
          student_country?: string | null
          student_email: string
          student_id: string
          student_name: string
          student_passport?: string | null
          student_phone?: string | null
          submitted_at?: string | null
          university_program_id: string
          updated_at?: string | null
        }
        Update: {
          acceptance_letter_url?: string | null
          admin_notes?: string | null
          contacted_at?: string | null
          created_at?: string | null
          decision_at?: string | null
          documents_complete?: boolean | null
          documents_verified?: boolean | null
          documents_verified_at?: string | null
          documents_verified_by?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          id?: string
          payment_amount?: number | null
          payment_currency?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          portal_key?: string | null
          preferred_intake?: string | null
          rejection_reason?: string | null
          requested_documents?: string[] | null
          reviewed_at?: string | null
          status?: string | null
          student_country?: string | null
          student_email?: string
          student_id?: string
          student_name?: string
          student_passport?: string | null
          student_phone?: string | null
          submitted_at?: string | null
          university_program_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_university_program_id_fkey"
            columns: ["university_program_id"]
            isOneToOne: false
            referencedRelation: "university_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_university_program_id_fkey"
            columns: ["university_program_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "applications_university_program_id_fkey"
            columns: ["university_program_id"]
            isOneToOne: false
            referencedRelation: "v_scholarship_programs"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "applications_university_program_id_fkey"
            columns: ["university_program_id"]
            isOneToOne: false
            referencedRelation: "v_university_programs_full"
            referencedColumns: ["id"]
          },
        ]
      }
      article_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          is_featured: boolean | null
          meta_description: string | null
          meta_title: string | null
          portal_key: string | null
          published_at: string | null
          reading_time: number | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          portal_key?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          portal_key?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          application_context: Json | null
          context: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          locale: string | null
          messages: Json
          session_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          application_context?: Json | null
          context?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          locale?: string | null
          messages?: Json
          session_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          application_context?: Json | null
          context?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          locale?: string | null
          messages?: Json
          session_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      document_requests: {
        Row: {
          application_id: string
          created_at: string | null
          deadline: string | null
          description: string | null
          document_name: string
          document_type: string
          id: string
          is_mandatory: boolean | null
          message_id: string | null
          rejection_reason: string | null
          requested_by: string | null
          status: string | null
          updated_at: string | null
          uploaded_at: string | null
          uploaded_document_id: string | null
          uploaded_file_url: string | null
        }
        Insert: {
          application_id: string
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          document_name: string
          document_type: string
          id?: string
          is_mandatory?: boolean | null
          message_id?: string | null
          rejection_reason?: string | null
          requested_by?: string | null
          status?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          uploaded_document_id?: string | null
          uploaded_file_url?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          document_name?: string
          document_type?: string
          id?: string
          is_mandatory?: boolean | null
          message_id?: string | null
          rejection_reason?: string | null
          requested_by?: string | null
          status?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          uploaded_document_id?: string | null
          uploaded_file_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_requests_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_requests_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_requests_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "v_pending_actions"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "document_requests_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "application_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_requests_uploaded_document_id_fkey"
            columns: ["uploaded_document_id"]
            isOneToOne: false
            referencedRelation: "application_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      email_notifications: {
        Row: {
          application_id: string | null
          body: string
          clicked_at: string | null
          created_at: string | null
          delivered_at: string | null
          email_type: string
          error_message: string | null
          html_body: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          opened_at: string | null
          payment_id: string | null
          recipient_email: string
          recipient_id: string
          retry_count: number | null
          sent_at: string | null
          status: string | null
          subject: string
        }
        Insert: {
          application_id?: string | null
          body: string
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          email_type: string
          error_message?: string | null
          html_body?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          opened_at?: string | null
          payment_id?: string | null
          recipient_email: string
          recipient_id: string
          retry_count?: number | null
          sent_at?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          application_id?: string | null
          body?: string
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          email_type?: string
          error_message?: string | null
          html_body?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          opened_at?: string | null
          payment_id?: string | null
          recipient_email?: string
          recipient_id?: string
          retry_count?: number | null
          sent_at?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_notifications_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_notifications_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_notifications_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "v_pending_actions"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "email_notifications_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "application_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_notifications_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      intakes: {
        Row: {
          academic_year_id: string
          created_at: string
          end_date: string
          id: string
          is_open: boolean | null
          name: string
          start_date: string
        }
        Insert: {
          academic_year_id: string
          created_at?: string
          end_date: string
          id?: string
          is_open?: boolean | null
          name: string
          start_date: string
        }
        Update: {
          academic_year_id?: string
          created_at?: string
          end_date?: string
          id?: string
          is_open?: boolean | null
          name?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "intakes_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_schedules: {
        Row: {
          application_id: string
          confirmed_at: string | null
          created_at: string | null
          created_by: string | null
          duration_minutes: number | null
          id: string
          interview_notes: string | null
          interview_type: string | null
          interviewer_email: string | null
          interviewer_name: string | null
          location: string | null
          meeting_link: string | null
          meeting_password: string | null
          notes: string | null
          result: string | null
          scheduled_date: string
          status: string | null
          student_confirmed: boolean | null
          updated_at: string | null
        }
        Insert: {
          application_id: string
          confirmed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          duration_minutes?: number | null
          id?: string
          interview_notes?: string | null
          interview_type?: string | null
          interviewer_email?: string | null
          interviewer_name?: string | null
          location?: string | null
          meeting_link?: string | null
          meeting_password?: string | null
          notes?: string | null
          result?: string | null
          scheduled_date: string
          status?: string | null
          student_confirmed?: boolean | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string
          confirmed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          duration_minutes?: number | null
          id?: string
          interview_notes?: string | null
          interview_type?: string | null
          interviewer_email?: string | null
          interviewer_name?: string | null
          location?: string | null
          meeting_link?: string | null
          meeting_password?: string | null
          notes?: string | null
          result?: string | null
          scheduled_date?: string
          status?: string | null
          student_confirmed?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interview_schedules_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interview_schedules_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interview_schedules_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "v_pending_actions"
            referencedColumns: ["application_id"]
          },
        ]
      }
      languages: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          country: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          portal_key: string | null
          source: string | null
          status: string | null
          study_interest: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          portal_key?: string | null
          source?: string | null
          status?: string | null
          study_interest?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          portal_key?: string | null
          source?: string | null
          status?: string | null
          study_interest?: string | null
        }
        Relationships: []
      }
      message_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          message_id: string
          mime_type: string | null
          uploaded_by: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          message_id: string
          mime_type?: string | null
          uploaded_by: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          message_id?: string
          mime_type?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "application_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      nau_documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_application_updates: boolean | null
          email_deadlines: boolean | null
          email_document_requests: boolean | null
          email_marketing: boolean | null
          email_messages: boolean | null
          email_payment_requests: boolean | null
          email_status_changes: boolean | null
          id: string
          sms_enabled: boolean | null
          sms_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_application_updates?: boolean | null
          email_deadlines?: boolean | null
          email_document_requests?: boolean | null
          email_marketing?: boolean | null
          email_messages?: boolean | null
          email_payment_requests?: boolean | null
          email_status_changes?: boolean | null
          id?: string
          sms_enabled?: boolean | null
          sms_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_application_updates?: boolean | null
          email_deadlines?: boolean | null
          email_document_requests?: boolean | null
          email_marketing?: boolean | null
          email_messages?: boolean | null
          email_payment_requests?: boolean | null
          email_status_changes?: boolean | null
          id?: string
          sms_enabled?: boolean | null
          sms_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          title: string
          type: string
          userId: string
        }
        Insert: {
          created_at?: string
          id: string
          link?: string | null
          message: string
          read?: boolean
          title: string
          type?: string
          userId: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          type?: string
          userId?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          admin_verified: boolean | null
          amount: number
          application_id: string
          created_at: string | null
          currency: string | null
          deadline: string | null
          id: string
          metadata: Json | null
          paid_at: string | null
          payment_gateway: string | null
          payment_link: string | null
          payment_link_expires_at: string | null
          payment_method: string | null
          payment_proof_url: string | null
          payment_reference: string | null
          payment_type: string
          receipt_url: string | null
          refund_amount: number | null
          refund_reason: string | null
          refunded_at: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          student_id: string
          transaction_id: string | null
          updated_at: string | null
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          admin_verified?: boolean | null
          amount: number
          application_id: string
          created_at?: string | null
          currency?: string | null
          deadline?: string | null
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          payment_gateway?: string | null
          payment_link?: string | null
          payment_link_expires_at?: string | null
          payment_method?: string | null
          payment_proof_url?: string | null
          payment_reference?: string | null
          payment_type: string
          receipt_url?: string | null
          refund_amount?: number | null
          refund_reason?: string | null
          refunded_at?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          student_id: string
          transaction_id?: string | null
          updated_at?: string | null
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          admin_verified?: boolean | null
          amount?: number
          application_id?: string
          created_at?: string | null
          currency?: string | null
          deadline?: string | null
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          payment_gateway?: string | null
          payment_link?: string | null
          payment_link_expires_at?: string | null
          payment_method?: string | null
          payment_proof_url?: string | null
          payment_reference?: string | null
          payment_type?: string
          receipt_url?: string | null
          refund_amount?: number | null
          refund_reason?: string | null
          refunded_at?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          student_id?: string
          transaction_id?: string | null
          updated_at?: string | null
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "v_pending_actions"
            referencedColumns: ["application_id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          created_at: string
          description: string | null
          id: string
          module: string
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          id?: string
          module: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          id?: string
          module?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          emergency_phone_code: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          nationality: string | null
          passport_number: string | null
          phone: string | null
          phone_country_code: string | null
          portal_key: string | null
          postal_code: string | null
          profile_completed_at: string | null
          profile_photo_url: string | null
          role: string | null
          role_id: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          emergency_phone_code?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          nationality?: string | null
          passport_number?: string | null
          phone?: string | null
          phone_country_code?: string | null
          portal_key?: string | null
          postal_code?: string | null
          profile_completed_at?: string | null
          profile_photo_url?: string | null
          role?: string | null
          role_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          emergency_phone_code?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          nationality?: string | null
          passport_number?: string | null
          phone?: string | null
          phone_country_code?: string | null
          portal_key?: string | null
          postal_code?: string | null
          profile_completed_at?: string | null
          profile_photo_url?: string | null
          role?: string | null
          role_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      program_admission_requirements: {
        Row: {
          category: string
          created_at: string | null
          custom_description: string | null
          custom_title: string | null
          display_order: number | null
          id: string
          is_required: boolean | null
          program_id: string
          requirement_id: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          custom_description?: string | null
          custom_title?: string | null
          display_order?: number | null
          id?: string
          is_required?: boolean | null
          program_id: string
          requirement_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          custom_description?: string | null
          custom_title?: string | null
          display_order?: number | null
          id?: string
          is_required?: boolean | null
          program_id?: string
          requirement_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_admission_requirements_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "university_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_admission_requirements_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "program_admission_requirements_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "v_scholarship_programs"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "program_admission_requirements_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "v_university_programs_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_admission_requirements_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "admission_requirements_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      program_catalog: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          field: string | null
          id: string
          level: string
          title: string
          typical_duration: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          field?: string | null
          id?: string
          level: string
          title: string
          typical_duration?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          field?: string | null
          id?: string
          level?: string
          title?: string
          typical_duration?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      program_intakes: {
        Row: {
          created_at: string | null
          id: string
          intake_id: string
          program_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          intake_id: string
          program_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          intake_id?: string
          program_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_intakes_intake_id_fkey"
            columns: ["intake_id"]
            isOneToOne: false
            referencedRelation: "intakes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_intakes_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "university_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_intakes_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "program_intakes_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "v_scholarship_programs"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "program_intakes_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "v_university_programs_full"
            referencedColumns: ["id"]
          },
        ]
      }
      program_translations: {
        Row: {
          career_prospects: Json | null
          created_at: string | null
          description: string | null
          id: string
          locale: string
          program_id: string
          requirements: Json | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          career_prospects?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          locale: string
          program_id: string
          requirements?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          career_prospects?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          locale?: string
          program_id?: string
          requirements?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_translations_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "university_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_translations_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "program_translations_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "v_scholarship_programs"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "program_translations_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "v_university_programs_full"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          application_fee: number | null
          created_at: string
          currency: string | null
          deadline: string | null
          description: string | null
          duration: string | null
          field: string | null
          has_force_payment: boolean | null
          id: string
          intake: string | null
          is_active: boolean | null
          language: string | null
          language_id: string | null
          level: string
          requirements: Json | null
          scholarship_chance: string | null
          service_fee: number | null
          title: string
          tuition_fee: number | null
          tuition_unit: string | null
          university_id: string
        }
        Insert: {
          application_fee?: number | null
          created_at?: string
          currency?: string | null
          deadline?: string | null
          description?: string | null
          duration?: string | null
          field?: string | null
          has_force_payment?: boolean | null
          id?: string
          intake?: string | null
          is_active?: boolean | null
          language?: string | null
          language_id?: string | null
          level: string
          requirements?: Json | null
          scholarship_chance?: string | null
          service_fee?: number | null
          title: string
          tuition_fee?: number | null
          tuition_unit?: string | null
          university_id: string
        }
        Update: {
          application_fee?: number | null
          created_at?: string
          currency?: string | null
          deadline?: string | null
          description?: string | null
          duration?: string | null
          field?: string | null
          has_force_payment?: boolean | null
          id?: string
          intake?: string | null
          is_active?: boolean | null
          language?: string | null
          language_id?: string | null
          level?: string
          requirements?: Json | null
          scholarship_chance?: string | null
          service_fee?: number | null
          title?: string
          tuition_fee?: number | null
          tuition_unit?: string | null
          university_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["university_id"]
          },
          {
            foreignKeyName: "programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_universities_search"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_university_stats"
            referencedColumns: ["university_id"]
          },
        ]
      }
      refund_requests: {
        Row: {
          admin_response: string | null
          amount: number | null
          application_id: string
          created_at: string | null
          currency: string | null
          id: string
          processed_at: string | null
          processed_by: string | null
          reason: string
          status: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          admin_response?: string | null
          amount?: number | null
          application_id: string
          created_at?: string | null
          currency?: string | null
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason: string
          status?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          admin_response?: string | null
          amount?: number | null
          application_id?: string
          created_at?: string | null
          currency?: string | null
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string
          status?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refund_requests_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refund_requests_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "v_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refund_requests_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "v_pending_actions"
            referencedColumns: ["application_id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          id: string
          is_system: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          is_system?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          is_system?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      scholarship_applications: {
        Row: {
          admin_notes: string | null
          application_status: string | null
          applied_at: string | null
          created_at: string | null
          documents: Json | null
          id: string
          program_id: string | null
          reviewed_at: string | null
          scholarship_id: string
          student_email: string
          student_id: string | null
          student_name: string
          student_notes: string | null
          student_phone: string | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          application_status?: string | null
          applied_at?: string | null
          created_at?: string | null
          documents?: Json | null
          id?: string
          program_id?: string | null
          reviewed_at?: string | null
          scholarship_id: string
          student_email: string
          student_id?: string | null
          student_name: string
          student_notes?: string | null
          student_phone?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          application_status?: string | null
          applied_at?: string | null
          created_at?: string | null
          documents?: Json | null
          id?: string
          program_id?: string | null
          reviewed_at?: string | null
          scholarship_id?: string
          student_email?: string
          student_id?: string | null
          student_name?: string
          student_notes?: string | null
          student_phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scholarship_applications_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scholarship_applications_scholarship_id_fkey"
            columns: ["scholarship_id"]
            isOneToOne: false
            referencedRelation: "university_scholarships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scholarship_applications_scholarship_id_fkey"
            columns: ["scholarship_id"]
            isOneToOne: false
            referencedRelation: "v_scholarship_programs"
            referencedColumns: ["scholarship_id"]
          },
        ]
      }
      scholarship_translations: {
        Row: {
          accommodation_type: string | null
          additional_benefits: Json | null
          created_at: string | null
          description: string | null
          display_name: string | null
          id: string
          locale: string
          requirements: Json | null
          scholarship_id: string
          updated_at: string | null
        }
        Insert: {
          accommodation_type?: string | null
          additional_benefits?: Json | null
          created_at?: string | null
          description?: string | null
          display_name?: string | null
          id?: string
          locale: string
          requirements?: Json | null
          scholarship_id: string
          updated_at?: string | null
        }
        Update: {
          accommodation_type?: string | null
          additional_benefits?: Json | null
          created_at?: string | null
          description?: string | null
          display_name?: string | null
          id?: string
          locale?: string
          requirements?: Json | null
          scholarship_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scholarship_translations_scholarship_id_fkey"
            columns: ["scholarship_id"]
            isOneToOne: false
            referencedRelation: "university_scholarships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scholarship_translations_scholarship_id_fkey"
            columns: ["scholarship_id"]
            isOneToOne: false
            referencedRelation: "v_scholarship_programs"
            referencedColumns: ["scholarship_id"]
          },
        ]
      }
      settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string | null
          updated_by: string | null
          value: string | null
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string | null
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string | null
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      student_documents: {
        Row: {
          document_name: string
          document_type: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_read: boolean | null
          is_verified: boolean | null
          notes: string | null
          student_id: string
          uploaded_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          document_name: string
          document_type: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_read?: boolean | null
          is_verified?: boolean | null
          notes?: string | null
          student_id: string
          uploaded_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          document_name?: string
          document_type?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_read?: boolean | null
          is_verified?: boolean | null
          notes?: string | null
          student_id?: string
          uploaded_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      universities: {
        Row: {
          accommodation_available: boolean | null
          accommodation_description: string | null
          accommodation_features: string[] | null
          accommodation_fee_range: string | null
          accommodation_types: Json | null
          advisor_chat_url: string | null
          banner_url: string | null
          brochure_url: string | null
          city: string
          cover_photo_url: string | null
          created_at: string
          description: string | null
          features: string[] | null
          founded: string | null
          founded_year: string | null
          gallery_images: string[] | null
          has_fast_track: boolean | null
          id: string
          institution_category: string | null
          international_students: string | null
          intl_student_count: string | null
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          name: string
          name_local: string | null
          portal_key: string
          province: string | null
          ranking: string | null
          schedule_call_url: string | null
          slug: string
          student_count: string | null
          total_students: string | null
          university_type: string | null
          updated_at: string | null
          video_url: string | null
          virtual_tour_url: string | null
          website: string | null
        }
        Insert: {
          accommodation_available?: boolean | null
          accommodation_description?: string | null
          accommodation_features?: string[] | null
          accommodation_fee_range?: string | null
          accommodation_types?: Json | null
          advisor_chat_url?: string | null
          banner_url?: string | null
          brochure_url?: string | null
          city: string
          cover_photo_url?: string | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          founded?: string | null
          founded_year?: string | null
          gallery_images?: string[] | null
          has_fast_track?: boolean | null
          id?: string
          institution_category?: string | null
          international_students?: string | null
          intl_student_count?: string | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name: string
          name_local?: string | null
          portal_key?: string
          province?: string | null
          ranking?: string | null
          schedule_call_url?: string | null
          slug: string
          student_count?: string | null
          total_students?: string | null
          university_type?: string | null
          updated_at?: string | null
          video_url?: string | null
          virtual_tour_url?: string | null
          website?: string | null
        }
        Update: {
          accommodation_available?: boolean | null
          accommodation_description?: string | null
          accommodation_features?: string[] | null
          accommodation_fee_range?: string | null
          accommodation_types?: Json | null
          advisor_chat_url?: string | null
          banner_url?: string | null
          brochure_url?: string | null
          city?: string
          cover_photo_url?: string | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          founded?: string | null
          founded_year?: string | null
          gallery_images?: string[] | null
          has_fast_track?: boolean | null
          id?: string
          institution_category?: string | null
          international_students?: string | null
          intl_student_count?: string | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          name_local?: string | null
          portal_key?: string
          province?: string | null
          ranking?: string | null
          schedule_call_url?: string | null
          slug?: string
          student_count?: string | null
          total_students?: string | null
          university_type?: string | null
          updated_at?: string | null
          video_url?: string | null
          virtual_tour_url?: string | null
          website?: string | null
        }
        Relationships: []
      }
      university_accommodation: {
        Row: {
          billing_period: string | null
          campus: string | null
          created_at: string
          currency: string | null
          description: string | null
          display_order: number | null
          features: string[] | null
          id: string
          occupancy: number | null
          portal_key: string | null
          price_basis: string | null
          price_cny: number | null
          price_max: number | null
          price_min: number | null
          price_usd: number | null
          room_type: string | null
          type: string | null
          university_id: string
          updated_at: string
        }
        Insert: {
          billing_period?: string | null
          campus?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          display_order?: number | null
          features?: string[] | null
          id?: string
          occupancy?: number | null
          portal_key?: string | null
          price_basis?: string | null
          price_cny?: number | null
          price_max?: number | null
          price_min?: number | null
          price_usd?: number | null
          room_type?: string | null
          type?: string | null
          university_id: string
          updated_at?: string
        }
        Update: {
          billing_period?: string | null
          campus?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          display_order?: number | null
          features?: string[] | null
          id?: string
          occupancy?: number | null
          portal_key?: string | null
          price_basis?: string | null
          price_cny?: number | null
          price_max?: number | null
          price_min?: number | null
          price_usd?: number | null
          room_type?: string | null
          type?: string | null
          university_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "university_accommodation_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_accommodation_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["university_id"]
          },
          {
            foreignKeyName: "university_accommodation_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_universities_search"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_accommodation_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_university_stats"
            referencedColumns: ["university_id"]
          },
        ]
      }
      university_admission_requirements: {
        Row: {
          created_at: string | null
          custom_note: string | null
          display_order: number | null
          id: string
          is_required: boolean | null
          program_level: string | null
          requirement_id: string
          university_id: string
        }
        Insert: {
          created_at?: string | null
          custom_note?: string | null
          display_order?: number | null
          id?: string
          is_required?: boolean | null
          program_level?: string | null
          requirement_id: string
          university_id: string
        }
        Update: {
          created_at?: string | null
          custom_note?: string | null
          display_order?: number | null
          id?: string
          is_required?: boolean | null
          program_level?: string | null
          requirement_id?: string
          university_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "university_admission_requirements_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "admission_requirements_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_admission_requirements_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_admission_requirements_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["university_id"]
          },
          {
            foreignKeyName: "university_admission_requirements_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_universities_search"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_admission_requirements_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_university_stats"
            referencedColumns: ["university_id"]
          },
        ]
      }
      university_programs: {
        Row: {
          application_deadline: string | null
          application_fee: number | null
          created_at: string | null
          credits: string | null
          currency: string | null
          custom_title: string | null
          duration: string | null
          education_type: string | null
          english_requirement: string | null
          entry_requirements: string | null
          force_payment: boolean | null
          gpa_requirement: string | null
          has_custom_requirements: boolean | null
          id: string
          intake: string | null
          is_active: boolean | null
          language_id: string | null
          max_age: number | null
          min_age: number | null
          notes: string | null
          portal_key: string | null
          program_catalog_id: string
          scholarship_chance: string | null
          score_duolingo: number | null
          score_ielts: number | null
          score_toefl: number | null
          service_fee: number | null
          slug: string | null
          tuition_fee: number | null
          university_id: string
          updated_at: string | null
        }
        Insert: {
          application_deadline?: string | null
          application_fee?: number | null
          created_at?: string | null
          credits?: string | null
          currency?: string | null
          custom_title?: string | null
          duration?: string | null
          education_type?: string | null
          english_requirement?: string | null
          entry_requirements?: string | null
          force_payment?: boolean | null
          gpa_requirement?: string | null
          has_custom_requirements?: boolean | null
          id?: string
          intake?: string | null
          is_active?: boolean | null
          language_id?: string | null
          max_age?: number | null
          min_age?: number | null
          notes?: string | null
          portal_key?: string | null
          program_catalog_id: string
          scholarship_chance?: string | null
          score_duolingo?: number | null
          score_ielts?: number | null
          score_toefl?: number | null
          service_fee?: number | null
          slug?: string | null
          tuition_fee?: number | null
          university_id: string
          updated_at?: string | null
        }
        Update: {
          application_deadline?: string | null
          application_fee?: number | null
          created_at?: string | null
          credits?: string | null
          currency?: string | null
          custom_title?: string | null
          duration?: string | null
          education_type?: string | null
          english_requirement?: string | null
          entry_requirements?: string | null
          force_payment?: boolean | null
          gpa_requirement?: string | null
          has_custom_requirements?: boolean | null
          id?: string
          intake?: string | null
          is_active?: boolean | null
          language_id?: string | null
          max_age?: number | null
          min_age?: number | null
          notes?: string | null
          portal_key?: string | null
          program_catalog_id?: string
          scholarship_chance?: string | null
          score_duolingo?: number | null
          score_ielts?: number | null
          score_toefl?: number | null
          service_fee?: number | null
          slug?: string | null
          tuition_fee?: number | null
          university_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "university_programs_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_programs_program_catalog_id_fkey"
            columns: ["program_catalog_id"]
            isOneToOne: false
            referencedRelation: "program_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_programs_program_catalog_id_fkey"
            columns: ["program_catalog_id"]
            isOneToOne: false
            referencedRelation: "v_university_programs_full"
            referencedColumns: ["program_catalog_id"]
          },
          {
            foreignKeyName: "university_programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["university_id"]
          },
          {
            foreignKeyName: "university_programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_universities_search"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_university_stats"
            referencedColumns: ["university_id"]
          },
        ]
      }
      university_scholarships: {
        Row: {
          accommodation_type: string | null
          additional_benefits: Json | null
          created_at: string | null
          description: string | null
          display_name: string | null
          display_order: number | null
          duration_years: number | null
          id: string
          includes_accommodation: boolean | null
          includes_medical_insurance: boolean | null
          includes_stipend: boolean | null
          is_active: boolean | null
          is_popular: boolean | null
          one_time_allowance: number | null
          one_time_allowance_currency: string | null
          portal_key: string | null
          requirements: Json | null
          service_fee_cny: number | null
          service_fee_usd: number | null
          stipend_amount_monthly: number | null
          stipend_currency: string | null
          stipend_duration_months: number | null
          tuition_coverage_percentage: number | null
          type_name: string
          university_id: string
          updated_at: string | null
        }
        Insert: {
          accommodation_type?: string | null
          additional_benefits?: Json | null
          created_at?: string | null
          description?: string | null
          display_name?: string | null
          display_order?: number | null
          duration_years?: number | null
          id?: string
          includes_accommodation?: boolean | null
          includes_medical_insurance?: boolean | null
          includes_stipend?: boolean | null
          is_active?: boolean | null
          is_popular?: boolean | null
          one_time_allowance?: number | null
          one_time_allowance_currency?: string | null
          portal_key?: string | null
          requirements?: Json | null
          service_fee_cny?: number | null
          service_fee_usd?: number | null
          stipend_amount_monthly?: number | null
          stipend_currency?: string | null
          stipend_duration_months?: number | null
          tuition_coverage_percentage?: number | null
          type_name: string
          university_id: string
          updated_at?: string | null
        }
        Update: {
          accommodation_type?: string | null
          additional_benefits?: Json | null
          created_at?: string | null
          description?: string | null
          display_name?: string | null
          display_order?: number | null
          duration_years?: number | null
          id?: string
          includes_accommodation?: boolean | null
          includes_medical_insurance?: boolean | null
          includes_stipend?: boolean | null
          is_active?: boolean | null
          is_popular?: boolean | null
          one_time_allowance?: number | null
          one_time_allowance_currency?: string | null
          portal_key?: string | null
          requirements?: Json | null
          service_fee_cny?: number | null
          service_fee_usd?: number | null
          stipend_amount_monthly?: number | null
          stipend_currency?: string | null
          stipend_duration_months?: number | null
          tuition_coverage_percentage?: number | null
          type_name?: string
          university_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "university_scholarships_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_scholarships_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["university_id"]
          },
          {
            foreignKeyName: "university_scholarships_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_universities_search"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_scholarships_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_university_stats"
            referencedColumns: ["university_id"]
          },
        ]
      }
      university_translations: {
        Row: {
          created_at: string | null
          description: string | null
          features: string[] | null
          id: string
          locale: string
          name: string | null
          university_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          locale: string
          name?: string | null
          university_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          locale?: string
          name?: string | null
          university_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "university_translations_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_translations_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["university_id"]
          },
          {
            foreignKeyName: "university_translations_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_universities_search"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_translations_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_university_stats"
            referencedColumns: ["university_id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          item_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          item_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          item_type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_applications_full: {
        Row: {
          application_fee: number | null
          city: string | null
          created_at: string | null
          documents_complete: boolean | null
          force_payment: boolean | null
          id: string | null
          intake: string | null
          language_code: string | null
          language_name: string | null
          payment_amount: number | null
          payment_currency: string | null
          payment_status: string | null
          program_category: string | null
          program_id: string | null
          program_level: string | null
          program_slug: string | null
          program_title: string | null
          province: string | null
          service_fee: number | null
          status: string | null
          student_email: string | null
          student_id: string | null
          student_name: string | null
          submitted_at: string | null
          tuition_fee: number | null
          university_id: string | null
          university_logo: string | null
          university_name: string | null
          university_slug: string | null
        }
        Relationships: []
      }
      v_pending_actions: {
        Row: {
          application_id: string | null
          pending_documents: number | null
          pending_messages: number | null
          pending_payments: number | null
          student_id: string | null
        }
        Relationships: []
      }
      v_pending_payments: {
        Row: {
          application_id: string | null
          currency: string | null
          pending_count: number | null
          student_id: string | null
          total_pending: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "v_pending_actions"
            referencedColumns: ["application_id"]
          },
        ]
      }
      v_program_admission_requirements: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string | null
          is_custom: boolean | null
          is_required: boolean | null
          program_id: string | null
          program_title: string | null
          program_title_original: string | null
          requirement_id: string | null
          title: string | null
          university_id: string | null
          university_name: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_admission_requirements_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "university_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_admission_requirements_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "program_admission_requirements_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "v_scholarship_programs"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "program_admission_requirements_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "v_university_programs_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_admission_requirements_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "admission_requirements_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["university_id"]
          },
          {
            foreignKeyName: "university_programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_universities_search"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_university_stats"
            referencedColumns: ["university_id"]
          },
        ]
      }
      v_published_articles: {
        Row: {
          author_id: string | null
          category: string | null
          category_color: string | null
          category_name: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string | null
          is_featured: boolean | null
          meta_description: string | null
          meta_title: string | null
          portal_key: string | null
          published_at: string | null
          reading_time: number | null
          slug: string | null
          status: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          views: number | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      v_scholarship_programs: {
        Row: {
          accommodation_type: string | null
          category: string | null
          city: string | null
          currency: string | null
          display_title: string | null
          duration: string | null
          field: string | null
          includes_accommodation: boolean | null
          includes_medical_insurance: boolean | null
          includes_stipend: boolean | null
          intake: string | null
          is_active: boolean | null
          is_popular: boolean | null
          language_name: string | null
          level: string | null
          portal_key: string | null
          program_id: string | null
          program_slug: string | null
          program_title: string | null
          province: string | null
          scholarship_description: string | null
          scholarship_display_name: string | null
          scholarship_duration_years: number | null
          scholarship_id: string | null
          scholarship_type: string | null
          service_fee_cny: number | null
          service_fee_usd: number | null
          stipend_amount_monthly: number | null
          stipend_currency: string | null
          student_pays_tuition: number | null
          tuition_coverage_percentage: number | null
          tuition_fee: number | null
          university_id: string | null
          university_name: string | null
          university_slug: string | null
        }
        Relationships: [
          {
            foreignKeyName: "university_programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["university_id"]
          },
          {
            foreignKeyName: "university_programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_universities_search"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_university_stats"
            referencedColumns: ["university_id"]
          },
        ]
      }
      v_universities_search: {
        Row: {
          city: string | null
          cover_photo_url: string | null
          features: string[] | null
          has_fast_track: boolean | null
          id: string | null
          institution_category: string | null
          logo_url: string | null
          min_tuition_fee: number | null
          name: string | null
          name_local: string | null
          portal_key: string | null
          program_count: number | null
          province: string | null
          ranking: string | null
          slug: string | null
          university_type: string | null
        }
        Insert: {
          city?: string | null
          cover_photo_url?: string | null
          features?: string[] | null
          has_fast_track?: boolean | null
          id?: string | null
          institution_category?: string | null
          logo_url?: string | null
          min_tuition_fee?: never
          name?: string | null
          name_local?: string | null
          portal_key?: string | null
          program_count?: never
          province?: string | null
          ranking?: string | null
          slug?: string | null
          university_type?: string | null
        }
        Update: {
          city?: string | null
          cover_photo_url?: string | null
          features?: string[] | null
          has_fast_track?: boolean | null
          id?: string | null
          institution_category?: string | null
          logo_url?: string | null
          min_tuition_fee?: never
          name?: string | null
          name_local?: string | null
          portal_key?: string | null
          program_count?: never
          province?: string | null
          ranking?: string | null
          slug?: string | null
          university_type?: string | null
        }
        Relationships: []
      }
      v_university_admission_requirements: {
        Row: {
          category: string | null
          custom_note: string | null
          description: string | null
          display_order: number | null
          is_required: boolean | null
          requirement_id: string | null
          requirement_type: string | null
          title: string | null
          university_id: string | null
          university_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "university_admission_requirements_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "admission_requirements_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_admission_requirements_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_admission_requirements_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["university_id"]
          },
          {
            foreignKeyName: "university_admission_requirements_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_universities_search"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_admission_requirements_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_university_stats"
            referencedColumns: ["university_id"]
          },
        ]
      }
      v_university_programs_full: {
        Row: {
          application_deadline: string | null
          application_fee: number | null
          category: string | null
          city: string | null
          created_at: string | null
          currency: string | null
          custom_title: string | null
          display_title: string | null
          duration: string | null
          english_requirement: string | null
          field: string | null
          force_payment: boolean | null
          gpa_requirement: string | null
          has_custom_requirements: boolean | null
          id: string | null
          intake: string | null
          is_active: boolean | null
          language_id: string | null
          language_name: string | null
          level: string | null
          max_age: number | null
          min_age: number | null
          portal_key: string | null
          program_catalog_id: string | null
          program_description: string | null
          program_title: string | null
          province: string | null
          scholarship_chance: string | null
          score_duolingo: number | null
          score_ielts: number | null
          score_toefl: number | null
          service_fee: number | null
          slug: string | null
          tuition_fee: number | null
          university_id: string | null
          university_name: string | null
          university_slug: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "university_programs_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["university_id"]
          },
          {
            foreignKeyName: "university_programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_universities_search"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "v_university_stats"
            referencedColumns: ["university_id"]
          },
        ]
      }
      v_university_stats: {
        Row: {
          currency: string | null
          min_tuition_fee: number | null
          program_count: number | null
          university_id: string | null
        }
        Relationships: []
      }
      v_unread_messages_count: {
        Row: {
          application_id: string | null
          unread_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "application_messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "v_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "v_pending_actions"
            referencedColumns: ["application_id"]
          },
        ]
      }
    }
    Functions: {
      can_manage_academic_content: { Args: never; Returns: boolean }
      can_manage_applications: { Args: never; Returns: boolean }
      generate_article_slug: {
        Args: { article_title: string }
        Returns: string
      }
      generate_program_slug: {
        Args: { program_title: string; university_name: string }
        Returns: string
      }
      get_user_permissions: {
        Args: never
        Returns: {
          action: string
          module: string
        }[]
      }
      has_permission: {
        Args: { p_action: string; p_module: string }
        Returns: boolean
      }
      increment_article_views: {
        Args: { article_slug: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      is_data_entry: { Args: never; Returns: boolean }
      is_marketing: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      submit_application: {
        Args: {
          p_application_data: Json
          p_documents_data: Json
          p_profile_data: Json
          p_program_id: string
          p_student_id: string
        }
        Returns: Json
      }
      update_profile: {
        Args: { p_profile_data: Json; p_user_id: string }
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
