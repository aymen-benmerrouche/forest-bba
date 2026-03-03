import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gkcogetdjfokkfiazefy.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrY29nZXRkamZva2tmaWF6ZWZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg1OTI5MTAsImV4cCI6MjAyNDE2ODkxMH0.nWQGSHTB7uCOHi9jpChJ26nLdOVnT2uMVWWhnhcqyZg";
const supabaseServiceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrY29nZXRkamZva2tmaWF6ZWZ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwODU5MjkxMCwiZXhwIjoyMDI0MTY4OTEwfQ.NFK6ixkRmmcCBjG6KF_iz4Bw-xEPp8aSUTkrBQWjPsA";
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
