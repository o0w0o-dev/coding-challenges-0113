"use strict";

import express from "express";
import { protect } from "../controllers/authController.js";
import { searchImages } from "../controllers/imageController.js";

const router = express.Router();

router.use(protect);

router.get("/", searchImages);

export { router };
