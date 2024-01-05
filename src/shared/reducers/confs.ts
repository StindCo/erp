import { createSlice, Reducer, Slice } from "@reduxjs/toolkit";
import { LocalforageStore } from "../models/localForage";
import { v4 as uuidv4 } from 'uuid';
import { createTask } from "./tasks";

const initialState = {
  confs: [
    {
      label: "Taux du dollars",
      tag: "taux",
      idtech: "",
      valeur: 1
    }
  ],
  current: 0,
};

export const ConfSlice: Slice = createSlice({
  name: "confs",
  initialState: initialState,
  reducers: {
    setCurrentConf: (state, action) => {
      state.current = action.payload?.index;
    },
    loadConfs: (state, action) => {
      state.confs = action.payload?.confs ?? initialState.confs;
    },
    createConf: (state, action) => {
      let confs = state.confs != null ? [...state.confs] : [{
        label: "Taux du dollars",
        tag: "taux",
        idtech: "",
        valeur: 1
      }];
      let newConf = { ...action.payload?.conf }
      confs.push(newConf);

      LocalforageStore.setItem("confs", confs)

      state.confs = confs;
    },
    updateConf: (state, action) => {
      let confs = [...state.confs].map((value: any) => {
        if (value.tag == action.payload?.conf?.tag) {
          value = action.payload?.conf;
        }
        return value;
      });

      LocalforageStore.setItem("confs", confs)
      state.confs = confs;
    },
    deleteConf: (state, action) => {
      let confs = [...state.confs].filter((value: any) => value?.idTech != action.payload?.conf?.idTech);
      LocalforageStore.setItem("confs", confs);

      state.confs = confs;
    }
  },
});

// Action creators are generated for each case reducer function
export const { actions, reducer } = ConfSlice;

export const { setCurrentConf, loadConfs, createConf, updateConf, deleteConf } = actions;

export const getConfs = (state: any) => state.confs?.confs ?? [];

export const getConf = (state: any, idTech: any) => state.confs.confs.filter((value: any) => value.idTech == idTech);

export const getCurrentConf = (state: any) =>
  state.confs.confs[state.confs?.current];

export const getCurrentConfIndex = (state: any) =>
  state.confs?.current;

export default reducer;
