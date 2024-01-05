import { createSlice, Reducer, Slice } from "@reduxjs/toolkit";
import { LocalforageStore } from "../models/localForage";
import { v4 as uuidv4 } from 'uuid';
import { createTask } from "./tasks";

const initialState = {
  product_stocks: [],
  current: 0,
};

export const StockStockSlice: Slice = createSlice({
  name: "product_stocks",
  initialState: initialState,
  reducers: {

    setCurrentStockStock: (state, action) => {
      state.current = action.payload?.index;
    },
    loadStockStocks: (state, action) => {

      state.product_stocks = action.payload?.product_stocks;
    },
    createStockStock: (state, action) => {
      let product_stocks = state.product_stocks != null ? [...state.product_stocks] : [];
      let newStockStock = { ...action.payload?.stock_stock }
      product_stocks.push(newStockStock);

      LocalforageStore.setItem("product_stocks", product_stocks)

      state.product_stocks = product_stocks;
    },
    updateStockStock: (state, action) => {
      let product_stocks = [...state.product_stocks].map((value: any) => {
        if (value.idTech == action.payload?.stock_stock?.idTech) {
          value = action.payload?.stock_stock;
        }
        return value;
      });

      LocalforageStore.setItem("product_stocks", product_stocks)
      state.product_stocks = product_stocks;
    },
    deleteStockStock: (state, action) => {
      let product_stocks = [...state.product_stocks].filter((value: any) => value?.idTech != action.payload?.stock_stock?.idTech);
      LocalforageStore.setItem("product_stocks", product_stocks);

      state.product_stocks = product_stocks;
    }
  },
});

// Action creators are generated for each case reducer function
export const { actions, reducer } = StockStockSlice;

export const { setCurrentStockStock, loadStockStocks, createStockStock, updateStockStock, deleteStockStock } = actions;

export const getStockStocks = (state: any) => state.product_stocks?.product_stocks ?? [];

export const getStockStock = (state: any, idTech: any) => state.product_stocks.product_stocks.filter((value: any) => value.idTech == idTech);

export const getCurrentStockStock = (state: any) =>
  state.product_stocks.product_stocks[state.product_stocks?.current];

export const getCurrentStockStockIndex = (state: any) =>
  state.product_stocks?.current;

export default reducer;
