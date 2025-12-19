-- =====================================================
-- COMPLETE PAYMENT AND DOCUMENT SYSTEM SETUP
-- =====================================================

-- First, let's check if the tables exist and create them if they don't
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    type VARCHAR(50),
    payment_method VARCHAR(50),
    receipt_url TEXT,
    stripe_payment_intent_id VARCHAR(255),
    deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS document_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    instructions TEXT,
    uploaded_file_url TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE,
    deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- If tables already exist, add missing columns
DO $$ 
BEGIN
    -- Add columns to payment_transactions if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='payment_transactions' AND column_name='description') THEN
        ALTER TABLE payment_transactions ADD COLUMN description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='payment_transactions' AND column_name='receipt_url') THEN
        ALTER TABLE payment_transactions ADD COLUMN receipt_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='payment_transactions' AND column_name='payment_method') THEN
        ALTER TABLE payment_transactions ADD COLUMN payment_method VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='payment_transactions' AND column_name='stripe_payment_intent_id') THEN
        ALTER TABLE payment_transactions ADD COLUMN stripe_payment_intent_id VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='payment_transactions' AND column_name='deadline') THEN
        ALTER TABLE payment_transactions ADD COLUMN deadline TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='payment_transactions' AND column_name='type') THEN
        ALTER TABLE payment_transactions ADD COLUMN type VARCHAR(50);
    END IF;

    -- Add columns to document_requests if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='document_requests' AND column_name='uploaded_file_url') THEN
        ALTER TABLE document_requests ADD COLUMN uploaded_file_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='document_requests' AND column_name='uploaded_at') THEN
        ALTER TABLE document_requests ADD COLUMN uploaded_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='document_requests' AND column_name='deadline') THEN
        ALTER TABLE document_requests ADD COLUMN deadline TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='document_requests' AND column_name='instructions') THEN
        ALTER TABLE document_requests ADD COLUMN instructions TEXT;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_transactions_application 
ON payment_transactions(application_id, status);

CREATE INDEX IF NOT EXISTS idx_document_requests_application 
ON document_requests(application_id, status);

-- Enable RLS
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view payment transactions" ON payment_transactions;
DROP POLICY IF EXISTS "Anyone can insert payment transactions" ON payment_transactions;
DROP POLICY IF EXISTS "Anyone can update payment transactions" ON payment_transactions;
DROP POLICY IF EXISTS "Anyone can view document requests" ON document_requests;
DROP POLICY IF EXISTS "Anyone can insert document requests" ON document_requests;
DROP POLICY IF EXISTS "Anyone can update document requests" ON document_requests;

-- Create permissive policies (you can make these more restrictive later)
CREATE POLICY "Anyone can view payment transactions" 
ON payment_transactions FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert payment transactions" 
ON payment_transactions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update payment transactions" 
ON payment_transactions FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can view document requests" 
ON document_requests FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert document requests" 
ON document_requests FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update document requests" 
ON document_requests FOR UPDATE 
USING (true);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Tables created/updated: payment_transactions, document_requests';
    RAISE NOTICE 'You can now create payment and document requests from the admin panel.';
END $$;
