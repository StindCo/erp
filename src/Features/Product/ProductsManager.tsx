import React, { useState } from "react";
import Products from "./Products";
import Warehouses from "./Warehouses";
import ProductCategory from "./ProductCategory";

type Props = {};

export default function ProductsManager({}: Props) {
  const [view, setView] = useState(1);
  return (
    <div>
      <div className="w-full flex items-center  border-b">
        <p
          onClick={() => setView(1)}
          className={`p-3 hover:bg-slate-900 hover:text-white px-6  ${
            view == 1 && "bg-slate-900 text-white"
          }  rounded-tl-lg cursor-pointer`}
        >
          Gestion des produits
        </p>
        <p
          onClick={() => setView(2)}
          className={`p-3 hover:bg-slate-900 hover:text-white px-6  ${
            view == 2 && "bg-slate-900 text-white"
          }  cursor-pointer`}
        >
          Gestion des entrepôts
        </p>
        <p
          onClick={() => setView(3)}
          className={`p-3 hover:bg-slate-900 hover:text-white px-6  ${
            view == 3 && "bg-slate-900 text-white"
          }  rounded-tr-lg cursor-pointer`}
        >
          Catégorie des produits
        </p>
      </div>
      <div>
        {view == 1 && <Products />}
        {view == 2 && <Warehouses />}
        {view == 3 && <ProductCategory />}
      </div>
    </div>
  );
}
