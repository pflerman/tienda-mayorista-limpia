import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://movtnnszawvotmbrzepi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vdnRubnN6YXd2b3RtYnJ6ZXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMzU1MDIsImV4cCI6MjA3NjcxMTUwMn0.2gxOu5XPVjcLmlSHv-CQCqTfYPzkE7PzLYWSgRa28Jk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);