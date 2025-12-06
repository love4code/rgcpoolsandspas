#!/usr/bin/env node

/**
 * Heroku Environment Variables Setup Script
 * Interactive script to set MongoDB and other env variables for Heroku
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function exec(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'inherit', ...options });
  } catch (error) {
    throw new Error(`Command failed: ${command}`);
  }
}

function generateSessionSecret() {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('base64');
}

async function main() {
  console.log('==========================================');
  console.log('Heroku Environment Variables Setup');
  console.log('==========================================\n');

  // Check if Heroku CLI is installed
  try {
    exec('heroku --version', { stdio: 'pipe' });
  } catch (error) {
    console.log('❌ Heroku CLI is not installed.');
    console.log('Please install it from: https://devcenter.heroku.com/articles/heroku-cli\n');
    process.exit(1);
  }

  // Get app name
  const appName = await question('Enter your Heroku app name: ');
  if (!appName) {
    console.log('❌ App name is required');
    process.exit(1);
  }

  // Verify app exists
  try {
    exec(`heroku apps:info --app ${appName}`, { stdio: 'pipe' });
    console.log(`✅ App found: ${appName}\n`);
  } catch (error) {
    console.log(`❌ App '${appName}' not found or you don't have access to it\n`);
    process.exit(1);
  }

  console.log('==========================================');
  console.log('Setting up environment variables...');
  console.log('==========================================\n');

  // Generate and set Session Secret
  const sessionSecret = generateSessionSecret();
  console.log('Setting SESSION_SECRET (auto-generated secure value)...');
  exec(`heroku config:set SESSION_SECRET="${sessionSecret}" --app ${appName}`);
  console.log('✅ SESSION_SECRET set\n');

  // MongoDB URI
  console.log('MongoDB Configuration:');
  console.log('1. If using MongoDB Atlas, enter your connection string');
  console.log('2. Format: mongodb+srv://username:password@cluster.mongodb.net/dbname');
  console.log('3. If using Heroku addon, leave blank to check existing config\n');
  
  const mongoUri = await question('Enter MongoDB URI (or press Enter to skip): ');
  if (mongoUri) {
    exec(`heroku config:set MONGODB_URI="${mongoUri}" --app ${appName}`);
    console.log('✅ MONGODB_URI set\n');
  } else {
    console.log('⚠️  MONGODB_URI not set. You\'ll need to set it manually.\n');
  }

  // Admin Email
  const adminEmail = await question(`Enter ADMIN_EMAIL [markagrover85@gmail.com]: `) || 'markagrover85@gmail.com';
  exec(`heroku config:set ADMIN_EMAIL="${adminEmail}" --app ${appName}`);
  console.log(`✅ ADMIN_EMAIL set to: ${adminEmail}\n`);

  // Admin Username
  const adminUsername = await question(`Enter ADMIN_USERNAME [admin]: `) || 'admin';
  exec(`heroku config:set ADMIN_USERNAME="${adminUsername}" --app ${appName}`);
  console.log(`✅ ADMIN_USERNAME set to: ${adminUsername}\n`);

  // Admin Password
  const adminPassword = await question('Enter ADMIN_PASSWORD: ');
  if (adminPassword) {
    exec(`heroku config:set ADMIN_PASSWORD="${adminPassword}" --app ${appName}`);
    console.log('✅ ADMIN_PASSWORD set\n');
  } else {
    console.log('⚠️  ADMIN_PASSWORD not set. Using default from setup script.\n');
  }

  // Email configuration
  console.log('Email Configuration (for contact forms):\n');
  
  const smtpHost = await question(`Enter SMTP_HOST [smtp.gmail.com]: `) || 'smtp.gmail.com';
  exec(`heroku config:set SMTP_HOST="${smtpHost}" --app ${appName}`);
  console.log(`✅ SMTP_HOST set to: ${smtpHost}\n`);

  const smtpPort = await question(`Enter SMTP_PORT [587]: `) || '587';
  exec(`heroku config:set SMTP_PORT="${smtpPort}" --app ${appName}`);
  console.log(`✅ SMTP_PORT set to: ${smtpPort}\n`);

  const smtpUser = await question('Enter SMTP_USER (your email): ');
  if (smtpUser) {
    exec(`heroku config:set SMTP_USER="${smtpUser}" --app ${appName}`);
    console.log(`✅ SMTP_USER set to: ${smtpUser}\n`);
  } else {
    console.log('⚠️  SMTP_USER not set\n');
  }

  const smtpPass = await question('Enter SMTP_PASS (app password): ');
  if (smtpPass) {
    exec(`heroku config:set SMTP_PASS="${smtpPass}" --app ${appName}`);
    console.log('✅ SMTP_PASS set\n');
  } else {
    console.log('⚠️  SMTP_PASS not set\n');
  }

  console.log('==========================================');
  console.log('✅ Environment variables setup complete!');
  console.log('==========================================\n');
  console.log(`Current configuration for ${appName}:\n`);
  exec(`heroku config --app ${appName}`);
  console.log('\nNext steps:');
  console.log(`1. Run: heroku run node scripts/setup.js --app ${appName}`);
  console.log('2. Deploy your code: git push heroku main');
  console.log(`3. Visit: https://${appName}.herokuapp.com\n`);

  rl.close();
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});


