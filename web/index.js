// @ts-check
import { join } from "path";
import express from "express";
import { readFileSync } from "fs";
import shopify from "./shopify.js";
import serveStatic from "serve-static";
import dbConn from "./Utils/DB.Connection.js";
import PrivacyWebhookHandlers from "./privacy.js";
import productRoute from "./Routes/Product.route.js";
import { storeRouter } from "./Routes/Store.Route.js";
import { StickyCartRoute } from "./Routes/StickyCart.Route.js";
import { getExtensionStatus } from "./Controller/Theme.Controller.js";
import StickyAnalyticsRoute from "./Routes/StickyAnalytics.route.js";


const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();
dbConn();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js
app.set('trust proxy', true)

// @ts-ignore
async function authenticateUser(req, res, next) {
  let shop = req.query.shop;
  let storeName = await shopify.config.sessionStorage.findSessionsByShop(shop);
  console.log("Shop for view", shop);
  console.log("storename for view", storeName);
  if (shop === storeName[0].shop) {
    next();
  } else {
    res.send("User is not Authorized");
  }
}
app.use(express.json());
app.use("/api/*", shopify.validateAuthenticatedSession());
app.use("/proxy/*", authenticateUser);

app.use('/api', productRoute);
app.use('/api', storeRouter);
app.use('/api', StickyCartRoute);
app.use('/api', StickyAnalyticsRoute);
app.get('/api/getEmbedStatus', getExtensionStatus)

app.use('/proxy', productRoute);
app.use('/proxy', StickyCartRoute);
app.use('/proxy', StickyAnalyticsRoute);

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

app.listen(PORT);

