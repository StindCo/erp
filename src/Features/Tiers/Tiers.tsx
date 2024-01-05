import React, { useState } from "react";
import Clients from "./Clients";
import Fournisseurs from "./Fournisseurs";

type Props = {};

export default function Tiers({}: Props) {
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
          Gestion des clients
        </p>
        <p
          onClick={() => setView(2)}
          className={`p-3 hover:bg-slate-900 hover:text-white px-6  ${
            view == 2 && "bg-slate-900 text-white"
          }  rounded-tr-lg cursor-pointer`}
        >
          Gestion des fournisseurs
        </p>
      </div>
      <div>
        {view == 1 && <Clients />}
        {view == 2 && <Fournisseurs />}
      </div>
    </div>
  );
}
