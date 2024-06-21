/* eslint-disable @typescript-eslint/no-explicit-any */

import dotenv from "dotenv";
import { KiteConnect } from "../lib/connect";

dotenv.config();

if (!process.env.ACCESS_TOKEN)
  throw new Error("Access token not found on .env file");

const connection = new KiteConnect({
  access_token: process.env.ACCESS_TOKEN,
  root: "https://kite.zerodha.com/oms",
} as any);

connection.getHoldings().then(console.log).catch(console.log);
