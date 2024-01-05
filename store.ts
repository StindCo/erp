import { configureStore } from "@reduxjs/toolkit";
import datatooltabs from "./src/shared/reducers/datatoolTabs";
import loginReducer from "./src/shared/reducers/login";
import clients from "./src/shared/reducers/clients";
import fournisseurs from "./src/shared/reducers/fournisseurs";
import product_categories from "./src/shared/reducers/productCategories";
import tasks from "./src/shared/reducers/tasks";
import confs from "./src/shared/reducers/confs";
import accounts from "./src/shared/reducers/accounts";
import products from "./src/shared/reducers/products";
import warehouses from "./src/shared/reducers/warehouses";
import schema from "./src/shared/reducers/schema";
import themeReducer from "./src/shared/reducers/theme";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: loginReducer,
    datatooltabs: datatooltabs,
    clients,
    fournisseurs,
    accounts,
    confs,
    warehouses,
    products,
    product_categories,
    tasks,
    schema: schema,
  },
});
