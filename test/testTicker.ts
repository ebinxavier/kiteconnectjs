import dotenv from "dotenv";
import { KiteTicker } from "../lib/ticker";

dotenv.config();

if (!process.env.ACCESS_TOKEN || !process.env.USER_ID)
  throw new Error("Access token or User Id not found on .env file");

const access_token = encodeURIComponent(process.env.ACCESS_TOKEN || "");

var ticker = new KiteTicker({
  access_token,
  user_id: process.env.USER_ID,
} as any);

ticker.connect();
ticker.on("ticks", onTicks);
ticker.on("connect", subscribe);
ticker.on("error", console.log);

function onTicks(ticks: any) {
  console.log("Ticks", ticks);
}

function subscribe() {
  console.log("Subscribing...");
  var items = [738561];
  ticker.subscribe(items);
  ticker.setMode(ticker.modeFull, items);
}
