import React, { useState } from "react";
import Products from "./Products";
import Warehouses from "./Warehouses";

type Props = {};

export default function StockManager({}: Props) {
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
          Réapprovisionnement
        </p>
        <p
          onClick={() => setView(2)}
          className={`p-3 hover:bg-slate-900 hover:text-white px-6  ${
            view == 2 && "bg-slate-900 text-white"
          }  cursor-pointer`}
        >
          Correction du stock
        </p>
        <p
          onClick={() => setView(3)}
          className={`p-3 hover:bg-slate-900 hover:text-white px-6  ${
            view == 3 && "bg-slate-900 text-white"
          }   cursor-pointer`}
        >
          Transferer le stock
        </p>

        <p
          onClick={() => setView(4)}
          className={`p-3 hover:bg-slate-900 hover:text-white px-6  ${
            view == 4 && "bg-slate-900 text-white"
          } cursor-pointer`}
        >
          Stocks disponibles
        </p>

        <p
          onClick={() => setView(5)}
          className={`p-3 hover:bg-slate-900 hover:text-white px-6  ${
            view == 5 && "bg-slate-900 text-white"
          }  rounded-tr-lg cursor-pointer`}
        >
          Mouvements de stocks
        </p>
      </div>
      <div>
        {/* {view == 1 && <Products />}
        {view == 2 && <Warehouses />} */}
      </div>
    </div>
  );
}
