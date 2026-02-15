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

                    return { colors: rgba, wishlist : false};
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

//save your custom palette
export const saveCustomPalette = async (req, res) => {
    try {
        let customPalette = req.body;
     const palette = await Palette.create(customPalette)
        res.json({ success: true, message : 'Color palette has been saved successfully', palette});
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

//
export const saveInYourCollection = async (req, res) => {
    try {

        const updated = await Palette.findByIdAndUpdate(
            req.params.id,
            { wishlist: req.body.wishlist },
            { new: true }
        );

        
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Palette not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Wishlist updated",
            data: updated
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const getWishlist = async (req, res) => {
    try {

        const palettes = await Palette.find(
            { wishlist: true },
        );
        
        if (!palettes) {
            return res.status(404).json({
                success: false,
                message: "wishlist not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Wishlist",
            data: palettes
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const getDetails = async (req, res) => {
    try {
        let id = req.params.id.trim()

        const palette = await Palette.findById(
            id
        );

        
        
        if (!palette) {
            return res.status(404).json({
                success: false,
                message: "Something went wrong. please try again later"
            });
        }

        res.status(200).json({
            success: true,
            message: "Details",
            data: palette
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


export const removeFromWishlist = async (req, res) => {
    try {
   const ids = req.body;
   
        const updated = await Palette.updateMany(
              { _id: { $in: ids } },   
  { $set: { wishlist: false } },
            { new: true }
        );

        
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Palette not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Wishlist updated",
            data: updated
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
