require('dotenv').config();
const mongoose = require('mongoose');
const Measurement = require('./models/Measurement');

const generateData = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected for seeding...');

    await Measurement.deleteMany({});

    const data = [];
    const now = new Date();
    
    for (let i = 0; i < 7 * 24; i++) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
            timestamp: time,
            field1: 20 + Math.random() * 10,
            field2: 40 + Math.random() * 20,
            field3: 1000 + Math.random() * 50
        });
    }

    await Measurement.insertMany(data);
    console.log(`Seeded ${data.length} records.`);
    process.exit();
};

generateData();