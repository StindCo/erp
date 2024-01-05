import React, { useEffect, useState } from "react";
import { BsPerson } from "react-icons/bs";

type Props = {};

function Profile({}: Props) {
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    let account: any = localStorage.getItem("account");
    setUser(JSON.parse(account));
  }, []);

  return (
    <div>
      <div className="bg-yellow-600 h-48 rounded-t-lg"></div>
      <div className="flex justify-around px-3 items-start mt-[-70px]">
        <div className="bg-white rounded-lg shadow-lg h-[700px] w-96">
          <div className="p-8 text-center space-y-3">
            <div className="w-28 bg-slate-300 rounded-full flex items-center justify-center mx-auto  h-28">
              <BsPerson size={64} />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-[PoppinsBold]">{user?.fullname}</p>
              <p>
                {user?.privilegeNumber == 1
                  ? "Administrateur"
                  : user.privilegeNumber == 2
                  ? "Warehouse manager"
                  : "Vendeur"}
              </p>
            </div>
            <hr />
            <div className="space-y-2 text-left">
              <button className="w-full btn rounded-lg">Mon profil </button>
              <button className="w-full btn rounded-lg btn-outline">
                {" "}
                Configuration de l'application
              </button>
              <button className="w-full btn rounded-lg btn-outline">
                {" "}
                Historique de connexion
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg h-[500px] w-3/5"></div>
      </div>
    </div>
  );
}

export default Profile;
