import React, { useEffect, useRef, useState } from "react";
import FadeIn from "react-fade-in/lib/FadeIn";
import { BsPlusLg, BsX } from "react-icons/bs";
import { Link } from "react-router-dom";
import { DubenzeneFetcher } from "../../shared/fetchers/Axios";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import {
  createClient,
  deleteClient,
  getClients,
} from "../../shared/reducers/clients";
import { createTask } from "../../shared/reducers/tasks";

type Props = {};

export default function Clients({}: Props) {
  const [name, setName] = useState<any>("");
  const [phoneNumber, setPhoneNumber] = useState<any>("");
  const [adresse, setAdresse] = useState<any>("");
  const viewRef = useRef<any>(null);
  const [focusView, setFocusView] = useState(2);
  const [projetToEdit, setProjetToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  let clients = useSelector(getClients);
  const dispatch = useDispatch();
  const [clientsFilter, setClientsFilter] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<any>(0);
  const [numberOfPage, setNumberOfPage] = useState<any>(1);
  const [pageLength, setPageLength] = useState<any>(10);
  const [filterText, setFilterText] = useState<any>("");
  const [clientInDelete, setClientInDelete] = useState<any>(null);
  const [confirmDeleteShow, setConfirmDeleteShow] = useState(false);

  useEffect(() => {}, []);

  const deleteAClient = (id: any) => {
    dispatch(deleteClient({ client: clientInDelete }));
    dispatch(
      createTask({
        task: {
          endpoint: `/clients/${clientInDelete.idTech}`,
          method: "DELETE",
          data: {},
          params: {},
        },
      })
    );

    setConfirmDeleteShow(false);
    setClientInDelete({});
  };

  const createNewClient = () => {
    let account: any = localStorage.getItem("account");

    const client = {
      phoneNumber,
      adresse,
      name,
      user: JSON.parse(account),
      createdAt: new Date().toString(),
      idTech: uuidv4(),
    };

    dispatch(createClient({ client }));
    dispatch(
      createTask({
        task: {
          endpoint: "/clients",
          method: "POST",
          data: client,
          params: {},
        },
      })
    );

    setIsModalOpen(false);
    setPhoneNumber("");
    setAdresse("");
    setName("");
  };

  useEffect(() => {
    if (filterText == "") {
      let totalPages = Math.ceil(clients.length / pageLength);
      setNumberOfPage(totalPages);
      const startIndex = currentPage * pageLength;
      const endIndex = startIndex + pageLength;
      const subset = clients.slice(startIndex, endIndex);
      setClientsFilter(subset);
    } else {
      let value: any = clients.filter(
        (client: any) =>
          client.name.toLowerCase().includes(filterText) ||
          client.adresse.toLowerCase().includes(filterText) ||
          client.phoneNumber.toLowerCase().includes(filterText)
      );
      setClientsFilter(value);
    }
  }, [clients, pageLength, currentPage, filterText]);

  return (
    <div>
      {" "}
      <FadeIn className="overflow-hidden">
        <div className="h-full  w-full  p-6 px-6 space-y-8" onClick={(e) => {}}>
          <div className="flex items-center justify-between space-x-8">
            <div className="w-2/6 h-32 p-8 rounded-lg text-zinc-50 shadow-xl  bg-red-500">
              <div className="text-lg flex flex-row items-center justify-between">
                <BsPlusLg size={25} />
                <span className="text-lg font-[PoppinsBold]">100 Clients</span>
              </div>
              <div className="text-sm text-right mt-3">cette semaine</div>
            </div>

            <div className="w-2/6 h-32 p-8 rounded-lg text-zinc-50 shadow-xl  bg-yellow-500">
              <div className="text-lg flex flex-row items-center justify-between">
                <BsPlusLg size={25} />
                <span className="text-lg font-[PoppinsBold]">10 clients</span>
              </div>
              <div className="text-sm text-right mt-3">Aujourd'hui</div>
            </div>
            <div className="w-2/6 h-32 p-8 rounded-lg text-zinc-50 shadow-xl  bg-cyan-500">
              <div className="text-lg flex flex-row items-center justify-end">
                {/* <BsPlusLg size={25} /> */}
                <span className="text-lg font-[PoppinsBold]">100 $</span>
              </div>
              <div className="text-xs text-right mt-3">
                de revenu par client cette semaine
              </div>
            </div>
            <div className="w-2/6 h-32 p-8 rounded-lg text-zinc-50 shadow-xl  bg-green-600">
              <div className="text-lg flex flex-row items-center justify-end">
                <span className="text-lg font-[PoppinsBold]">3</span>
              </div>
              <div className="text-sm text-right mt-3">
                Commandes non-livrées
              </div>
            </div>
          </div>
          <div className="w-full flex flex-row items-center justify-between">
            <div className="flex items-center w-3/5  space-x-4">
              <select
                onChange={(e) => setPageLength(parseInt(e.target.value))}
                className="select select-sm"
              >
                <option value="10">10</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="500">500</option>
              </select>
              <div className="w-full">
                <input
                  onChange={(e) => setFilterText(e.target.value)}
                  type="text"
                  placeholder="Rechercher un client"
                  className="input input-bordered w-full"
                />
              </div>
            </div>
            <div className="join rounded-lg space-x-2">
              {Array(numberOfPage)
                .fill(0)
                .map((_, index: number) => (
                  <button
                    key={Math.random()}
                    onClick={() => setCurrentPage(index)}
                    className={`join-item rounded-lg px-5 btn ${
                      currentPage != index && "btn-outline"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
            </div>
            <div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn  btn-outline rounded-lg space-x-3"
              >
                <BsPlusLg size={15} />
                <span>Ajouter un client </span>
              </button>
            </div>
          </div>
          <div className="overflow-hidden h-[300px] overflow-y-scroll">
            <table className="table  w-full ">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nom</th>
                  <th>Téléphone</th>
                  <th>Adresse</th>
                  <th>Rentabilité</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clientsFilter.map((value: any, index: number) => (
                  <tr>
                    <th>{index + 1}</th>
                    <th className="underline cursor-pointer select-none font-[PoppinsBold] ">
                      <Link
                        to={"/dashboard/tiers/client/" + value.idTech}
                        state={value}
                      >
                        {" "}
                        {value.name}{" "}
                      </Link>
                    </th>
                    <th>{value.phoneNumber}</th>
                    <th>{value.adresse}</th>
                    <th className="">
                      {" "}
                      <span className="bg-slate-700 p-1 px-2 text-white rounded-lg">
                        100$
                      </span>
                    </th>
                    <th>
                      <a
                        onClick={() => {
                          setClientInDelete(value);
                          setConfirmDeleteShow(true);
                        }}
                        className=" cursor-pointer text-xs text-red-600 underline"
                      >
                        Supprimer
                      </a>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
      <dialog
        className={`w-full  h-full modal ${isModalOpen ? "modal-open" : ""}`}
      >
        <div className="bg-zinc-50 px-6 pt-2 text-lg rounded-lg w-2/4">
          <div className="flex flex-row border-b py-3  px-2 items-center justify-between">
            <h2>Enregistrement d'un client</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn rounded-full btn-sm btn-error text-white"
            >
              <BsX size={20} />
            </button>
          </div>
          <div className="">
            <div className="py-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nom complet</span>
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder="Entrez le nom complet"
                    className={"input input-bordered"}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Numéro de téléphone</span>
                  </label>
                  <input
                    placeholder="Numéro de téléphone"
                    type="text"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    value={phoneNumber}
                    className={"input input-bordered"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Adresse</span>
                  </label>
                  <textarea
                    onChange={(e) => setAdresse(e.target.value)}
                    value={adresse}
                    className="textarea textarea-bordered"
                    placeholder="Inserer l'adresse"
                    cols={10}
                    rows={3}
                  ></textarea>
                  {/* <input type="text" className={"input input-bordered"} /> */}
                </div>
              </div>

              <div className="w-64">
                <button
                  onClick={() => createNewClient()}
                  className="py-3 btn mt-5 w-full rounded-md  "
                  type="submit"
                >
                  Enregistrer
                </button>
              </div>
              <br />
            </div>
          </div>
        </div>
      </dialog>
      <dialog
        className={`w-full  h-full modal ${
          confirmDeleteShow ? "modal-open" : ""
        }`}
      >
        <div className="bg-zinc-50 px-6 pt-2 text-lg rounded-lg w-1/4">
          <div className="flex flex-row border-b py-3  px-2 items-center justify-between">
            <h2>Suppression du client</h2>
            <button
              onClick={() => setConfirmDeleteShow(false)}
              className="btn rounded-full btn-sm btn-error text-white"
            >
              <BsX size={20} />
            </button>
          </div>
          <div className="h-64 flex flex-col items-center p-8 text-center">
            êtes-vous sûr de supprimer le client:{" "}
            <span className="underline mt-2">{clientInDelete?.name}</span>
            <a
              onClick={() => deleteAClient(clientInDelete?.id)}
              className="btn btn-error rounded-lg btn-outline btn-sm mt-8"
            >
              supprimer
            </a>
          </div>
        </div>
      </dialog>
    </div>
  );
}
