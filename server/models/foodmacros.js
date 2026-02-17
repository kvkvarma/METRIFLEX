const mongoose = require("mongoose");

const macrosSchema = new mongoose.Schema({
  foodItem: { type: String, required: true },
  Protein: { type: Number, required: true },
  Carbohydrate: { type: Number, required: true },
  Fats: { type: Number, required: true },
  Fiber: { type: Number, required: true },
  calories: { type: Number, required: true },
});

module.exports = mongoose.model("FoodMacros", macrosSchema);
