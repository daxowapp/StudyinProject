-- DEBUG APPLICATION STATUS
-- Check the application status and its payment transactions

SELECT 
    a.id as application_id,
    a.status as application_status,
    a.student_email,
    pt.id as transaction_id,
    pt.status as transaction_status,
    pt.amount,
    pt.payment_type
FROM applications a
LEFT JOIN payment_transactions pt ON a.id = pt.application_id
WHERE a.id = '4a23971c-9584-46ff-8d01-183c9a57bc87';
