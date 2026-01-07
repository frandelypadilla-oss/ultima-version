import { createClient } from '@supabase/supabase-js';

// Tu URL y tu Key real
const SUPABASE_URL = 'https://vxemukheawyudranouvc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4ZW11a2hlYXd5dWRyYW5vdXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NjI1ODIsImV4cCI6MjA4MzEzODU4Mn0.LHAUEOD81Sb1wfSqVy3Do3pNNVbDFAe-oUN2Lijh7BE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);