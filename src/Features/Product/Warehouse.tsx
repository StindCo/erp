import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DubenzeneFetcher } from "../../shared/fetchers/Axios";
import { BsPerson, BsX } from "react-icons/bs";
import { MdStore } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  getWarehouses,
  updateWarehouse,
} from "../../shared/reducers/warehouses";
import { getAccounts } from "../../shared/reducers/accounts";
import { createTask } from "../../shared/reducers/tasks";

type Props = {
  data: any;
};

function Warehouse(props: Props) {
  let { id } = useParams();
  let warehousesFounded = useSelector(getWarehouses);
  const dispatch = useDispatch();
  const [warehouse, setWarehouse] = useState<any>({});
  const [view, setView] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal1Open, setIsModal1Open] = useState(false);
  const [name, setName] = useState<any>(warehouse?.name);
  const [description, setDescription] = useState<any>(warehouse?.description);
  const [adresse, setAdresse] = useState<any>(warehouse?.adresse);

  let accounts = useSelector(getAccounts);

  const [selectedManager, setSelectedManager] = useState<any>({});

  const updateWarehouseA = () => {
    let account: any = localStorage.getItem("account");

    const dataToSend = {
      ...warehouse,
      description,
      adresse,
      name,
    };

    dispatch(updateWarehouse({ warehouse: dataToSend }));
    dispatch(
      createTask({
        task: {
          endpoint: "/warehouses/" + id,
          method: "PUT",
          data: dataToSend,
          params: {},
        },
      })
    );
    setIsModalOpen(false);
  };

  const changerManager = () => {
    let dataToSend: any = {
      ...warehouse,
      responsable: selectedManager,
    };

    dispatch(updateWarehouse({ warehouse: dataToSend }));
    dispatch(
      createTask({
        task: {
          endpoint: "/warehouses/" + id + "/manager",
          method: "PUT",
          data: dataToSend,
          params: {},
        },
      })
    );
    setIsModal1Open(false);
  };

  useEffect(() => {
    let warehouse: any =
      warehousesFounded.filter((value: any) => value?.idTech == id)[0] ?? {};
    setWarehouse(warehouse);
    setName(warehouse?.name);
    setDescription(warehouse?.description);
    setAdresse(warehouse?.adresse);
  }, [warehousesFounded, id]);

  return (
    <>
      <div className="w-full h-full flex items-start">
        <div className="w-1/4 bg-[#fefefe] shadow-lg h-full rounded-t-lg">
          <div className="p-5 text-center space-y-3">
            <p className="underline text-xs mb-8">Entrepôt</p>
            <div className="w-32 bg-slate-200 rounded-lg flex items-center justify-center mx-auto   h-32">
              <MdStore size={65} />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-[PoppinsBold] px-3">
                {warehouse?.name}
              </p>
              <p className="text-sm italic">{warehouse.description}</p>
              <p className="text-sm italic">{warehouse.adresse}</p>
            </div>
            <hr />
            <p className="text-lg">Détails</p>
            <div className="space-y-2 text-left mx-auto p-2">
              <div className="text-sm text-left italic grid grid-cols-2 items-center">
                <span>Responsable </span>
                <span className="text-lg font-[PoppinsBold]">
                  {warehouse?.responsable?.fullname}
                </span>
              </div>
              <div className="text-sm italic grid grid-cols-2 items-center">
                <span>Taux spécial </span>
                <span className="text-sm">
                  {warehouse?.taux == 0 ? "non défini" : warehouse?.taux}
                </span>
              </div>
            </div>
            <hr />
            <p className="text-lg">Actions</p>
            <div className="space-y-2 text-left">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full btn btn-outline btn-sm rounded-lg"
              >
                Modifier{" "}
              </button>
              <button
                onClick={() => setIsModal1Open(true)}
                className="w-full btn btn-outline btn-sm rounded-lg"
              >
                Nouveau responsable
              </button>
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
              Stocks
            </p>
            <p
              onClick={() => setView(2)}
              className={`p-3 hover:bg-slate-500 hover:text-white px-6  ${
                view == 2 && "bg-slate-500 text-white"
              }   cursor-pointer`}
            >
              Mouvements de stocks
            </p>
            <p
              onClick={() => setView(3)}
              className={`p-3 hover:bg-slate-500 hover:text-white px-6  ${
                view == 3 && "bg-slate-500 text-white"
              }  cursor-pointer`}
            >
              Réapprovisionnement
            </p>
            <p
              onClick={() => setView(4)}
              className={`p-3 hover:bg-slate-500 hover:text-white px-6  ${
                view == 4 && "bg-slate-500 text-white"
              }  cursor-pointer`}
            >
              Transfert de stocks
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

      <dialog
        className={`w-full  h-full modal ${isModalOpen ? "modal-open" : ""}`}
      >
        <div className="bg-zinc-50 px-6 pt-2 text-lg rounded-lg w-2/4">
          <div className="flex flex-row border-b py-3  px-2 items-center justify-between">
            <h2>Modification d'un entrepôt</h2>
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
                    onChange={(e) => setName(e.target.value)}
                    value={name}
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
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
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
                  onClick={() => updateWarehouseA()}
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
        className={`w-full  h-full modal ${isModal1Open ? "modal-open" : ""}`}
      >
        <div className="bg-zinc-50 px-6 pt-2 text-lg rounded-lg w-2/4">
          <div className="flex flex-row border-b py-3  px-2 items-center justify-between">
            <h2>Changement du responsable</h2>
            <button
              onClick={() => setIsModal1Open(false)}
              className="btn rounded-full btn-sm btn-error text-white"
            >
              <BsX size={20} />
            </button>
          </div>
          <div className="">
            <div className="py-3 space-y-2">
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
                      <option key={value?.id} value={value?.id}>
                        {value?.fullname}
                      </option>
                    ))}
                  </select>
                  {/* <input type="text" className={"input input-bordered"} /> */}
                </div>
              </div>

              <div className="w-64">
                <button
                  onClick={() => changerManager()}
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
    </>
  );
}

export default Warehouse;
