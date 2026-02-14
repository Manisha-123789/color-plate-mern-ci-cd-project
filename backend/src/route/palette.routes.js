import express from "express";
import { getPalette, saveCustomPalette } from '../controllers/palette.controller.js';


const router = express.Router();

router.get("/", getPalette);
router.post("/", saveCustomPalette);

export default router;
