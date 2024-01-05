import { createSlice, Reducer, Slice } from "@reduxjs/toolkit";
import { LocalforageStore } from "../models/localForage";
import { v4 as uuidv4 } from 'uuid';
import { createTask } from "./tasks";

const initialState = {
  stock_mouvements: [],
  current: 0,
};

export const StockMouvementSlice: Slice = createSlice({
  name: "stock_mouvements",
  initialState: initialState,
  reducers: {

    setCurrentStockMouvement: (state, action) => {
      state.current = action.payload?.index;
    },
    loadStockMouvements: (state, action) => {

      state.stock_mouvements = action.payload?.stock_mouvements;
    },
    createStockMouvement: (state, action) => {
      let stock_mouvements = state.stock_mouvements != null ? [...state.stock_mouvements] : [];
      let newStockMouvement = { ...action.payload?.stock_mouvement }
      stock_mouvements.push(newStockMouvement);

      LocalforageStore.setItem("stock_mouvements", stock_mouvements)

      state.stock_mouvements = stock_mouvements;
    },
    updateStockMouvement: (state, action) => {
      let stock_mouvements = [...state.stock_mouvements].map((value: any) => {
        if (value.idTech == action.payload?.stock_mouvement?.idTech) {
          value = action.payload?.stock_mouvement;
        }
        return value;
      });

      LocalforageStore.setItem("stock_mouvements", stock_mouvements)
      state.stock_mouvements = stock_mouvements;
    },
    deleteStockMouvement: (state, action) => {
      let stock_mouvements = [...state.stock_mouvements].filter((value: any) => value?.idTech != action.payload?.stock_mouvement?.idTech);
      LocalforageStore.setItem("stock_mouvements", stock_mouvements);

      state.stock_mouvements = stock_mouvements;
    }
  },
});

// Action creators are generated for each case reducer function
export const { actions, reducer } = StockMouvementSlice;

export const { setCurrentStockMouvement, loadStockMouvements, createStockMouvement, updateStockMouvement, deleteStockMouvement } = actions;

export const getStockMouvements = (state: any) => state.stock_mouvements?.stock_mouvements ?? [];

export const getStockMouvement = (state: any, idTech: any) => state.stock_mouvements.stock_mouvements.filter((value: any) => value.idTech == idTech);

export const getCurrentStockMouvement = (state: any) =>
  state.stock_mouvements.stock_mouvements[state.stock_mouvements?.current];

export const getCurrentStockMouvementIndex = (state: any) =>
  state.stock_mouvements?.current;

export default reducer;
