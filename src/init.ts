/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import dotenv from "dotenv";
import { KiteTicker } from "../lib/ticker";
import { KiteConnect } from "../lib/connect";
import axios from "axios";
import { TradeCall } from "./listener";

dotenv.config();

if (!process.env.ACCESS_TOKEN || !process.env.USER_ID)
  throw new Error("Access token or User Id not found on .env file");

const access_token = encodeURIComponent(process.env.ACCESS_TOKEN || "");

export const ticker = new KiteTicker({
  access_token,
  user_id: process.env.USER_ID,
});

export const connection = new KiteConnect({
  access_token: process.env.ACCESS_TOKEN,
  root: "https://kite.zerodha.com/oms",
});

// Fetch instrument token, this is a unique number for each trading symbol

const THIS = {
  equitySymbolMap: [] as any,
  instsmap: {} as any,
  insts: {} as any,
};

function buildEquitySymbolMap(e, t) {
  for (let s of t) {
    let t = s[5] || s[1];
    THIS.equitySymbolMap[t] || (THIS.equitySymbolMap[t] = []),
      THIS.equitySymbolMap[t].push([e, s[1]]);
  }
}

function loadEquity(e, t) {
  let s = [] as any,
    i = {},
    r = -1,
    n = -1,
    a = -1;
  for (let o of t) {
    let t,
      c,
      l,
      u = o[1],
      h = o[2];
    if (!h && "BSE" === e) {
      let e = o[5] || o[1],
        t = THIS.equitySymbolMap[e];
      if (t && t[0]) {
        let e = THIS.instsmap[t[0][0]][t[0][1]];
        e && e.name && (h = e.name);
      }
    }
    (t = -1 === r ? o[0] : r + o[0]),
      (r = t),
      o[3] ? ((c = o[3]), (n = c)) : (c = n),
      o[4] ? ((l = o[4]), (a = l)) : (l = a),
      -1 === c && (c = 0.05),
      -1 === l && (l = 1);
    const d: any = {
      token: (t << 8) + 1,
      symbol: u,
      name: h,
    };
    s.push(d), (i[u] = d);
  }
  (THIS.insts[e] = s), (THIS.instsmap[e] = i);
}

export interface Instrument {
  symbol: string;
  name: string;
  token: number;
}
interface InstrumentMap {
  [key: string]: Instrument;
}

export async function fetchInstruments(): Promise<InstrumentMap> {
  const url = "https://kite.zerodha.com/static/json/instruments.json";
  try {
    if (!THIS.instsmap.NSE) {
      // Fetch data only if `instrumentInfo` is empty
      const response = await axios.get(url);
      console.log("Data fetched successfully!");
      // Assuming `response.data` has a structure similar to the one mentioned
      buildEquitySymbolMap("NSE", response.data.instruments.NSE);
      loadEquity("NSE", response.data.instruments.NSE);
    }
    return THIS.instsmap.NSE;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error for further handling if needed
  }
}

export const getInstrumentToken = async (
  stockSymbol: string
): Promise<number> => {
  const instruments = await fetchInstruments();
  const stockInfo = instruments[stockSymbol];
  if (stockInfo) return stockInfo.token;
  else throw new Error(`Stock Symbol${stockSymbol} is not available`);
};

export const validateInstruments = async (tradeCalls: TradeCall[]) => {
  const testSymbols: Instrument[] = [
    { symbol: "TCS", name: "TATA CONSULTANCY SERV LT" },
    { symbol: "ZOMATO", name: "ZOMATO" },
    { symbol: "HDFCBANK", name: "HDFC BANK" },
    { symbol: "NESTLEIND", name: "NESTLE INDIA" },
    { symbol: "ATFL", name: "AGRO TECH FOODS" },
  ];
  const instruments = await fetchInstruments();

  const incorrect = testSymbols.some(
    (item) => instruments[item.symbol].name !== item.name
  );

  if (incorrect) {
    throw new Error("Instrument token extraction failed!");
  } else {
    for (const tradeCall of tradeCalls) {
      if (!instruments[tradeCall.symbol])
        throw new Error("Invalid Trade Symbol: " + tradeCall.symbol);
    }
    console.log("Initialized successfully!");
  }
};
