import React, { useEffect, useRef, useState } from "react";
import FadeIn from "react-fade-in/lib/FadeIn";
import { BsPlusLg, BsX } from "react-icons/bs";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { DubenzeneFetcher } from "../../shared/fetchers/Axios";
import { useSelector, useDispatch } from "react-redux";
import { getAccounts } from "../../shared/reducers/accounts";
import {
  createWarehouse,
  deleteWarehouse,
  getWarehouses,
} from "../../shared/reducers/warehouses";
import { createTask } from "../../shared/reducers/tasks";

type Props = {};

export default function Warehouses({}: Props) {
  const [name, setName] = useState<any>("");
  const [description, setDescription] = useState<any>("");
  const [adresse, setAdresse] = useState<any>("");
  const [selectedManager, setSelectedManager] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  let warehouses = useSelector(getWarehouses);

  const [warehousesFilter, setWarehousesFilter] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<any>(0);
  const [numberOfPage, setNumberOfPage] = useState<any>(1);
  const [pageLength, setPageLength] = useState<any>(10);
  const [filterText, setFilterText] = useState<any>("");
  const [warehouseInDelete, setWarehouseInDelete] = useState<any>(null);
  const [confirmDeleteShow, setConfirmDeleteShow] = useState(false);
  let accounts = useSelector(getAccounts);
  const dispatch = useDispatch();

  const deleteAWarehouse = (id: any) => {
    dispatch(deleteWarehouse({ warehouse: warehouseInDelete }));
    dispatch(
      createTask({
        task: {
          endpoint: `/warehouses/${warehouseInDelete.idTech}`,
          method: "DELETE",
          data: {},
          params: {},
        },
      })
    );
    setConfirmDeleteShow(false);
    setWarehouseInDelete(null);
  };

  const createAWarehouse = () => {
    const warehouse = {
      description,
      adresse,
      name,
      taux: 0,
      responsable: selectedManager,
      createdAt: new Date().toString(),
      idTech: uuidv4(),
    };

    dispatch(createWarehouse({ warehouse }));
    dispatch(
      createTask({
        task: {
          endpoint: "/warehouses",
          method: "POST",
          data: warehouse,
          params: {},
        },
      })
    );
    setAdresse("");
    setDescription("");
    setName("");
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (filterText == "") {
      let totalPages = Math.ceil(warehouses.length / pageLength);
      setNumberOfPage(totalPages);
      const startIndex = currentPage * pageLength;
      const endIndex = startIndex + pageLength;
      const subset = warehouses.slice(startIndex, endIndex);
      setWarehousesFilter(subset);
    } else {
      let value: any = warehouses.filter(
        (fournisseur: any) =>
          fournisseur.name.toLowerCase().includes(filterText) ||
          fournisseur.description.toLowerCase().includes(filterText) ||
          fournisseur.adresse.toLowerCase().includes(filterText)
      );
      setWarehousesFilter(value);
    }
  }, [warehouses, pageLength, currentPage, filterText]);

  return (
    <div>
      {" "}
      <FadeIn className="overflow-hidden">
        <div className="h-full  w-full  p-6 px-6 space-y-8" onClick={(e) => {}}>
          <div className="flex items-center justify-between space-x-8">
            <div className="w-2/6 h-32 p-8 rounded-lg text-zinc-50 shadow-xl  bg-yellow-500">
              <div className="text-lg flex flex-row items-center justify-between">
                <BsPlusLg size={25} />
                <span className="text-lg font-[PoppinsBold]">10</span>
              </div>
              <div className="text-sm text-right mt-3">produits en alertes</div>
            </div>
            <div className="w-2/6 h-32 p-8 rounded-lg text-zinc-50 shadow-xl  bg-red-500">
              <div className="text-lg flex flex-row items-center justify-between">
                <BsPlusLg size={25} />
                <span className="text-lg font-[PoppinsBold]">1</span>
              </div>
              <div className="text-sm text-right mt-3">
                Sites Site en retard de paiement
              </div>
            </div>
            <div className="w-2/6 h-32 p-8 rounded-lg text-zinc-50 shadow-xl  bg-green-600">
              <div className="text-lg flex flex-row items-center justify-end">
                <span className="text-lg font-[PoppinsBold]">100</span>
              </div>
              <div className="text-sm text-right mt-3">Produits en perte</div>
            </div>

            <div className="w-2/6 h-32 p-8 rounded-lg text-zinc-50 shadow-xl  bg-cyan-500">
              <div className="text-lg flex flex-row items-center justify-end">
                {/* <BsPlusLg size={25} /> */}
                <span className="text-lg font-[PoppinsBold]">1500 $</span>
              </div>
              <div className="text-xs text-right mt-3">
                valeur générale de l'entreprise
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
                  placeholder="Rechercher un entrepôt"
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
                <span>Ajouter un entrepôt </span>
              </button>
            </div>
          </div>
          <div className="overflow-hidden h-[300px] overflow-y-scroll">
            <table className="table table-zebra w-full ">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nom</th>
                  <th>Description</th>
                  <th>Adresse</th>
                  <th>Manager</th>
                  <th>Stocks</th>
                  <th>Valeur</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {warehousesFilter.map((value: any, index: number) => (
                  <tr key={Math.random()}>
                    <th>{index + 1}</th>
                    <th className="underline cursor-pointer select-none font-[PoppinsBold] ">
                      <Link
                        to={
                          "/dashboard/products-manager/warehouses/" + value?.idTech
                        }
                      >
                        {" "}
                        {value?.name}{" "}
                      </Link>
                    </th>
                    <th>{value?.description}</th>
                    <th>{value?.adresse}</th>
                    <th>{value?.responsable?.fullname}</th>
                    <th>0</th>
                    <th>0 $</th>
                    <th>
                      <a
                        onClick={() => {
                          setWarehouseInDelete(value);
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
            <h2>Enregistrement d'un entrepôt</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn rounded-full btn-sm btn-error text-white"
            >
              <BsX size={20} />
            </button>
          </div>
          <div className="">
            <div className="py-3 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nom de l'entrepôt</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Entrez le nom de l'entrepôt"
                    className={"input input-bordered"}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description </span>
                  </label>
                  <input
                    placeholder="Inserer une description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                    className="textarea textarea-bordered"
                    placeholder="Inserer l'adresse"
                    cols={10}
                    value={adresse}
                    rows={3}
                  ></textarea>
                  {/* <input type="text" className={"input input-bordered"} /> */}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Gérant de l'entrepôt</span>
                  </label>
                  <select
                    onChange={(e) => {
                      let account = accounts.filter(
                        (value: any) => value.id == parseInt(e.target.value)
                      )[0];
                      setSelectedManager(account);
                    }}
                    className="select select-bordered w-full"
                  >
                    <option disabled selected>
                      Qui est le gérant ?
                    </option>
                    {accounts.map((value: any) => (
                      <option key={Math.random()} value={value?.id}>
                        {value?.fullname}
                      </option>
                    ))}
                  </select>
                  {/* <input type="text" className={"input input-bordered"} /> */}
                </div>
              </div>

              <div className="w-64">
                <button
                  onClick={() => createAWarehouse()}
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
            <h2>Suppression du fournisseur</h2>
            <button
              onClick={() => setConfirmDeleteShow(false)}
              className="btn rounded-full btn-sm btn-error text-white"
            >
              <BsX size={20} />
            </button>
          </div>
          <div className="h-64 flex flex-col items-center p-8 text-center">
            êtes-vous sûr de supprimer l'entrepôt:{" "}
            <span className="underline mt-2">{warehouseInDelete?.name}</span>
            <a
              onClick={() => deleteAWarehouse(warehouseInDelete?.id)}
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
