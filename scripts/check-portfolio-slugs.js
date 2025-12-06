require('dotenv').config();
const mongoose = require('mongoose');
const Portfolio = require('../models/Portfolio');

const checkPortfolioSlugs = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rgcpoolandspa';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');

    const items = await Portfolio.find({}).select('title slug active featured');
    
    console.log(`Found ${items.length} portfolio items:\n`);
    
    items.forEach((item, index) => {
      console.log(`${index + 1}. Title: "${item.title}"`);
      console.log(`   Slug: ${item.slug || '❌ MISSING'}`);
      console.log(`   Active: ${item.active}`);
      console.log(`   Featured: ${item.featured}`);
      console.log('');
    });

    const itemsWithoutSlugs = items.filter(item => !item.slug);
    if (itemsWithoutSlugs.length > 0) {
      console.log(`\n⚠️  ${itemsWithoutSlugs.length} items without slugs!`);
      console.log('Fixing missing slugs...\n');
      
      for (const item of itemsWithoutSlugs) {
        if (item.title) {
          const newSlug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          item.slug = newSlug;
          await item.save();
          console.log(`✅ Fixed: "${item.title}" -> slug: "${newSlug}"`);
        }
      }
    }

    const featuredItems = items.filter(item => item.active && item.featured);
    console.log(`\n📊 Featured & Active items: ${featuredItems.length}`);
    featuredItems.forEach(item => {
      console.log(`   - ${item.title} (slug: ${item.slug})`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkPortfolioSlugs();

