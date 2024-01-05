import { createSlice, Reducer, Slice } from "@reduxjs/toolkit";
import { LocalforageStore } from "../models/localForage";
import { v4 as uuidv4 } from 'uuid';
import { createTask } from "./tasks";

const initialState = {
  products: [

  ],
  current: 0,
};

export const ProductSlice: Slice = createSlice({
  name: "products",
  initialState: initialState,
  reducers: {
    setCurrentProduct: (state, action) => {
      state.current = action.payload?.index;
    },
    loadProducts: (state, action) => {

      state.products = action.payload?.products;
    },
    createProduct: (state, action) => {
      let products = state.products != null ? [...state.products] : [];
      let newProduct = { ...action.payload?.product }
      products.push(newProduct);

      LocalforageStore.setItem("products", products)

      state.products = products;
    },
    updateProduct: (state, action) => {
      let products = [...state.products].map((value: any) => {
        if (value.idTech == action.payload?.product?.idTech) {
          value = action.payload?.product;
        }
        return value;
      });

      LocalforageStore.setItem("products", products)
      state.products = products;
    },
    deleteProduct: (state, action) => {
      let products = [...state.products].filter((value: any) => value?.idTech != action.payload?.product?.idTech);
      LocalforageStore.setItem("products", products);

      state.products = products;
    }
  },
});

// Action creators are generated for each case reducer function
export const { actions, reducer } = ProductSlice;

export const { setCurrentProduct, loadProducts, createProduct, updateProduct, deleteProduct } = actions;

export const getProducts = (state: any) => state.products?.products ?? [];

export const getProduct = (state: any, idTech: any) => state.products.products.filter((value: any) => value.idTech == idTech);

export const getCurrentProduct = (state: any) =>
  state.products.products[state.products?.current];

export const getCurrentProductIndex = (state: any) =>
  state.products?.current;

export default reducer;
