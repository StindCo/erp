import { createSlice, Reducer, Slice } from "@reduxjs/toolkit";
import { LocalforageStore } from "../models/localForage";

const initialState = {
  accounts: [],
  current: 0,
};

export const AccountSlice: Slice = createSlice({
  name: "accounts",
  initialState: initialState,
  reducers: {
    setCurrentAccount: (state, action) => {
      state.current = action.payload?.index;
    },
    loadAccounts: (state, action) => {

      state.accounts = action.payload?.accounts;
    },
    createAccount: (state, action) => {
      let accounts = state.accounts ?? [];
      let newAccount = { ...action.payload?.account }
      accounts.push(newAccount);

      LocalforageStore.setItem("accounts", accounts)

      state.accounts = accounts;
    },
    updateAccount: (state, action) => {
      let accounts = [...state.accounts].map((value: any) => {
        if (value.idTech = action.payload?.account?.idTech) {
          value = action.payload?.account;
        }
        return value;
      });

      LocalforageStore.setItem("accounts", accounts)
      state.accounts = accounts;
    },
    deleteAccount: (state, action) => {
      let accounts = [...state.accounts].filter((value: any) => value?.idTech != action.payload?.account?.idTech);
      LocalforageStore.setItem("accounts", accounts);

      state.accounts = accounts;
    }
  },
});

// Action creators are generated for each case reducer function
export const { actions, reducer } = AccountSlice;

export const { setCurrentAccount, loadAccounts, createAccount, updateAccount, deleteAccount } = actions;

export const getAccounts = (state: any) => state.accounts?.accounts ?? [];

export const getAccount = (state: any, idTech: any) => state.accounts.accounts.filter((value: any) => value.idTech == idTech);

export const getCurrentAccount = (state: any) =>
  state.accounts.accounts[state.accounts?.current];

export const getCurrentAccountIndex = (state: any) =>
  state.accounts?.current;

export default reducer;
