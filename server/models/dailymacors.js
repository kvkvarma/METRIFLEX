const mongoose = require('mongoose');

const DailyMacrosSchema = new mongoose.Schema({
    userId: { type: String, required: true},
    date: { type: Date, required: true },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 }
}, { timestamps: true });

// Ensure one record per user per day

DailyMacrosSchema.index({ userId: 1, date: 1 }, { unique: true });

// UserId will be in increasing Order i.e. 1 means Ascending and -1 means Descending same for Date

module.exports = mongoose.model('DailyMacros', DailyMacrosSchema);
