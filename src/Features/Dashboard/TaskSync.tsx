import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks } from "../../shared/reducers/tasks";

type Props = {};

export default function TaskSync({}: Props) {
  const [isOfflineText, setIsOfflineText] = useState(2);

  let dispatch = useDispatch();
  let tasks = useSelector(getTasks);

  const synchronize = () => {
    setIsOfflineText(3);
    setTimeout(() => setIsOfflineText(2), 10000);
  };

  return (
    <>
      <div
        onMouseEnter={() => isOfflineText != 3 && setIsOfflineText(1)}
        onMouseLeave={() => isOfflineText != 3 && setIsOfflineText(2)}
        onDoubleClick={() => synchronize()}
        className={`px-6 hover:shadow-lg hover:bg-red-700 z-100 py-3 cursor-pointer text-center items-center justify-center flex bg-red-500 ${
          isOfflineText == 3 && "bg-red-700"
        } select-none text-white rounded-lg shadow-2xl fixed bottom-[2%] left-[15px]`}
      >
        {isOfflineText == 2 && <span> {tasks.length} transactions offline </span>}
        {isOfflineText == 1 && <span> Synchroniser </span>}
        {isOfflineText == 3 && <span> Chargement </span>}
      </div>
    </>
  );
}
