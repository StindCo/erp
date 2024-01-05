import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getCurrentTheme } from "../../shared/reducers/theme";
import loginImage from "../../assets/images/loginImage.jpg";
import logoImage from "../../assets/images/logo.png";
import FadeIn from "react-fade-in/lib/FadeIn";
import Loader from "../../shared/components/Loader/Loader";
import Logo from "../../shared/components/Logo/Logo";
import { useEffect, useState } from "react";
import { LoginService } from "./LoginService";
import Toast from "../../shared/components/Toast/Toast";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../shared/reducers/login";

type Props = {};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [IsErrorMessageVisible, setIsErrorMessageVisible] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const validateUsername = () => {
    setIsUsernameValid(username != "");
  };

  const validatePassword = () => {
    setIsPasswordValid(password != "");
  };

  let currentTheme = useSelector(getCurrentTheme);

  const onSubmit = (e: any) => {
    validateUsername();
    validatePassword();

    if (isPasswordValid && isUsernameValid) {
      let response: any = LoginService.login(username, password).then(
        (data: any) => {
          if (data.message == "ok") {
            dispatch(loginUser({ user: data?.data }));
            navigate("/dashboard");
          }
          toggleMessageError(data);
        }
      );
    }

    e.preventDefault();
  };

  const toggleMessageError = (text: any) => {
    setErrorMessage(text);
    setIsErrorMessageVisible(true);
    setTimeout(() => {
      setIsErrorMessageVisible(false);
    }, 5000);
  };

  return (
    <>
      {IsErrorMessageVisible && <Toast type="error" message={errorMessage} />}

      <FadeIn className="overflow-hidden">
        <div
          className="bg-white h-screen overflow-hidden overlflow-y-scroll"
          // style={{
          //   backgroundImage: `url(${bgLogin})`,
          //   backgroundPosition: "center",
          //   backgroundRepeat: "no-repeat",
          //   backgroundSize: "cover",
          // }}
        >
          {/* <Logo type="arptc" propStyle="mb-16" /> */}

          <div className="w-full h-full flex flex-row justify-between items-center">
            <div className="bg-orange-50 shadow-xl h-full w-2/4 flex items-center justify-center">
              <div className="w-4/5 rounded-2xl">
                <div className="p-5 space-y-2">
                  <h2 className="text-xl">Salut ! 👋</h2>
                  <h4>
                   Authentifiez-vous afin de continuer
                  </h4>
                </div>
                <div className="px-5">
                  <form method="post" onSubmit={onSubmit} className="space-y-5">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Identifiant</span>
                      </label>
                      <input
                        type="text"
                        placeholder="email"
                        onChange={(e) => setUsername(e.target.value)}
                        onBlur={() => validateUsername()}
                        className={
                          isUsernameValid
                            ? "input input-bordered"
                            : "input input-bordered input-error"
                        }
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Password</span>
                      </label>
                      <input
                        type="password"
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => validatePassword()}
                        className={
                          isPasswordValid
                            ? "input input-bordered"
                            : "input input-bordered input-error"
                        }
                      />
                      <label className="text-right">
                        <a href="#" className="label-text-alt link  link-hover">
                          Mot de passe oublié ?
                        </a>
                      </label>
                    </div>
                    <div className="form-control mt-8">
                      <button
                        className="py-3 hover:bg-[#201306] rounded-md  bg-[#1b1610] text-lg text-white"
                        type="submit"
                      >
                        Se connecter
                      </button>
                    </div>
                    {/* <hr className="w-1/6 mx-auto border-b border-[#030b1d85]" /> */}
                    <br />

                  </form>
                </div>
              </div>
            </div>
            <div className="w-2/4 rounded-l-[10px] h-full flex flex-col items-center justify-between py-14 bg-white ">
            <div className="w-full flex flex-col items-center">
               <img className="w-[200px] mb-10" src={logoImage} />
               <h1 className="text-8xl text-center font-[PoppinsBold]">DuBenzene</h1>
               <h1 className="text-2xl text-center mt-2">global pharmaceutical soft</h1>
              </div>
              <div className="w-full flex flex-col items-center">
                <h1>by</h1>
                <img className="w-[150px]" src={loginImage} />
              </div>

            </div>
          </div>
        </div>
      </FadeIn>
    </>
  );
}
