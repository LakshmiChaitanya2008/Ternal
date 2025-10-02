import { createClient } from "@supabase/supabase-js";
// Don't try to use it , I have enabled RLS 😁
const supabaseUrl = "https://kfawkcxwrvigczljwzkp.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmYXdrY3h3cnZpZ2N6bGp3emtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMzczMTIsImV4cCI6MjA3NDkxMzMxMn0.D9-9-CQahOxSMGLZh3keTwq7WgAJeEDJOh-FGhf6vfQ";
export default createClient(supabaseUrl, supabaseKey);
