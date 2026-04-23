import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://tnsfxpevtqkqmklgdnmt.supabase.co';
const supabaseAnonKey = 'sb_publishable_XqjDiXGK78nZ531PeW_xKg_JWWw0_O6';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
