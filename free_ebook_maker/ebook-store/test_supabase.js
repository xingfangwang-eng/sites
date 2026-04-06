// Test script to check Supabase connection
const { createClient } = require('@supabase/supabase-js');

// Hardcode Supabase credentials for testing
const supabaseUrl = 'https://kysiljdsowpnjmworqlo.supabase.co';
const supabaseKey = 'sb_publishable_ySY4oJoqEfFjc2HAvo1x1w_K_4TdXyg';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Set (hidden)' : 'Not set');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test connection by getting user (should return null for anon user)
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Auth error:', userError);
    } else {
      console.log('Auth test successful:', user);
    }
    
    // Test table existence
    console.log('Testing orders table...');
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(5);
    
    if (ordersError) {
      console.error('Orders table error:', ordersError);
    } else {
      console.log('Orders table test successful:', orders);
    }
    
  } catch (error) {
    console.error('General error:', error);
  }
}

testConnection();
