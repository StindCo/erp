import React from "react";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";

import Login from "./Features/Auth/Login";
import Dashboard from "./Features/Dashboard/Dashboard";
import Tiers from "./Features/Tiers/Tiers";
import Fournisseur from "./Features/Tiers/Fournisseur";
import Client from "./Features/Tiers/Client";
import ProductsManager from "./Features/Product/ProductsManager";
import Warehouse from "./Features/Product/Warehouse";
import Product from "./Features/Product/Product";
import StockManager from "./Features/Stock/StockManager";

const router: any = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route
          path="projects"
          element={
            <React.Suspense fallback={<>...</>}>
              {/* <DataTool /> */}
            </React.Suspense>
          }
        />

        <Route path="tiers" element={<Tiers />} />

        <Route
          path="tiers/fournisseur/:id"
          element={<Fournisseur data={null} />}
        />
        <Route path="tiers/client/:id" element={<Client data={null} />} />

        <Route path="products-manager" element={<ProductsManager />} />
        <Route path="stocks" element={<StockManager />} />

        <Route
          path="products-manager/warehouses/:id"
          element={<Warehouse data={null} />}
        />
        <Route
          path="products-manager/products/:id"
          element={<Product data={null} />}
        />
      </Route>
    </>
  )
);

export default router;
