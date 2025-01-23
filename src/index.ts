/* eslint-disable @typescript-eslint/no-explicit-any */

import { watchTradeCalls } from "./listener";

const tradeCalls = [
  { symbol: "EMAMILTD", buyAt: 561.3, sellAt: 549.5, targetPercentage: 0.01 },
  //   { symbol: "ITC", buyAt: 440, sellAt: 436, targetPercentage: 0.01 },
  //   { symbol: "TCS", buyAt: 823, sellAt: 812, targetPercentage: 0.01 },
];

// TODO:
// once a symbol triggered place an order don't listen it anymore

watchTradeCalls(tradeCalls);
