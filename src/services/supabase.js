import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://hbgxbintajhdmlavrwif.supabase.co";
const supabaseKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZ3hiaW50YWpoZG1sYXZyd2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTg5MTAsImV4cCI6MjA3NTA3NDkxMH0.5orR3as5QdjSSrYEpvOJCGgki-rmhHvFaFFsW_U6Yc8`;
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
