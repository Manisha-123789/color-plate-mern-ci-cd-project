import mongoose from "mongoose";

const paletteSchema = new mongoose.Schema({
colors: {type: [String], required: true},
wishlist: {type : Boolean, default : false}
});

export default mongoose.models.Palette || mongoose.model("Palette", paletteSchema);
