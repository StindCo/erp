import { useEffect, useState } from "react";
import {
  BsChatLeftDots,
  BsDatabase,
  BsFiles,
  BsFolder,
  BsGear,
  BsHouse,
  BsPerson,
  BsPlayCircle,
  BsPuzzle,
} from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/mylogo.png";
import Loader from "../../shared/components/Loader/Loader";
// import { loadOperateurs } from "../../shared/reducers/clients";
import { loadSchema } from "../../shared/reducers/schema";
import { fetchOperateurs, fetchSchemas, verifyUser } from "./DashboardFetch";
import ParticlesBg from "particles-bg";
import { loginUser } from "../../shared/reducers/login";
import Editor from "@monaco-editor/react";
import { DubenzeneFetcher, ProjectManager } from "../../shared/fetchers/Axios";
import { PatternsContext } from "./PatternsContext";
import { TbDashboard, TbHomeDollar } from "react-icons/tb";
import { FcMoneyTransfer } from "react-icons/fc";
import { GiBuyCard, GiCog } from "react-icons/gi";
import { HiUser, HiUsers } from "react-icons/hi";
import {
  MdGroups,
  MdLogout,
  MdSignalCellularConnectedNoInternet0Bar,
  MdStore,
} from "react-icons/md";
import { RiOrderPlayLine } from "react-icons/ri";
import { VscAccount } from "react-icons/vsc";
import Profile from "./Profile";
import Conf from "./Confs";
import { LocalforageStore } from "../../shared/models/localForage";
import { loadClients } from "../../shared/reducers/clients";
import TaskSync from "./TaskSync";
import { loadTasks } from "../../shared/reducers/tasks";
import { loadFournisseurs } from "../../shared/reducers/fournisseurs";
import { loadProductCategories } from "../../shared/reducers/productCategories";
import { loadAccounts } from "../../shared/reducers/accounts";
import { loadWarehouses } from "../../shared/reducers/warehouses";
import Confs from "./Confs";
import { loadProducts } from "../../shared/reducers/products";
import { loadConfs } from "../../shared/reducers/confs";

type Props = {
  message: any;
  type: string;
};

