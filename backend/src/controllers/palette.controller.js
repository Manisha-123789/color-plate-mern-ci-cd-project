import Palette from "../models/palette.model.js";

//get all color palette 
export const getPalette = async (req, res) => {
    try {
        let palette = await Palette.find();
        if (!palette.length) {
            const generateColorPalette = () => {
                return Array.from({ length: 10000 }, () => {
                    const r = Math.floor(Math.random() * 256);
                    const g = Math.floor(Math.random() * 256);
                    const b = Math.floor(Math.random() * 256);

                    const rgba = Array.from({ length: 5 }, (_, i) =>
                        i === 4
                            ? `rgba(${r},${g},${b},1)`
                            : `rgba(${r},${g},${b},0.${i * 2 + 2})`
                    );

                    return { colors: rgba };
                });
            }
            const colorPalette = generateColorPalette();
            await Palette.insertMany(colorPalette);
        }
        let data = await Palette.find();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


export const saveCustomPalette = async (req, res) => {
    try {
        let customPalette = req.body;
     const palette = await Palette.create(customPalette)
        res.json({ success: true, message : 'Color palette has been saved successfully', palette});
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


