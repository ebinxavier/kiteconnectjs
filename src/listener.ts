/* eslint-disable @typescript-eslint/no-explicit-any */

import { getInstrumentToken, ticker, validateInstruments } from "./init";
import { intraDayBuy, intraDaySell } from "./orders";

export interface TradeCall {
  symbol: string;
  buyAt: number;
  sellAt: number;
  targetPercentage: number;
  token?: number;
}

const handleTicks = (ticks: any[], tradeCalls: TradeCall[]) => {
  tradeCalls.forEach(async (tradeCall) => {
    const tick = ticks.find(
      (tick) => tick.instrument_token === tradeCall.token
    );
    if (tick) {
      try {
        console.log({
          [tradeCall.symbol]: tick.last_price,
        });
        if (tick.last_price > tradeCall.buyAt) {
          console.log("BUY", {
            symbol: tradeCall.symbol,
            last_price: tick.last_price,
          });

          //   const res = await intraDayBuy(tradeCall.symbol, tradeCall.buyAt, 1);
          //   console.log({ res });
        }
        if (tick.last_price < tradeCall.sellAt) {
          console.log("SELL", {
            symbol: tradeCall.symbol,
            last_price: tick.last_price,
          });
          //   const res = await intraDaySell(tradeCall.symbol, tradeCall.sellAt, 1);
          //   console.log({ res });
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
};

export const watchTradeCalls = async (tradeCalls: TradeCall[]) => {
  try {
    await validateInstruments(tradeCalls);

    const tradingSymbols: number[] = [];

    for (const tradeCall of tradeCalls) {
      const token = await getInstrumentToken(tradeCall.symbol);
      tradeCall.token = token;
      tradingSymbols.push(token);
    }

    ticker.connect();
    ticker.on("ticks", onTicks);
    ticker.on("connect", () => subscribe(tradingSymbols));
    ticker.on("error", console.log);

    function onTicks(ticks: any) {
      handleTicks(ticks, tradeCalls);
    }

    function subscribe(tokens: number[]) {
      console.log(
        "Subscribing:",
        tokens
          .map(
            (token) => tradeCalls.find((call) => call.token === token)?.symbol
          )
          .join(", ")
      );
      ticker.subscribe(tokens);
      ticker.setMode(ticker.modeFull, tokens);
    }
  } catch (error) {
    console.log(error);
  }
};
