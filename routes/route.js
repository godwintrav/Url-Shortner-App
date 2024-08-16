import { Router } from "express";
import {
  redirectToUrlHandler,
  createShortUrlHandler,
} from "../controllers/controller.js";

export const router = Router();

router.post("/shorten", createShortUrlHandler);
router.get("/:short_url", redirectToUrlHandler);
