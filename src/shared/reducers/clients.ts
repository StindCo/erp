import { createSlice, Reducer, Slice } from "@reduxjs/toolkit";
import { LocalforageStore } from "../models/localForage";
import { v4 as uuidv4 } from 'uuid';
import { createTask } from "./tasks";

const initialState = {
  clients: [],
  current: 0,
};

export const clientSlice: Slice = createSlice({
  name: "clients",
  initialState: initialState,
  reducers: {
    setCurrentclient: (state, action) => {
      state.current = action.payload?.index;
    },
    loadClients: (state, action) => {

      state.clients = action.payload?.clients;
    },
    createClient: (state, action) => {
      let clients =  state.clients != null ? [...state.clients] : [];
      let newClient = { ...action.payload?.client }
      clients.push(newClient);

      LocalforageStore.setItem("clients", clients)

      state.clients = clients;
    },
    updateClient: (state, action) => {
      let clients = [...state.clients].map((value: any) => {
        if (value.idTech == action.payload?.client?.idTech) {
          value = action.payload?.client;
        }
        return value;
      });

      LocalforageStore.setItem("clients", clients)
      state.clients = clients;
    },
    deleteClient: (state, action) => {
      let clients = [...state.clients].filter((value: any) => value?.idTech != action.payload?.client?.idTech);
      LocalforageStore.setItem("clients", clients);

      state.clients = clients;
    }
  },
});

// Action creators are generated for each case reducer function
export const { actions, reducer } = clientSlice;

export const { setCurrentclient, loadClients, createClient, updateClient, deleteClient } = actions;

export const getClients = (state: any) => state.clients?.clients ?? [];

export const getClient = (state: any, idTech: any) => state.clients.clients.filter((value: any) => value.idTech == idTech);

export const getCurrentclient = (state: any) =>
  state.clients.clients[state.clients?.current];

export const getCurrentclientIndex = (state: any) =>
  state.clients?.current;

export default reducer;
