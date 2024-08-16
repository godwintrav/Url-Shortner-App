import { Router } from "express";
import {
  redirectToUrlHandler,
  createShortUrlHandler,
} from "../controllers/controller.js";

export const router = Router();

//post route that calls createShortUrlHandler from controller module
router.post("/shorten", createShortUrlHandler);

//get route that takes short_url as url parameter and calls redirectToUrlHandler
router.get("/:short_url", redirectToUrlHandler);
