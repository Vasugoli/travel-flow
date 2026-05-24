import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const testConnection = async () => {
  if (!MONGO_URI) {
    console.error('❌ Error: MONGO_URI is not set in environment variables (server/.env)!');
    process.exit(1);
  }

  console.log('🔌 Testing database connection...');
  
  // Obscure password for safety in console logging
  const safeUri = MONGO_URI.replace(/:([^@:]+)@/, ':****@');
  console.log(`🔗 Target Connection URI: ${safeUri}`);

  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log('\n✅ Success! Connected to MongoDB Atlas.');
    console.log(`📡 Cluster Host: ${conn.connection.host}`);
    console.log(`🗃️ Database Name: ${conn.connection.db?.databaseName || 'unknown'}`);
    
    // Check collections
    const collections = await conn.connection.db?.listCollections().toArray();
    console.log(`📋 Total collections found: ${collections?.length || 0}`);
    if (collections && collections.length > 0) {
      collections.forEach(col => console.log(`  - ${col.name}`));
    } else {
      console.log('ℹ️ The database is currently empty. Ready to run seeder!');
    }
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error(`Error Details: ${(error as Error).message}`);
    console.log('\n💡 Troubleshooting Tips:');
    console.log('1. Make sure your database user password has no special characters like "@", "/", or ":" (or url-encode them).');
    console.log('2. Check your MongoDB Atlas Network Access tab and whitelist your current IP address or add 0.0.0.0/0.');
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed.');
  }
};

testConnection();
