// Test script to check existing orders table structure
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://kysiljdsowpnjmworqlo.supabase.co';
const supabaseKey = 'sb_publishable_ySY4oJoqEfFjc2HAvo1x1w_K_4TdXyg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOrdersTable() {
  try {
    console.log('Checking orders table structure...');
    
    // Get table information
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error accessing orders table:', error);
    } else {
      console.log('Orders table exists!');
      if (data.length > 0) {
        console.log('Sample data:', data[0]);
        console.log('Table columns:', Object.keys(data[0]));
      } else {
        console.log('Orders table is empty');
        // Try to insert a test record
        console.log('Trying to insert a test record...');
        const { data: insertData, error: insertError } = await supabase
          .from('orders')
          .insert({
            email: 'test@example.com',
            book_name: 'Test Book',
            status: 'pending'
          });
        
        if (insertError) {
          console.error('Error inserting test record:', insertError);
        } else {
          console.log('Test record inserted successfully!');
          // Check again
          const { data: checkData, error: checkError } = await supabase
            .from('orders')
            .select('*')
            .limit(1);
          if (checkError) {
            console.error('Error checking test record:', checkError);
          } else {
            console.log('Test record found:', checkData[0]);
            console.log('Table columns:', Object.keys(checkData[0]));
          }
        }
      }
    }
    
  } catch (error) {
    console.error('General error:', error);
  }
}

checkOrdersTable();
