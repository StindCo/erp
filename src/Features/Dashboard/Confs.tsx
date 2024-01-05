import React, { useEffect, useState } from "react";
import { BsPerson } from "react-icons/bs";
import { useSelector } from "react-redux";
import { getConfs } from "../../shared/reducers/confs";
import Conf from "./Conf";

type Props = {};

function Confs({}: Props) {
  const [user, setUser] = useState<any>({});

  let confs = useSelector(getConfs);

  useEffect(() => {
    let account: any = localStorage.getItem("account");
    setUser(JSON.parse(account));
  }, []);

  return (
    <div>
      <div className="bg-cyan-700 h-56 rounded-t-lg"></div>
      <div className="flex justify-around px-3 items-start mt-[-95px]">
        <div className="bg-white shadow-lg rounded-lg h-screen w-[94%]">
          <div>
            <p className="text-xl p-8 border-b">
              Configuration des variables globales
            </p>
          </div>
          <div className="mx-auto p-5">
            {confs.map((value: any) => (
              <Conf data={value} key={Math.random()} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Confs;
