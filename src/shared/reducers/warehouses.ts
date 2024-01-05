import { createSlice, Reducer, Slice } from "@reduxjs/toolkit";
import { LocalforageStore } from "../models/localForage";

const initialState = {
  warehouses: [],
  current: 0,
};

export const WarehouseSlice: Slice = createSlice({
  name: "warehouses",
  initialState: initialState,
  reducers: {
    setCurrentWarehouse: (state, action) => {
      state.current = action.payload?.index;
    },
    loadWarehouses: (state, action) => {
      state.warehouses = action.payload?.warehouses;
    },
    createWarehouse: (state, action) => {
      let warehouses = state.warehouses != null ? [...state.warehouses] : [];
      let newWarehouse = { ...action.payload?.warehouse }
      warehouses.push(newWarehouse);

      LocalforageStore.setItem("warehouses", warehouses)

      state.warehouses = warehouses;
    },
    updateWarehouse: (state, action) => {
      let warehouses = [...state.warehouses].map((value: any) => {
        if (value.idTech = action.payload?.warehouse?.idTech) {
          value = action.payload?.warehouse;
        }
        return value;
      });

      LocalforageStore.setItem("warehouses", warehouses)
      state.warehouses = warehouses;
    },
    deleteWarehouse: (state, action) => {
      let warehouses = [...state.warehouses].filter((value: any) => value?.idTech != action.payload?.warehouse?.idTech);
      LocalforageStore.setItem("warehouses", warehouses);

      state.warehouses = warehouses;
    }
  },
});

// Action creators are generated for each case reducer function
export const { actions, reducer } = WarehouseSlice;

export const { setCurrentWarehouse, loadWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } = actions;

export const getWarehouses = (state: any) => state.warehouses?.warehouses ?? [];

export const getWarehouse = (state: any, idTech: any) => state.warehouses.warehouses.filter((value: any) => value.idTech == idTech);

export const getCurrentWarehouse = (state: any) =>
  state.warehouses.warehouses[state.warehouses?.current];

export const getCurrentWarehouseIndex = (state: any) =>
  state.warehouses?.current;

export default reducer;
