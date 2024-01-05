import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DubenzeneFetcher } from "../../shared/fetchers/Axios";
import { BsPerson } from "react-icons/bs";
import { useSelector } from "react-redux";
import { getClient, getClients } from "../../shared/reducers/clients";

type Props = {
  data: any;
};

function Client(props: Props) {
  let { id } = useParams();
  let clientsFounded = useSelector(getClients);

  const [client, setClient] = useState<any>({});

  const [view, setView] = useState(1);

  useEffect(() => {
    setClient(
      clientsFounded.filter((value: any) => value?.idTech == id)[0] ?? {}
    );
  }, [clientsFounded, id]);

  return (
    <div className="w-full h-full flex items-start">
      <div className="w-1/4 bg-[#fefefe] shadow-lg h-full rounded-t-lg">
        <div className="p-8 text-center space-y-3">
          <p className="underline text-xs mb-8">Client</p>
          <div className="w-48 bg-slate-200 rounded-lg flex items-center justify-center mx-auto   h-48">
            <BsPerson size={64} />
          </div>
          <div className="space-y-2">
            <p className="text-xl font-[PoppinsBold]">{client?.name}</p>
            <p className="text-slate-800">{client.phoneNumber}</p>
            <p className="text-sm italic">{client.adresse}</p>
          </div>
        </div>
      </div>
      <div className="w-3/4">
        <div className="w-full flex items-center  border-b">
          <p
            onClick={() => setView(1)}
            className={`p-3 hover:bg-slate-500 hover:text-white px-6  ${
              view == 1 && "bg-slate-500 text-white"
            }   cursor-pointer`}
          >
            Informations générales
          </p>
          <p
            onClick={() => setView(2)}
            className={`p-3 hover:bg-slate-500 hover:text-white px-6  ${
              view == 2 && "bg-slate-500 text-white"
            }   cursor-pointer`}
          >
            Toutes les ventes
          </p>
          <p
            onClick={() => setView(3)}
            className={`p-3 hover:bg-slate-500 hover:text-white px-6  ${
              view == 3 && "bg-slate-500 text-white"
            }  cursor-pointer`}
          >
            Commandes clients
          </p>

          <p
            onClick={() => setView(5)}
            className={`p-3 hover:bg-slate-500 hover:text-white px-6  ${
              view == 5 && "bg-slate-500 text-white"
            } cursor-pointer`}
          >
            Statistiques
          </p>
        </div>
        <div>
          {/* {view == 1 && <Clients />}
        {view == 2 && <Fournisseurs />} */}
        </div>
      </div>
    </div>
  );
}

export default Client;
