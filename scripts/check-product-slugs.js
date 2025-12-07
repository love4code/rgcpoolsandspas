const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');

async function checkProductSlugs() {
  try {
    const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/rgcpoolandspa';
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    console.log(`\nFound ${products.length} products:\n`);

    for (const product of products) {
      console.log(`Product: ${product.name}`);
      console.log(`  Slug: ${product.slug || 'MISSING'}`);
      console.log(`  Active: ${product.active}`);
      
      if (!product.slug) {
        console.log(`  ⚠️  Generating slug...`);
        product.slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        try {
          await product.save();
          console.log(`  ✅ Saved with slug: ${product.slug}`);
        } catch (error) {
          console.log(`  ❌ Error saving: ${error.message}`);
        }
      }
      console.log('');
    }

    console.log('\n✅ Check complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkProductSlugs();


