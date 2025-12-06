require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Product = require('../models/Product');
const Portfolio = require('../models/Portfolio');
const Service = require('../models/Service');
const Event = require('../models/Event');
const Media = require('../models/Media');
const Settings = require('../models/Settings');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// Sample image data (placeholder - in production you'd upload real images)
const createPlaceholderImage = async () => {
  // Create a simple 1x1 pixel PNG as placeholder
  const placeholderImage = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );

  const media = new Media({
    originalName: 'placeholder.png',
    mimeType: 'image/png',
    size: placeholderImage.length,
    large: {
      data: placeholderImage,
      width: 1,
      height: 1
    },
    medium: {
      data: placeholderImage,
      width: 1,
      height: 1
    },
    thumbnail: {
      data: placeholderImage,
      width: 1,
      height: 1
    }
  });

  return await media.save();
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to database
    await connectDB();

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...');
    await Product.deleteMany({});
    await Portfolio.deleteMany({});
    await Service.deleteMany({});
    await Event.deleteMany({});
    await Media.deleteMany({});
    // Note: We don't clear Admin or Settings to preserve configuration
    console.log('✅ Existing data cleared\n');

    // Create placeholder images
    console.log('Creating placeholder images...');
    const placeholder1 = await createPlaceholderImage();
    const placeholder2 = await createPlaceholderImage();
    const placeholder3 = await createPlaceholderImage();
    const placeholder4 = await createPlaceholderImage();
    const placeholder5 = await createPlaceholderImage();
    console.log('✅ Placeholder images created\n');

    // Seed Services
    console.log('Seeding services...');
    const services = await Service.insertMany([
      {
        name: 'Pool Installation',
        description: 'Professional pool installation services for above ground and in-ground pools. Expert team ensures quality installation.',
        icon: 'bi-water',
        featured: true,
        displayOrder: 1,
        active: true
      },
      {
        name: 'Liner Replacement',
        description: 'Complete liner replacement service to restore your pool to like-new condition. Fast and reliable service.',
        icon: 'bi-tools',
        featured: true,
        displayOrder: 2,
        active: true
      },
      {
        name: 'Pool Maintenance',
        description: 'Regular maintenance and service calls to keep your pool clean, safe, and ready for swimming all season long.',
        icon: 'bi-gear',
        featured: true,
        displayOrder: 3,
        active: true
      },
      {
        name: 'Pool Repair',
        description: 'Expert repair services for all pool types. We fix leaks, equipment issues, and structural problems.',
        icon: 'bi-wrench',
        featured: false,
        displayOrder: 4,
        active: true
      },
      {
        name: 'Pool Opening & Closing',
        description: 'Professional pool opening in spring and closing in fall. We handle all the details so you can enjoy your pool.',
        icon: 'bi-calendar',
        featured: false,
        displayOrder: 5,
        active: true
      }
    ]);
    console.log(`✅ Created ${services.length} services\n`);

    // Seed Products
    console.log('Seeding products...');
    const products = await Product.insertMany([
      {
        name: 'Round Above Ground Pool - 24ft',
        slug: 'round-above-ground-pool-24ft',
        description: 'Perfect family-sized pool. 24-foot round above ground pool with durable steel walls and premium liner. Includes pump, filter, ladder, and skimmer. Easy installation with our professional team.',
        sizes: [
          { label: '24ft Round', value: '24ft Round - 52" deep' },
          { label: '27ft Round', value: '27ft Round - 52" deep' },
          { label: '30ft Round', value: '30ft Round - 52" deep' }
        ],
        images: [placeholder1._id, placeholder2._id],
        featuredImage: placeholder1._id,
        seoTitle: '24ft Round Above Ground Pool - RGC Pool and Spa',
        seoDescription: 'Professional installation of 24ft round above ground pools. Quality materials and expert installation.',
        showContactForm: true,
        active: true
      },
      {
        name: 'Oval Above Ground Pool - 15x30ft',
        slug: 'oval-above-ground-pool-15x30',
        description: 'Spacious oval pool perfect for families who love to swim. 15x30 foot oval above ground pool with premium features. Includes all equipment and professional installation.',
        sizes: [
          { label: '15x30ft Oval', value: '15x30ft Oval - 52" deep' },
          { label: '18x33ft Oval', value: '18x33ft Oval - 52" deep' },
          { label: '18x40ft Oval', value: '18x40ft Oval - 52" deep' }
        ],
        images: [placeholder2._id, placeholder3._id],
        featuredImage: placeholder2._id,
        seoTitle: '15x30ft Oval Above Ground Pool - RGC Pool and Spa',
        seoDescription: 'Large oval above ground pools for families. Professional installation and quality materials.',
        showContactForm: true,
        active: true
      },
      {
        name: 'Premium Pool Liner Replacement',
        slug: 'premium-pool-liner-replacement',
        description: 'Restore your pool with a premium liner replacement. We offer a wide selection of patterns and colors. Professional installation ensures a perfect fit and long-lasting results.',
        sizes: [
          { label: 'Standard', value: 'Standard thickness - 20 mil' },
          { label: 'Premium', value: 'Premium thickness - 25 mil' },
          { label: 'Ultra Premium', value: 'Ultra Premium - 30 mil' }
        ],
        images: [placeholder3._id],
        featuredImage: placeholder3._id,
        seoTitle: 'Pool Liner Replacement Service - RGC Pool and Spa',
        seoDescription: 'Professional pool liner replacement service. Quality liners and expert installation.',
        showContactForm: true,
        active: true
      },
      {
        name: 'Pool Equipment Package',
        slug: 'pool-equipment-package',
        description: 'Complete pool equipment package including pump, filter, heater, and all necessary accessories. Professional installation included.',
        sizes: [
          { label: 'Basic Package', value: 'Basic pump and filter' },
          { label: 'Standard Package', value: 'Standard pump, filter, and heater' },
          { label: 'Premium Package', value: 'Premium equipment with automation' }
        ],
        images: [placeholder4._id],
        featuredImage: placeholder4._id,
        seoTitle: 'Pool Equipment Packages - RGC Pool and Spa',
        seoDescription: 'Complete pool equipment packages with professional installation.',
        showContactForm: true,
        active: true
      }
    ]);
    console.log(`✅ Created ${products.length} products\n`);

    // Seed Portfolio
    console.log('Seeding portfolio...');
    const portfolioItems = await Portfolio.insertMany([
      {
        title: 'Modern Family Pool Installation',
        slug: 'modern-family-pool-installation',
        description: 'Beautiful 24ft round pool installation for a family of four. Complete installation including decking and landscaping. The family now enjoys their backyard oasis all summer long.',
        images: [placeholder1._id, placeholder2._id],
        featuredImage: placeholder1._id,
        seoTitle: 'Modern Family Pool Installation - RGC Pool and Spa',
        seoDescription: 'See our completed pool installation project for a modern family home.',
        featured: true,
        active: true
      },
      {
        title: 'Luxury Oval Pool with Deck',
        slug: 'luxury-oval-pool-with-deck',
        description: 'Stunning 18x33ft oval pool with custom decking and premium features. This project included full installation, deck construction, and landscaping. The result is a beautiful backyard retreat.',
        images: [placeholder2._id, placeholder3._id, placeholder4._id],
        featuredImage: placeholder2._id,
        seoTitle: 'Luxury Oval Pool with Deck - RGC Pool and Spa',
        seoDescription: 'Luxury pool installation with custom decking and premium features.',
        featured: true,
        active: true
      },
      {
        title: 'Complete Pool Renovation',
        slug: 'complete-pool-renovation',
        description: 'Full pool renovation including new liner, updated equipment, and refreshed decking. This project transformed an old pool into a beautiful modern space.',
        images: [placeholder3._id, placeholder4._id],
        featuredImage: placeholder3._id,
        seoTitle: 'Complete Pool Renovation Project - RGC Pool and Spa',
        seoDescription: 'See how we transformed an old pool with a complete renovation.',
        featured: true,
        active: true
      },
      {
        title: 'Compact Pool for Small Yard',
        slug: 'compact-pool-small-yard',
        description: 'Perfect solution for a smaller backyard. This 15ft round pool provides plenty of space for fun while fitting perfectly in the available space.',
        images: [placeholder4._id, placeholder5._id],
        featuredImage: placeholder4._id,
        seoTitle: 'Compact Pool Installation - RGC Pool and Spa',
        seoDescription: 'Small pool installation perfect for compact yards.',
        featured: true,
        active: true
      },
      {
        title: 'Commercial Pool Installation',
        slug: 'commercial-pool-installation',
        description: 'Large commercial pool installation for a community center. This project required careful planning and coordination to meet all safety and code requirements.',
        images: [placeholder5._id],
        featuredImage: placeholder5._id,
        seoTitle: 'Commercial Pool Installation - RGC Pool and Spa',
        seoDescription: 'Professional commercial pool installation for community centers.',
        featured: false,
        active: true
      }
    ]);
    console.log(`✅ Created ${portfolioItems.length} portfolio items\n`);

    // Seed Events
    console.log('Seeding events...');
    const now = new Date();
    const events = await Event.insertMany([
      {
        title: 'Spring Pool Opening Special',
        description: 'Get your pool ready for summer! Special pricing on pool opening services throughout April and May.',
        startDate: new Date(now.getFullYear(), 3, 1), // April 1
        endDate: new Date(now.getFullYear(), 4, 31), // May 31
        allDay: true,
        location: 'All Service Areas',
        active: true
      },
      {
        title: 'Free Pool Consultation Day',
        description: 'Schedule a free consultation to discuss your pool needs. No obligation, expert advice.',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7), // Next week
        allDay: true,
        location: 'Showroom',
        active: true
      },
      {
        title: 'Pool Installation Workshop',
        description: 'Learn about pool installation and maintenance. Free workshop for homeowners.',
        startDate: new Date(now.getFullYear(), now.getMonth() + 1, 15), // Next month
        allDay: false,
        location: 'Community Center',
        active: true
      },
      {
        title: 'End of Season Pool Closing',
        description: 'Time to close your pool for winter. Special rates on pool closing services.',
        startDate: new Date(now.getFullYear(), 8, 1), // September 1
        endDate: new Date(now.getFullYear(), 9, 30), // October 30
        allDay: true,
        location: 'All Service Areas',
        active: true
      }
    ]);
    console.log(`✅ Created ${events.length} events\n`);

    // Update Settings
    console.log('Updating settings...');
    const settings = await Settings.getSettings();
    settings.companyName = 'RGC Pool and Spa';
    settings.companyEmail = 'markagrover85@gmail.com';
    settings.companyPhone = '(555) 123-4567';
    settings.companyAddress = '123 Pool Street, Your City, ST 12345';
    settings.heroImage = placeholder1._id;
    settings.theme = 'blue-ocean';
    settings.socialMedia = {
      facebook: 'https://facebook.com/rgcpoolandspa',
      instagram: 'https://instagram.com/rgcpoolandspa',
      twitter: '',
      youtube: ''
    };
    settings.footerText = `© ${new Date().getFullYear()} RGC Pool and Spa. All rights reserved.`;
    await settings.save();
    console.log('✅ Settings updated\n');

    console.log('==========================================');
    console.log('✅ Database seeding completed successfully!');
    console.log('==========================================\n');
    console.log('Summary:');
    console.log(`- ${services.length} services created`);
    console.log(`- ${products.length} products created`);
    console.log(`- ${portfolioItems.length} portfolio items created`);
    console.log(`- ${events.length} events created`);
    console.log(`- ${await Media.countDocuments()} media files created`);
    console.log('- Settings updated\n');
    console.log('Note: Placeholder images were created. Upload real images through the admin panel.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();

