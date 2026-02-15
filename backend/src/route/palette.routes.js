import express from "express";
import { getDetails, getPalette, getWishlist, removeFromWishlist, saveCustomPalette, saveInYourCollection } from '../controllers/palette.controller.js';


const router = express.Router();

router.get("/", getPalette);
router.post("/", saveCustomPalette);
router.patch("/:id", saveInYourCollection)
router.get("/wishlist", getWishlist)
router.get("/color-palette-details/:id", getDetails)
router.patch("/", removeFromWishlist)

export default router;
