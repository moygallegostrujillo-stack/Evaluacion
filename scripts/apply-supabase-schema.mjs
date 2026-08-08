import pg from 'pg';
const { Client } = pg;
import fs from 'fs';

async function main() {
  // Use explicit config to handle the dot in username
  const client = new Client({ 
    host: 'aws-0-ca-central-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.ulgrgxjryezkedruvhdb',
    password: '9042mgt0993',
    ssl: { rejectUnauthorized: false } 
  });
  
  try {
    console.log('Connecting to Supabase via pooler (explicit config)...');
    console.log('User: postgres.ulgrgxjryezkedruvhdb');
    console.log('Host: aws-0-ca-central-1.pooler.supabase.com:6543');
    await client.connect();
    console.log('Connected successfully!');
    
    const sql = fs.readFileSync('supabase-schema.sql', 'utf8');
    console.log(`Read schema file (${sql.length} bytes)`);
    
    console.log('Executing schema SQL...');
    await client.query(sql);
    console.log('Schema applied successfully!');
    
    // Verify tables were created
    const { rows } = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log('\nTables created:');
    rows.forEach(r => console.log(`  ✓ ${r.table_name}`));
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.detail) console.error('Detail:', error.detail);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
