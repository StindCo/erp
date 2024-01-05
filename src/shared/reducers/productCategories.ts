import { createSlice, Reducer, Slice } from "@reduxjs/toolkit";
import { LocalforageStore } from "../models/localForage";
import { v4 as uuidv4 } from 'uuid';
import { createTask } from "./tasks";

const initialState = {
  product_categories: [],
  current: 0,
};

export const ProductCategorieSlice: Slice = createSlice({
  name: "product_categories",
  initialState: initialState,
  reducers: {
    setCurrentProductCategory: (state, action) => {
      state.current = action.payload?.index;
    },
    loadProductCategories: (state, action) => {

      state.product_categories = action.payload?.product_categories;
    },
    createProductCategory: (state, action) => {

      let product_categories: any = state.product_categories != null ? [...state.product_categories] : [];

      let newProductCategorie: any = { ...action.payload?.productCategory }
      product_categories.push(newProductCategorie);

      console.log(product_categories);

      LocalforageStore.setItem("product_categories", product_categories)

      state.product_categories = product_categories;
    },
    updateProductCategory: (state, action) => {
      let product_categories = [...state.product_categories].map((value: any) => {
        if (value.idTech == action.payload?.productCategory?.idTech) {
          value = action.payload?.productCategory;
        }
        return value;
      });

      LocalforageStore.setItem("product_categories", product_categories)
      state.product_categories = product_categories;
    },
    deleteProductCategory: (state, action) => {
      let product_categories = [...state.product_categories].filter((value: any) => value?.idTech != action.payload?.productCategory?.idTech);
      LocalforageStore.setItem("product_categories", product_categories);

      state.product_categories = product_categories;
    }
  },
});

// Action creators are generated for each case reducer function
export const { actions, reducer } = ProductCategorieSlice;

export const { setCurrentProductCategory, loadProductCategories, createProductCategory, updateProductCategory, deleteProductCategory } = actions;

export const getProductCategories = (state: any) => state.product_categories?.product_categories ?? [];

export const getProductCategorie = (state: any, idTech: any) => state.product_categories.product_categories.filter((value: any) => value.idTech == idTech);

export const getCurrentProductCategorie = (state: any) =>
  state.product_categories.product_categories[state.product_categories?.current];

export const getCurrentProductCategorieIndex = (state: any) =>
  state.product_categories?.current;

export default reducer;
