import { createSlice, Reducer, Slice } from "@reduxjs/toolkit";
import { LocalforageStore } from "../models/localForage";
import { v4 as uuidv4 } from 'uuid';
import { createTask } from "./tasks";

const initialState = {
  fournisseurs: [],
  current: 0,
};

export const FournisseurSlice: Slice = createSlice({
  name: "fournisseurs",
  initialState: initialState,
  reducers: {
    setCurrentFournisseur: (state, action) => {
      state.current = action.payload?.index;
    },
    loadFournisseurs: (state, action) => {

      state.fournisseurs = action.payload?.fournisseurs;
    },
    createFournisseur: (state, action) => {
      let fournisseurs = state.fournisseurs != null ? [...state.fournisseurs] : [];
      let newFournisseur = { ...action.payload?.fournisseur }
      fournisseurs.push(newFournisseur);

      LocalforageStore.setItem("fournisseurs", fournisseurs)

      state.fournisseurs = fournisseurs;
    },
    updateFournisseur: (state, action) => {
      let fournisseurs = [...state.fournisseurs].map((value: any) => {
        if (value.idTech = action.payload?.fournisseur?.idTech) {
          value = action.payload?.fournisseur;
        }
        return value;
      });

      LocalforageStore.setItem("fournisseurs", fournisseurs)
      state.fournisseurs = fournisseurs;
    },
    deleteFournisseur: (state, action) => {
      let fournisseurs = [...state.fournisseurs].filter((value: any) => value?.idTech != action.payload?.fournisseur?.idTech);
      LocalforageStore.setItem("fournisseurs", fournisseurs);

      state.fournisseurs = fournisseurs;
    }
  },
});

// Action creators are generated for each case reducer function
export const { actions, reducer } = FournisseurSlice;

export const { setCurrentFournisseur, loadFournisseurs, createFournisseur, updateFournisseur, deleteFournisseur } = actions;

export const getFournisseurs = (state: any) => state.fournisseurs?.fournisseurs ?? [];

export const getFournisseur = (state: any, idTech: any) => state.fournisseurs.fournisseurs.filter((value: any) => value.idTech == idTech);

export const getCurrentFournisseur = (state: any) =>
  state.fournisseurs.fournisseurs[state.fournisseurs?.current];

export const getCurrentFournisseurIndex = (state: any) =>
  state.fournisseurs?.current;

export default reducer;
