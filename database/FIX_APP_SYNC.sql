-- FIX DATA INCONSISTENCY
-- Sync application status with transaction/document status

DO $$
BEGIN
    -- 1. If payment is COMPLETED and NO pending/rejected documents, app should be SUBMITTED
    UPDATE applications a
    SET status = 'submitted',
        updated_at = NOW()
    FROM payment_transactions pt
    WHERE a.id = pt.application_id
      AND pt.status = 'completed'
      AND NOT EXISTS (
          SELECT 1 FROM document_requests dr 
          WHERE dr.application_id = a.id 
          AND dr.status IN ('pending', 'rejected')
      );

    -- 2. If payment is COMPLETED but HAS pending/rejected documents, app should be PENDING_DOCUMENTS
    UPDATE applications a
    SET status = 'pending_documents',
        updated_at = NOW()
    FROM payment_transactions pt
    WHERE a.id = pt.application_id
      AND pt.status = 'completed'
      AND EXISTS (
          SELECT 1 FROM document_requests dr 
          WHERE dr.application_id = a.id 
          AND dr.status IN ('pending', 'rejected')
      )
      AND a.status != 'pending_documents';

    -- 2. If payment is PENDING_VERIFICATION, app should be PAYMENT_VERIFICATION
    UPDATE applications a
    SET status = 'payment_verification',
        updated_at = NOW()
    FROM payment_transactions pt
    WHERE a.id = pt.application_id
      AND pt.status = 'pending_verification'
      AND a.status != 'payment_verification';

    -- 3. If document is SUBMITTED, app should be DOCUMENT_VERIFICATION
    UPDATE applications a
    SET status = 'document_verification',
        updated_at = NOW()
    FROM document_requests dr
    WHERE a.id = dr.application_id
      AND dr.status = 'submitted'
      AND a.status != 'document_verification';
      
    RAISE NOTICE '✅ Application statuses synced with transactions and documents!';
END $$;
