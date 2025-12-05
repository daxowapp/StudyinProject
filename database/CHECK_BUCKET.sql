-- CHECK STORAGE BUCKET CONFIGURATION
SELECT id, name, public 
FROM storage.buckets 
WHERE name = 'documents';
