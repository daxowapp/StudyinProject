-- Add parent_message_id to application_messages table
-- This enables threading/replying to specific messages

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'application_messages' 
                   AND column_name = 'parent_message_id') THEN
        ALTER TABLE application_messages 
        ADD COLUMN parent_message_id UUID REFERENCES application_messages(id) ON DELETE SET NULL;
    END IF;
END $$;
