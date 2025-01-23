import {
  Exchanges,
  OrderTypes,
  Products,
  TransactionTypes,
  Varieties,
} from "../interfaces";
import { connection } from "./init";

// Place order
export const intraDayBuy = async (
  tradingsymbol: string,
  price: number,
  quantity: number
) => {
  const response = await connection.placeOrder(Varieties.TEST, {
    product: Products.CNC,
    tradingsymbol,
    exchange: Exchanges.NSE,
    quantity,
    transaction_type: TransactionTypes.BUY,
    order_type: OrderTypes.LIMIT,
    price,
  });
  return response;
};

export const intraDaySell = async (
  tradingsymbol: string,
  price: number,
  quantity: number
) => {
  const response = await connection.placeOrder(Varieties.VARIETY_REGULAR, {
    product: Products.CNC,
    tradingsymbol,
    exchange: Exchanges.NSE,
    quantity,
    transaction_type: TransactionTypes.SELL,
    order_type: OrderTypes.LIMIT,
    price,
  });
  return response;
};
