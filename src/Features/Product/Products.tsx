import React, { useEffect, useRef, useState } from "react";
import FadeIn from "react-fade-in/lib/FadeIn";
import { BsPlusLg, BsX } from "react-icons/bs";
import { Link } from "react-router-dom";
import { DubenzeneFetcher } from "../../shared/fetchers/Axios";
import { useDispatch, useSelector } from "react-redux";
import { getWarehouses } from "../../shared/reducers/warehouses";
import { getProductCategories } from "../../shared/reducers/productCategories";
import { getFournisseurs } from "../../shared/reducers/fournisseurs";
import { getConfs } from "../../shared/reducers/confs";
import { v4 as uuidv4 } from "uuid";
import { createTask } from "../../shared/reducers/tasks";
import { createProduct, getProducts } from "../../shared/reducers/products";
import Table from "./Table";
import Importation from "./Importation";

type Props = {};

export default function Products({}: Props) {
  const [label, setLabel] = useState<any>("");
  const [description, setDescription] = useState<any>("");
  const [desiredStock, setDesiredStock] = useState<any>(0);
  const [seuilAlerte, setSeuilAlerte] = useState<any>(0);
  const [price, setPrice] = useState<any>(0);

  const [taux, setTaux] = useState<any>(0);
  let confs = useSelector(getConfs);

  const [margeBeneficiaire, setMargeBeneficiaire] = useState<any>(0);
  const [priceVente, setPriceVente] = useState<any>(0);
  const [priceVenteFc, setPriceVenteFc] = useState<any>(0);
  const [fournisseurSelected, setFournisseurSelected] = useState<any>({});
  const [warehouseSelected, setWarehouseSelected] = useState<any>({});
  const [categorySelected, setCategorySelected] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<any>(0);
  const [pageLength, setPageLength] = useState<any>(10);
  let warehouses = useSelector(getWarehouses);
  let categories = useSelector(getProductCategories);
  let fournisseurs = useSelector(getFournisseurs);
  const dispatch = useDispatch();
  let products = useSelector(getProducts);

  const [filterText, setFilterText] = useState<any>("");
  const [clientInDelete, setClientInDelete] = useState<any>(null);
  const [confirmImportShow, setConfirmImportShow] = useState(false);

  useEffect(() => {
    let tauxValue: any = confs.filter((value: any) => value?.tag == "taux")[0];
    setTaux(parseFloat(tauxValue?.valeur));
  }, [confs]);

  useEffect(() => {
    let priceVente =
      parseFloat(price) +
      (parseFloat(price) * parseFloat(margeBeneficiaire)) / 100;
    let priceVenteFc = priceVente * taux;
    setPriceVenteFc(priceVenteFc);
    setPriceVente(priceVente);
  }, [price, margeBeneficiaire, taux]);

  const deleteClient = (id: any) => {};

  const createAProduct = () => {
    const product = {
      description,
      label,
      desiredStock,
      seuilAlerte,
      code: uuidv4(),
      margeBeneficiaire: parseFloat(margeBeneficiaire),
      price: parseFloat(price),
      category: categorySelected,
      fournisseur: fournisseurSelected,
      warehouse: warehouseSelected,
      createdAt: new Date().toString(),
      idTech: uuidv4(),
    };

    dispatch(createProduct({ product }));
    dispatch(
      createTask({
        task: {
          endpoint: "/products",
          method: "POST",
          data: product,
          params: {},
        },
      })
    );
    setDescription("");
    setPrice(0);
    setSeuilAlerte(0);
    setDesiredStock(0);
    setMargeBeneficiaire(0);
    setLabel("");
    setIsModalOpen(false);
  };

  useEffect(() => {}, [clients, pageLength, currentPage, filterText]);

  return (
    <div>
      {" "}
      <FadeIn className="overflow-hidden">
        <div className="h-full  w-full  p-6 px-6 space-y-8" onClick={(e) => {}}>
          <div className="flex items-center justify-between space-x-8">
            <div className="w-2/6 h-32 p-8 rounded-lg text-zinc-50 shadow-xl  bg-red-500">
              <div className="text-lg flex flex-row items-center justify-between">
                <BsPlusLg size={25} />
                <span className="text-lg font-[PoppinsBold]">100</span>
              </div>
              <div className="text-sm text-right mt-3">
                Produits vendus aujourd'hui
              </div>
            </div>

            <div className="w-2/6 h-32 p-8 rounded-lg text-zinc-50 shadow-xl  bg-yellow-500">
              <div className="text-lg flex flex-row items-center justify-between">
                <BsPlusLg size={25} />
                <span className="text-lg font-[PoppinsBold]">10 </span>
              </div>
              <div className="text-sm text-right mt-3">Produits en alerte</div>
            </div>
            <div className="w-2/6 h-32 p-8 rounded-lg text-zinc-50 shadow-xl  bg-cyan-500">
              <div className="text-lg flex flex-row items-center justify-end">
                {/* <BsPlusLg size={25} /> */}
                <span className="text-lg font-[PoppinsBold]">1020 $</span>
              </div>
              <div className="text-xs text-right mt-3">
                des revenues disponibles
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
          <div className="w-full flex flex-row space-x-6 items-center justify-between">
            <div className="w-2/4">
              <input
                onChange={(e) => setFilterText(e.target.value)}
                type="text"
                placeholder="Rechercher un produit"
                className="input input-bordered w-full"
              />
            </div>
            <div className="flex space-x-6">
              <div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn  btn-outline rounded-lg space-x-3"
                >
                  <BsPlusLg size={15} />
                  <span>Ajouter un produit </span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => setConfirmImportShow(true)}
                  className="btn  btn-outline btn-primary rounded-lg space-x-3"
                >
                  <BsPlusLg size={15} />
                  <span>Importer des produits </span>
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-hidden h-[300px] overflow-y-scroll">
            <Table data={products} filterText={filterText} />
          </div>
        </div>
      </FadeIn>
      <dialog
        className={`w-full  h-full modal ${isModalOpen ? "modal-open" : ""}`}
      >
        <div className="bg-zinc-50 px-6 pt-2 text-lg rounded-lg w-4/6 overflow-hidden overflow-y-scroll h-full">
          <div className="flex flex-row border-b py-3  px-2 items-center justify-between">
            <h2>Enregistrement d'un produit</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn rounded-full btn-sm btn-error text-white"
            >
              <BsX size={20} />
            </button>
          </div>
          <div className="">
            <div className="py-3">
              <div className="grid grid-cols-1 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nom du produit</span>
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Entrez le nom du produit"
                    className={"input input-bordered"}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 py-2">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description du produit</span>
                  </label>
                  <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea textarea-bordered"
                    placeholder="Inserer l'adresse"
                    cols={10}
                    rows={3}
                  ></textarea>
                  {/* <input type="text" className={"input input-bordered"} /> */}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-2">
                <div className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Catégorie de produit</span>
                  </div>
                  <select
                    className="select select-bordered"
                    onChange={(e) =>
                      setCategorySelected(
                        categories.filter(
                          (value: any) => value?.idTech == e.target.value
                        )[0]
                      )
                    }
                  >
                    <option disabled selected>
                      Pick one
                    </option>
                    {categories.map((value: any, index: number) => (
                      <option value={value?.idTech} key={value?.idTech}>
                        {value?.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Founisseur par défaut</span>
                  </div>
                  <select
                    className="select select-bordered"
                    onChange={(e) =>
                      setFournisseurSelected(
                        fournisseurs.filter(
                          (value: any) => value?.idTech == e.target.value
                        )[0]
                      )
                    }
                  >
                    <option disabled selected>
                      Pick one
                    </option>
                    {fournisseurs.map((value: any, index: number) => (
                      <option value={value?.idTech} key={value?.idTech}>
                        {value?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Entrepôt par défaut</span>
                  </div>
                  <select
                    className="select select-bordered"
                    onChange={(e) =>
                      setWarehouseSelected(
                        warehouses.filter(
                          (value: any) => value?.idTech == e.target.value
                        )[0]
                      )
                    }
                  >
                    <option disabled selected>
                      Pick one
                    </option>
                    {warehouses.map((value: any, index: number) => (
                      <option value={value?.idTech} key={value?.idTech}>
                        {value?.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="divider text-sm">Informations sur le stock</div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Stock alerte</span>
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setSeuilAlerte(e.target.value)}
                    value={seuilAlerte}
                    placeholder="Stock alerte"
                    className={"input input-bordered"}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Stock optimal</span>
                  </label>
                  <input
                    placeholder="Stock optimal"
                    type="text"
                    value={desiredStock}
                    onChange={(e) => setDesiredStock(e.target.value)}
                    className={"input input-bordered"}
                  />
                </div>
              </div>
              <br />
              <div className="divider text-sm">Informations sur le prix</div>

              <div className="grid grid-cols-4 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Prix d'achat</span>
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    placeholder="Prix d'achat"
                    className={"input input-bordered"}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Marge bénificiaire</span>
                  </label>
                  <input
                    placeholder="Marge bénéficiaire"
                    type="text"
                    value={margeBeneficiaire}
                    onChange={(e) => setMargeBeneficiaire(e.target.value)}
                    className={"input input-bordered"}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Prix de vente ($)</span>
                  </label>
                  <input
                    placeholder="Marge bénéficiaire"
                    type="text"
                    disabled={true}
                    value={priceVente + " $"}
                    className={"input input-bordered"}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Prix de vente (FC)</span>
                  </label>
                  <input
                    placeholder="Marge bénéficiaire"
                    type="text"
                    disabled={true}
                    value={priceVenteFc + " FC"}
                    className={"input input-bordered"}
                  />
                </div>
              </div>

              <div className="w-1/2">
                <button
                  onClick={() => createAProduct()}
                  className="py-3  btn mt-5 w-full rounded-md  "
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
          confirmImportShow ? "modal-open" : ""
        }`}
      >
        <div className="bg-zinc-50 px-6 pt-2 text-lg rounded-lg w-5/6 overflow-hidden  h-full">
          <div className="flex flex-row border-b py-3  px-2 items-center justify-between">
            <h2>Importation des produits</h2>
            <button
              onClick={() => setConfirmImportShow(false)}
              className="btn rounded-full btn-sm btn-error text-white"
            >
              <BsX size={20} />
            </button>
          </div>
          <div>
            <Importation details={[]} />
          </div>
        </div>
      </dialog>
    </div>
  );
}
