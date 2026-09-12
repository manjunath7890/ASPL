require('dotenv').config();
const mongoose = require('mongoose');
require('./db doc/atlas_conn');
const AnalyticsMap = require('./model/analyticsMapSchema');

async function migrate() {
  console.log('Starting mapRoutes database migration...');
  try {
    const db = mongoose.connection;
    
    // We strictly use the native MongoDB driver collection here because we already removed 
    // mapRoutes from the Mongoose analyticsSchema, so Mongoose `find()` would strip it!
    const analyticsCursor = db.collection('analytics').find({ mapRoutes: { $exists: true, $not: { $size: 0 } } });
    
    let count = 0;
    
    for await (const doc of analyticsCursor) {
      const { vehicleId, date, mapRoutes } = doc;
      
      if (vehicleId && date && mapRoutes && mapRoutes.length > 0) {
         // 1. Move GPS data into the dedicated AnalyticsMap collection
         await AnalyticsMap.findOneAndUpdate(
            { vehicleId, date },
            { vehicleId, date, mapRoutes },
            { upsert: true }
         );
         
         // 2. Destructively purge mapRoutes from the origin Analytics document to free memory
         await db.collection('analytics').updateOne(
            { _id: doc._id },
            { $unset: { mapRoutes: "" } }
         );
         
         count++;
         console.log(`[✔] Migrated GPS routes for Vehicle: ${vehicleId} on ${date} (${mapRoutes.length} coords)`);
      }
    }
    
    console.log(`\n🎉 Migration fully complete! Securely transferred ${count} map payloads.`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed critically:', err);
    process.exit(1);
  }
}

mongoose.connection.once('open', () => {
   migrate();
});
