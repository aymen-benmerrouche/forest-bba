import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gkcogetdjfokkfiazefy.supabase.co";
const supabaseAnonKey =
const supabaseServiceRoleKey =
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
