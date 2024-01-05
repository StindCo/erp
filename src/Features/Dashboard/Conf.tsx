import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createTask } from "../../shared/reducers/tasks";
import { updateConf } from "../../shared/reducers/confs";

type Props = {
  data: any;
};

export default function Conf({ data }: Props) {
  const [inputOpen, setInputOpen] = useState(false);
  const [value, setValue] = useState(data?.valeur);
  const dispatch = useDispatch();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const dataToSend = {
      ...data,
      valeur: value,
    };

    dispatch(updateConf({ conf: dataToSend }));
    dispatch(
      createTask({
        task: {
          endpoint: "/confs?tag=" + dataToSend?.tag,
          method: "PUT",
          data: dataToSend,
          params: {},
        },
      })
    );
    setInputOpen(false);
  };
  return (
    <div className="grid grid-cols-2 gap-2 text-center border-b pb-6">
      <div className="text-lg">{data?.label}</div>
      <div className="text-lg items-center">
        {!inputOpen && (
          <>
            <span>
              <strong className="underline font-[poppinsBold]">{value}</strong>{" "}
              <span className="text-sm"></span>
            </span>{" "}
            <span
              onClick={() => setInputOpen(true)}
              className="text-xs cursor-pointer select-none ml-6 text-orange-600 "
            >
              Modifier
            </span>
          </>
        )}{" "}
        {inputOpen && (
          <>
            <form onSubmit={handleSubmit}>
              <input
                className="input input-bordered input-sm"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                className="btn btn-sm"
                type="submit"
              >
                {" "}
                Modifier{" "}
              </button>
            </form>
          </>
        )}{" "}
      </div>
    </div>
  );
}
