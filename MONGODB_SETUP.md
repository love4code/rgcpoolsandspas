# MongoDB Setup Guide

This guide will help you set up MongoDB for the RGC Pool and Spa application.

## Quick Fix

You're getting this error because MongoDB is not running. Choose one of these options:

### Option 1: Start Local MongoDB (Recommended for Development)

```bash
# Check if MongoDB is installed
which mongod

# Start MongoDB service
brew services start mongodb-community

# OR start MongoDB manually
mongod
```

Then verify it's running:
```bash
node scripts/check-mongodb.js
```

### Option 2: Use MongoDB Atlas (Recommended for Production/Heroku)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free M0 cluster
4. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
5. Update your `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rgcpoolandspa
   ```

## Detailed Instructions

### Local MongoDB Setup

#### Install MongoDB (if not installed)

**Mac (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

**Linux:**
```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Windows:**
1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Run the installer
3. MongoDB will start as a service automatically

#### Start MongoDB

**Mac (Homebrew):**
```bash
# Start as a service (recommended)
brew services start mongodb-community

# OR start manually
mongod --config /opt/homebrew/etc/mongod.conf
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
MongoDB should start automatically as a service. If not:
```bash
net start MongoDB
```

#### Verify MongoDB is Running

```bash
# Check if MongoDB is running
mongosh

# Or check status
brew services list  # Mac
sudo systemctl status mongod  # Linux
```

### MongoDB Atlas Setup (Cloud - Recommended)

#### Step 1: Create Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Choose the free M0 tier

#### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose "FREE" (M0) cluster
3. Select a cloud provider and region
4. Name your cluster (or use default)
5. Click "Create"

#### Step 3: Create Database User
1. Go to "Database Access" in the left menu
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

#### Step 4: Configure Network Access
1. Go to "Network Access" in the left menu
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

#### Step 5: Get Connection String
1. Go back to "Database" (Clusters)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as driver
5. Copy the connection string

It will look like:
```
mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

#### Step 6: Update Your .env File
1. Open your `.env` file
2. Replace the connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:your-password@cluster0.xxxxx.mongodb.net/rgcpoolandspa?retryWrites=true&w=majority
   ```
   Replace:
   - `username` with your database username
   - `your-password` with your database password
   - Add `/rgcpoolandspa` before the `?` to specify the database name

#### Step 7: Test Connection
```bash
node scripts/check-mongodb.js
```

## Check MongoDB Status

Run this command to check if MongoDB is accessible:

```bash
node scripts/check-mongodb.js
```

This will tell you:
- ✅ If MongoDB is running and accessible
- ❌ If MongoDB is not running or not accessible
- 💡 How to fix connection issues

## Troubleshooting

### "ECONNREFUSED" Error

This means MongoDB is not running or not accessible.

**Local MongoDB:**
```bash
# Check if MongoDB is running
brew services list  # Mac
sudo systemctl status mongod  # Linux

# Start MongoDB
brew services start mongodb-community  # Mac
sudo systemctl start mongod  # Linux
```

**MongoDB Atlas:**
- Verify your connection string is correct
- Check Network Access settings (should allow your IP)
- Verify database username and password
- Check if cluster is paused (free tier clusters pause after inactivity)

### Connection String Format

**Local:**
```
mongodb://localhost:27017/rgcpoolandspa
```

**MongoDB Atlas:**
```
mongodb+srv://username:password@cluster.mongodb.net/rgcpoolandspa
```

### Common Issues

1. **Wrong port**: Default MongoDB port is 27017
2. **Wrong database name**: Make sure the database name matches
3. **Authentication failed**: Check username/password
4. **Network access**: For Atlas, make sure your IP is whitelisted
5. **Cluster paused**: Free Atlas clusters pause after inactivity - wake it up in the Atlas dashboard

## Quick Start Commands

```bash
# 1. Create .env file from template
cp env.template .env

# 2. Edit .env and set MONGODB_URI
# For local: mongodb://localhost:27017/rgcpoolandspa
# For Atlas: mongodb+srv://user:pass@cluster.mongodb.net/rgcpoolandspa

# 3. Start MongoDB (if using local)
brew services start mongodb-community

# 4. Check connection
node scripts/check-mongodb.js

# 5. Run setup
npm run setup

# 6. Seed database (optional)
npm run seed

# 7. Start server
npm start
```

## For Heroku Deployment

When deploying to Heroku, use MongoDB Atlas:

1. Set up MongoDB Atlas (as described above)
2. Set the MONGODB_URI as a Heroku config var:
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://..." --app YOUR_APP_NAME
   ```

See `HEROKU_DEPLOY.md` for more details.

---

**Need help?** Check the error message - it usually tells you exactly what's wrong!


