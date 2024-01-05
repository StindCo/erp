import React, { useEffect, useRef, useState } from "react";
import FadeIn from "react-fade-in/lib/FadeIn";
import { BsPlusLg, BsX } from "react-icons/bs";
import { Link } from "react-router-dom";
import { DubenzeneFetcher } from "../../shared/fetchers/Axios";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import {
  createProductCategory,
  deleteProductCategory,
  getProductCategories,
  updateProductCategory,
} from "../../shared/reducers/productCategories";
import { createTask } from "../../shared/reducers/tasks";

type Props = {};

export default function ProductCategory({}: Props) {
  const [name, setName] = useState<any>("");
  const [label, setLabel] = useState<any>("");
  const [description, setDescription] = useState<any>("");
  const viewRef = useRef<any>(null);
  const [focusView, setFocusView] = useState(2);
  const [projetToEdit, setProjetToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  let categories = useSelector(getProductCategories);
  const dispatch = useDispatch();

  const [categoriesFilter, setCategoriesFilter] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<any>(0);
  const [numberOfPage, setNumberOfPage] = useState<any>(1);
  const [pageLength, setPageLength] = useState<any>(10);
  const [filterText, setFilterText] = useState<any>("");
  const [categoryInDelete, setCategoryInDelete] = useState<any>(null);
  const [categoryInUpdate, setCategoryInUpdate] = useState<any>(null);
  const [confirmDeleteShow, setConfirmDeleteShow] = useState(false);
  const [confirmUpdateShow, setConfirmUpdateShow] = useState(false);

  const deleteCategory = (id: any) => {
    dispatch(deleteProductCategory({ productCategory: categoryInDelete }));
    dispatch(
      createTask({
        task: {
          endpoint: `/categories/${categoryInDelete.idTech}`,
          method: "DELETE",
          data: {},
          params: {},
        },
      })
    );

    setConfirmDeleteShow(false);
    setCategoryInDelete({});
  };

  const createCategory = () => {
    let account: any = localStorage.getItem("account");

    const productCategory = {
      label,
      description,
      user: JSON.parse(account),
      createdAt: new Date().toString(),
      idTech: uuidv4(),
    };

    dispatch(createProductCategory({ productCategory }));
    dispatch(
      createTask({
        task: {
          endpoint: "/categories",
          method: "POST",
          data: productCategory,
          params: {},
        },
      })
    );
    setDescription("");
    setLabel("");
    setName("");
    setIsModalOpen(false);
  };

  const modifyCategory = () => {
    let account: any = localStorage.getItem("account");

    const productCategory = {
      ...categoryInUpdate,
      label,
      description,
    };

    dispatch(updateProductCategory({ productCategory }));
    dispatch(
      createTask({
        task: {
          endpoint: `/categories/${categoryInUpdate.idTech}`,
          method: "PUT",
          data: productCategory,
          params: {},
        },
      })
    );
    setDescription("");
    setLabel("");

    setConfirmUpdateShow(false);
    setCategoryInDelete(null);
  };

  useEffect(() => {
    if (filterText == "") {
      let totalPages = Math.ceil(categories.length / pageLength);
      setNumberOfPage(totalPages);
      const startIndex = currentPage * pageLength;
      const endIndex = startIndex + pageLength;
      const subset = categories.slice(startIndex, endIndex);
      setCategoriesFilter(subset);
    } else {
      let value: any = categories.filter(
        (client: any) =>
          client.label.toLowerCase().includes(filterText) ||
          client.description.toLowerCase().includes(filterText)
      );
      setCategoriesFilter(value);
    }
  }, [categories, pageLength, currentPage, filterText]);

  return (
    <div>
      {" "}
      <FadeIn className="overflow-hidden">
        <div
          className="h-full  w-full  p-6 px-6 space-y-8 mt-8"
          onClick={(e) => {}}
        >
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
                  placeholder="Rechercher une catégorie"
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
                <span>Ajouter une catégorie </span>
              </button>
            </div>
          </div>
          <div className="overflow-hidden h-[400px] no-scrollBar overflow-y-scroll">
            <table className="table text-center w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nom</th>
                  <th className="">Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categoriesFilter.map((value: any, index: number) => (
                  <tr>
                    <th>{index + 1}</th>
                    <th className="cursor-pointer select-none font-[PoppinsBold] ">
                      {value.label}{" "}
                    </th>
                    <th className="">
                      {" "}
                      <div className="w-full">{value.description}</div>
                    </th>

                    <th className="space-x-5">
                      <a
                        onClick={() => {
                          setCategoryInUpdate(value);
                          setLabel(value?.label);
                          setDescription(value?.description);
                          setConfirmUpdateShow(true);
                        }}
                        className=" cursor-pointer text-xs  underline"
                      >
                        Modifier
                      </a>
                      <a
                        onClick={() => {
                          setCategoryInDelete(value);
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
            <h2>Enregistrement d'une catégorie</h2>
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
                    <span className="label-text">Un nom</span>
                  </label>
                  <input
                    placeholder="Le nom de la catégorie"
                    type="text"
                    onChange={(e) => setLabel(e.target.value)}
                    className={"input input-bordered"}
                    value={label}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea textarea-bordered"
                    value={description}
                    placeholder="Inserer une description"
                    cols={10}
                    rows={4}
                  ></textarea>
                  {/* <input type="text" className={"input input-bordered"} /> */}
                </div>
              </div>

              <div className="w-64">
                <button
                  onClick={() => createCategory()}
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
            <h2>Suppression de la catégorie</h2>
            <button
              onClick={() => setConfirmDeleteShow(false)}
              className="btn rounded-full btn-sm btn-error text-white"
            >
              <BsX size={20} />
            </button>
          </div>
          <div className="h-64 flex flex-col items-center p-8 text-center">
            êtes-vous sûr de supprimer la categorie:{" "}
            <span className="underline mt-2">{categoryInDelete?.name}</span>
            <a
              onClick={() => deleteCategory(categoryInDelete?.id)}
              className="btn btn-error rounded-lg btn-outline btn-sm mt-8"
            >
              supprimer
            </a>
          </div>
        </div>
      </dialog>
      <dialog
        className={`w-full  h-full modal ${
          confirmUpdateShow ? "modal-open" : ""
        }`}
      >
        <div className="bg-zinc-50 px-6 pt-2 text-lg rounded-lg w-2/4">
          <div className="flex flex-row border-b py-3  px-2 items-center justify-between">
            <h2>Modfification de la catégorie</h2>
            <button
              onClick={() => setConfirmUpdateShow(false)}
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
                    <span className="label-text">Un nom</span>
                  </label>
                  <input
                    placeholder="Le nom de la catégorie"
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className={"input input-bordered"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    className="textarea textarea-bordered"
                    placeholder="Inserer une description"
                    cols={10}
                    rows={4}
                  ></textarea>
                  {/* <input type="text" className={"input input-bordered"} /> */}
                </div>
              </div>

              <div className="w-64">
                <button
                  onClick={() => modifyCategory()}
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
    </div>
  );
}
