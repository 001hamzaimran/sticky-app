import { Router } from "express";
import { disablingFirstVisit, getShop } from "../Controller/Store.Controller.js";

export const storeRouter = Router();

storeRouter.get("/get-store", getShop);
storeRouter.get("/disable-first-visit/:storeName", disablingFirstVisit);