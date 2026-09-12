require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../model/userSchema'); // Adjust path if needed

async function migratePasswords() {
  const dbUri = process.env.MONGODB_URI;
  if (!dbUri) {
    console.error('Error: MONGODB_URI is not set in the environment variables.');
    process.exit(1);
  }

  try {
    console.log('Connecting to database...');
    await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected.');

    const users = await User.find({});
    console.log(`Found ${users.length} users in the database.`);

    let migratedCount = 0;
    
    for (const user of users) {
      // Check if password looks like it's NOT a bcrypt hash.
      // Bcrypt hashes start with $2a$, $2b$, or $2y$ and are 60 chars long.
      const isHashed = user.password.startsWith('$2') && user.password.length === 60;
      
      if (!isHashed) {
        console.log(`Hashing password for user: ${user.email}`);
        
        // Hash and save manually to ensure it happens safely during script run
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        
        await user.save();
        migratedCount++;
      } else {
        console.log(`User ${user.email} already has a hashed password. Skipping.`);
      }
    }

    console.log(`\nMigration complete. Migrated ${migratedCount} passwords.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migratePasswords();
