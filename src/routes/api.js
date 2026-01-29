const express = require('express');
const router = express.Router();
const Measurement = require('../models/Measurement');

router.get('/measurements', async (req, res) => {
    try {
        const { start_date, end_date, field } = req.query;
        
        let query = {};
        
        if (start_date || end_date) {
            query.timestamp = {};
            if (start_date) query.timestamp.$gte = new Date(start_date);
            if (end_date) query.timestamp.$lte = new Date(end_date);
        }

        let projection = 'timestamp';
        if (field && ['field1', 'field2', 'field3'].includes(field)) {
            projection += ` ${field}`;
        } else {
            projection += ' field1 field2 field3';
        }

        const data = await Measurement.find(query)
            .select(projection)
            .sort({ timestamp: 1 });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const { field } = req.query;
        const targetField = field && ['field1', 'field2', 'field3'].includes(field) ? field : 'field1';

        const stats = await Measurement.aggregate([
            {
                $group: {
                    _id: null,
                    avgValue: { $avg: `$${targetField}` },
                    minValue: { $min: `$${targetField}` },
                    maxValue: { $max: `$${targetField}` },
                    stdDev: { $stdDevPop: `$${targetField}` }
                }
            }
        ]);

        if (stats.length === 0) {
            return res.json({ avgValue: 0, minValue: 0, maxValue: 0, stdDev: 0 });
        }

        res.json(stats[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;