import mongoose from "mongoose";

const paletteSchema = new mongoose.Schema({
colors: {type: Array, required: true}
});

export default mongoose.models.Palette || mongoose.model("Palette", paletteSchema);