export default function Dashboard() {
  let navigate = useNavigate();
  const [account, setAccount] = useState<any>(null);
  let location = useLocation();

  const [isOfflineText, setIsOfflineText] = useState(2);
  const [view, setView] = useState<any>(0);
  let [patterns, setPatterns] = useState([]);
  let dispatch = useDispatch();

  const getAccount = () => {
    let account: any = localStorage.getItem("account");

    setAccount(JSON.parse(account));
  };

  const synchronize = () => {
    setIsOfflineText(3);
    setTimeout(() => setIsOfflineText(2), 10000);
  };

  const loadAll = async () => {
    LocalforageStore.getItem("clients").then((value: any) => {
      dispatch(loadClients({ clients: value }));
    });

    LocalforageStore.getItem("tasks").then((value: any) => {
      dispatch(loadTasks({ tasks: value }));
    });

    LocalforageStore.getItem("fournisseurs").then((value: any) => {
      dispatch(loadFournisseurs({ fournisseurs: value }));
    });

    LocalforageStore.getItem("confs").then((value: any) => {
      dispatch(loadConfs({ confs: value }));
    });

    LocalforageStore.getItem("products").then((value: any) => {
      dispatch(loadProducts({ products: value }));
    });

    LocalforageStore.getItem("product_categories").then((value: any) => {
      console.log(value);
      dispatch(loadProductCategories({ product_categories: value }));
    });

    LocalforageStore.getItem("warehouses").then((value: any) => {
      dispatch(loadWarehouses({ warehouses: value }));
    });

    DubenzeneFetcher.get("/accounts").then(({ data }: any) => {
      LocalforageStore.setItem("accounts", data?.data);
      dispatch(loadAccounts({ accounts: data?.data }));
    });
  };

  useEffect(() => {
    getAccount();
    loadAll();
  }, []);

  return (
    <>
      <div
        className={`h-screen w-screen overflow-hidden flex flex-row  bg-[#f1efedaa] ${
          location.pathname == "/dashboard/project" ? "" : "backdrop-blur-sm"
        } `}
      >
        <div className="lg:w-1/5 w-20 bg-white shadow-lg h-full">
          <div className="p-3 text-center mt-3">
            <h1 className="text-2xl flex items-center justify-start space-x-2">
              <span className="font-[Arial] bg-amber-600 p-2 px-4 rounded-lg text-white text-3xl">
                M
              </span>{" "}
              <span className="hidden lg:block">Manager.</span>
            </h1>
          </div>
          {/* Menu side bar */}
          <div className="w-full mt-16 space-y-3">
            <Link
              onClick={() => setView(0)}
              to="/dashboard/projects"
              className={`border-l-4  hover:bg-amber-50  cursor-pointer text-md ${
                view == 0
                  ? "bg-amber-50 text-orange-800 border-orange-800"
                  : "border-transparent"
              }   w-full items-center flex space-x-6 p-4`}
            >
              <TbDashboard size={25} />
              <h3 className="hidden lg:block">Tableau de bord</h3>
            </Link>
            <Link
              onClick={() => setView(1)}
              to="/dashboard/products-manager"
              className={`border-l-4  hover:bg-amber-50  cursor-pointer text-md ${
                view == 1
                  ? "bg-amber-50 text-orange-800 border-orange-800"
                  : "border-transparent"
              }   w-full items-center flex space-x-6 p-4`}
            >
              <GiBuyCard size={25} />
              <h3 className="hidden lg:block">Gestion des produits</h3>
            </Link>
            <Link
              onClick={() => setView(3)}
              to="/dashboard/stocks"
              className={`border-l-4  hover:bg-amber-50  cursor-pointer text-md ${
                view == 3
                  ? "bg-amber-50 text-orange-800 border-orange-800"
                  : "border-transparent"
              }   w-full items-center flex space-x-6 p-4`}
            >
              <MdStore size={25} />
              <h3 className="hidden lg:block">Gestion des stocks</h3>
            </Link>
            <Link
              onClick={() => setView(2)}
              to="/dashboard/projects"
              className={`border-l-4  hover:bg-amber-50  cursor-pointer text-md ${
                view == 2
                  ? "bg-amber-50 text-orange-800 border-orange-800"
                  : "border-transparent"
              }   w-full items-center flex space-x-6 p-4`}
            >
              <FcMoneyTransfer size={25} />
              <h3 className="hidden lg:block">Gestion des ventes</h3>
            </Link>

            <Link
              onClick={() => setView(4)}
              to="/dashboard/tiers"
              className={`border-l-4  hover:bg-amber-50  cursor-pointer text-md ${
                view == 4
                  ? "bg-amber-50 text-orange-800 border-orange-800"
                  : "border-transparent"
              }   w-full items-center flex space-x-6 p-4`}
            >
              <MdGroups size={25} />
              <h3 className="hidden lg:block">Gestion des tiers</h3>
            </Link>
            <Link
              onClick={() => setView(5)}
              to="/dashboard/projects"
              className={`border-l-4  hover:bg-amber-50  cursor-pointer text-md ${
                view == 5
                  ? "bg-amber-50 text-orange-800 border-orange-800"
                  : "border-transparent"
              }   w-full items-center flex space-x-6 p-4`}
            >
              <TbHomeDollar size={25} />
              <h3 className="hidden lg:block">Gestion des dépenses</h3>
            </Link>
            <Link
              onClick={() => setView(6)}
              to="/dashboard/projects"
              className={`border-l-4  hover:bg-amber-50  cursor-pointer text-md ${
                view == 6
                  ? "bg-amber-50 text-orange-800 border-orange-800"
                  : "border-transparent"
              }   w-full items-center flex space-x-6 p-4`}
            >
              <HiUsers size={25} />
              <h3 className="hidden lg:block">Mon personnel</h3>
            </Link>
          </div>
        </div>

        <PatternsContext.Provider value={patterns}>
          {/* Menu line and tab */}
          <div className="w-full  px-6 space-y-4 h-full overflow-hidden">
            <div className="w-full">
              {/* Menu line and tab */}
              <div className=" rounded-lg mt-4 px-3 bg-[#fefefe] flex justify-between items-center">
                {view == 0 && (
                  <div className="flex items-center space-x-4 p-5 text-lg text-amber-900">
                    <TbDashboard size={25} />
                    <h3>Tableau de bord</h3>
                  </div>
                )}
                {view == 1 && (
                  <div className="flex text-lg items-center space-x-4 p-5 text-amber-900">
                    <GiBuyCard size={25} />
                    <h3>Gestion des produits</h3>
                  </div>
                )}
                {view == 2 && (
                  <div className="flex text-lg items-center space-x-4 p-5 text-amber-900">
                    <FcMoneyTransfer size={25} />
                    <h3>Gestion des ventes</h3>
                  </div>
                )}
                {view == 3 && (
                  <div className="flex text-lg items-center space-x-4 p-5 text-amber-900">
                    <MdStore size={25} />
                    <h3>Gestion des stocks </h3>
                  </div>
                )}
                {view == 4 && (
                  <div className="flex text-lg items-center space-x-4 p-5 text-amber-900">
                    <MdGroups size={25} />
                    <h3>Gestion des tiers</h3>
                  </div>
                )}
                {view == 5 && (
                  <div className="flex text-lg items-center space-x-4 p-5 text-amber-900">
                    <TbHomeDollar size={25} />
                    <h3>Mes Dépenses</h3>
                  </div>
                )}
                {view == 6 && (
                  <div className="flex text-lg items-center space-x-4 p-5 text-amber-900">
                    <HiUsers size={25} />
                    <h3>Mon personnel</h3>
                  </div>
                )}
                {view == 7 && (
                  <div className="flex text-lg items-center space-x-4 p-5 text-amber-900">
                    <HiUser size={25} />
                    <h3>Mon compte</h3>
                  </div>
                )}
                {view == 8 && (
                  <div className="flex text-lg items-center space-x-4 p-5 text-amber-900">
                    <HiUser size={25} />
                    <h3>Gestion des configurations</h3>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <div
                    onClick={() => setView(7)}
                    className={`flex items-center space-x-3 border hover:bg-slate-100 p-2 px-6 cursor-pointer rounded-lg ${
                      view == 7 && "bg-slate-100"
                    }`}
                  >
                    <div className="border p-1 rounded-full">
                      <VscAccount size={20} />
                    </div>
                    <span className="text-sm">{account?.fullname}</span>
                  </div>
                  <div
                    onClick={() => setView(8)}
                    className={`flex items-center space-x-3  hover:bg-blue-900 ${
                      view == 8 ? "bg-blue-900 text-white" : ""
                    } hover:text-white p-2 cursor-pointer rounded-full`}
                  >
                    <div className=" p-1 rounded-full">
                      <GiCog size={20} />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3  bg-orange-700 text-white p-2 cursor-pointer rounded-full">
                    <Link to="/" className=" p-1 rounded-full">
                      <MdLogout size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#fefefe] rounded-lg w-full h-screen">
              {view == 7 && <Profile />}
              {view == 8 && <Confs />}
              {(view != 7 || view != 8) && <Outlet />}
            </div>
          </div>
        </PatternsContext.Provider>
      </div>

      <TaskSync />
    </>
  );
}
