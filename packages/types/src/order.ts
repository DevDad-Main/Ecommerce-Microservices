// import {  } from "@repo/order-db";

export interface OrderSchemaType {
  userId: string;
  email: string;
  amount: number;
  status: string;
  products: ProductItem[];
  createdAt?: string;
}

export type OrderType = OrderSchemaType & {
  _id?: string;
};

export type OrderChartType = {
  month: string;
  total: number;
  successful: number;
};

export interface ProductItem {
  name: string;
  quantity: number;
  price: number;
}
