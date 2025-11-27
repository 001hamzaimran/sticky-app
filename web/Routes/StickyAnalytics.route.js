import { Router } from "express";
import { createandUpdateStickyAnalytics, getAnalytics, updateDefaultstickyAddToCarts, updatestickyAddToCarts } from "../Controller/StickyAnalytics.Controller.js";


const StickyAnalyticsRoute = Router();

StickyAnalyticsRoute.post("/create-analytics", createandUpdateStickyAnalytics);
StickyAnalyticsRoute.post("/update-addToCartsSticky", updatestickyAddToCarts);
StickyAnalyticsRoute.post("/update-defaultaddToCartsSticky", updateDefaultstickyAddToCarts);
StickyAnalyticsRoute.get("/get-analytics/:shop", getAnalytics);

export default StickyAnalyticsRoute