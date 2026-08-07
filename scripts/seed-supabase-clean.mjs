/**
 * Seed Supabase: Clean all data, then create tenant-free SUPER_ADMIN
 * Uses Supabase REST API with service_role key (bypasses RLS)
 */
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const SUPABASE_URL = 'https://ulgrgxjryezkedruvhdb.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZ3JneGpyeWV6a2VkcnV2aGRiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzk4MDQ2MCwiZXhwIjoyMDk5NTU2NDYwfQ.c4uO50RNnDdY271mK-sSLBHbu17rH1wOQp3B5TxBapg';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Simple password hash (bcrypt-compatible using Node.js crypto)
// For production, we'll use a pre-hashed password
async function hashPassword(password) {
  // We need bcrypt - let's use a simple approach since we're in a script
  const bcrypt = await import('bcryptjs');
  return bcrypt.default.hash(password, 10);
}

async function deleteAllFromTable(tableName) {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
  
  if (error) {
    // Some tables might not have 'id' or might be empty
    console.log(`  ⚠ ${tableName}: ${error.message}`);
    return false;
  }
  return true;
}

async function main() {
  console.log('🧹 Cleaning Supabase database...\n');

  // Delete in dependency order (children first)
  const tablesToDelete = [
    'VacancyApplicationResponse',
    'VacancyApplication',
    'VacancyQuestion',
    'Vacancy',
    'EvaluationResponse',
    'EvaluationResult',
    'InterviewSchedule',
    'EvaluationSession',
    'CandidateInvitation',
    'Question',
    'EvaluationTemplate',
    'Position',
    'User',
    'Company',
  ];

  for (const table of tablesToDelete) {
    const ok = await deleteAllFromTable(table);
    if (ok) console.log(`  ✓ Cleared ${table}`);
  }

  // Verify all tables are empty
  console.log('\n🔍 Verifying clean state...');
  const { count: userCount } = await supabase.from('User').select('*', { count: 'exact', head: true });
  const { count: companyCount } = await supabase.from('Company').select('*', { count: 'exact', head: true });
  console.log(`  Users: ${userCount}, Companies: ${companyCount}`);

  if (userCount > 0 || companyCount > 0) {
    console.error('❌ Database is not clean! Aborting seed.');
    process.exit(1);
  }

  console.log('\n✅ Database is clean!\n');

  // Create tenant-free SUPER_ADMIN
  console.log('👤 Creating tenant-free SUPER_ADMIN...');
  
  const adminId = crypto.randomUUID();
  const hashedPassword = await hashPassword('admin123');
  const now = new Date().toISOString();

  const { data: admin, error: adminError } = await supabase
    .from('User')
    .insert({
      id: adminId,
      email: 'admin@evaluhr.com',
      name: 'Administrador EvaluHR',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      phone: '+52 961 000 0000',
      companyId: null, // Tenant-free!
      active: true,
      consentGiven: false,
      consentDate: null,
      createdAt: now,
      updatedAt: now,
    })
    .select()
    .single();

  if (adminError) {
    console.error('❌ Error creating SUPER_ADMIN:', adminError.message);
    process.exit(1);
  }

  console.log('✅ SUPER_ADMIN created successfully!');
  console.log(`   ID: ${admin.id}`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Name: ${admin.name}`);
  console.log(`   Role: ${admin.role}`);
  console.log(`   CompanyId: ${admin.companyId} (tenant-free ✓)`);
  console.log(`   Active: ${admin.active}`);

  // Final verification
  console.log('\n🔍 Final verification...');
  const { data: allUsers } = await supabase.from('User').select('id, email, role, companyId');
  const { count: allCompanies } = await supabase.from('Company').select('*', { count: 'exact', head: true });
  
  console.log(`   Total users: ${allUsers?.length || 0}`);
  console.log(`   Total companies: ${allCompanies || 0}`);
  console.log(`   SUPER_ADMIN is tenant-free: ${allUsers?.[0]?.companyId === null ? '✅ YES' : '❌ NO'}`);

  console.log('\n🎉 Seed complete! Supabase is ready with:');
  console.log('   - 1 SUPER_ADMIN user (admin@evaluhr.com / admin123)');
  console.log('   - 0 companies (clean tenant-free state)');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
