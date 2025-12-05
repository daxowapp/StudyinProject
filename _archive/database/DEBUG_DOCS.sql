-- DEBUG DOCUMENT REQUESTS
SELECT 
    id, 
    document_name, 
    status, 
    uploaded_file_url 
FROM document_requests 
WHERE application_id = '4a23971c-9584-46ff-8d01-183c9a57bc87';
