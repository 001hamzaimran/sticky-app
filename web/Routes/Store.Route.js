import { Router } from "express";
import { getShop } from "../Controller/Store.Controller.js";

export const storeRouter = Router();

storeRouter.get("/get-store", getShop);