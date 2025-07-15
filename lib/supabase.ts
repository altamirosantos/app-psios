import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lhrdphbgmsxijzuyrtwc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxocmRwaGJnbXN4aWp6dXlydHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MzgxNzYsImV4cCI6MjA2ODExNDE3Nn0._EcZS3Amlw5Msvv2qpx1qTptUTVTUPm34OqK7g-ZAGM'

export const supabase = createClient(supabaseUrl, supabaseKey)