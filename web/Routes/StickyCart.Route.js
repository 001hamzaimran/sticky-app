import { Router } from "express";
import { createOrUpdateStickyCart, getStickyCartSettings } from "../Controller/StickyConfig.Controller.js";

export const StickyCartRoute = Router();

StickyCartRoute.get("/get-sticky-cart/:shop", getStickyCartSettings);
StickyCartRoute.post("/add-sticky-cart", createOrUpdateStickyCart);
