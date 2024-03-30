import "./settings.css";
// import ValidInformation from '../../Info/Information';
import React, { ChangeEvent, useContext, useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCamera } from "@fortawesome/free-solid-svg-icons";
// import logo from '../../../assets/avatars/anime_style.png';
// import '../../Info/Information.css';
import DataContext from "../../../services/data.context";
// import QRCODE from "./images.png";
// import axios from 'axios';
// import picture from "./mdarify.png";
import LoadingComponent from "../../shared/loading/loading";
// import FourHundredFourComponent from "../../error/404.component";
import { Route, Router, Routes } from "react-router-dom";
import HomePageComponent from "../../HomePage";
import { jsx } from "@emotion/react";
import { Alert } from "flowbite-react";
import { AlertProps } from '@mui/material/Alert';


/*

import React, { useState } from 'react';

function App() {
  const [backgroundColor, setBackgroundColor] = useState("lightblue");

  const changeBackgroundColor = () => {
    setBackgroundColor(getRandomColor()); // Replace getRandomColor() with your color generation logic
  }

  return (
    <div>
      <div style={{ backgroundColor: backgroundColor }} className="your-component-class">
        Your component content here 
        </div>
        <button onClick={changeBackgroundColor}>Change Color</button>
      </div>
    );
  }
  
  export default App;
*/

const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
  const fileInput = event.target;
  const chosenFile = fileInput.files && fileInput.files[0];

  if (chosenFile) {
    const reader = new FileReader();

    reader.onload = () => {
      const imgElement = document.querySelector("#list") as HTMLImageElement;

      if (imgElement) {
        imgElement.src = reader.result as string;
      }
    };
    reader.readAsDataURL(chosenFile);
  }
};


// "linear-gradient(to right, #d80909, #a02626, #610101)"

function SettingFunction(): JSX.Element {
  const [ShowSignUp, SetShowSignUp] = useState<boolean>(false);
  const [ischecked, setIsChecked] = useState<boolean>(false);
  const [backgroundColor, setBackgroundColor] = useState<string>("linear-gradient(to right, #217441, #207a3f, #22A34A)");
  const FuncClick = () => {
    SetShowSignUp(!ShowSignUp);
    setIsChecked(!ischecked);
  }
  const changeBackgroundColor = () => {
      setBackgroundColor("linear-gradient(to right, #217441, #207a3f, #22A34A)"); // Replace getRandomColor() with your color generation logic
  }
  const APIURL = import.meta.env.VITE_API_AUTH_KEY;
  const [input, setInput] = useState("");
  const [url, setUrl] = useState<string>("");
  const userData = useContext(DataContext);
  // if (! userData)
  //   return <LoadingComponent />
  useEffect(() => {
    if (!userData) return;
    const fetchData = async () => {
      try {
        console.log("Uf2wserId: -->", userData);
        const Qrcode = await fetch(
          APIURL + `2fa/generate/${userData[0].id}/${userData[0].email}`,
          {
            method: "GET",
            credentials: "same-origin",
          }
        );
        if (Qrcode.ok) {
          const QRcode = await Qrcode.json();
          setUrl(() => QRcode.url);
          console.log("list li--> ", QRcode);
        }
      } catch (error) {
        console.error("Error fetching user ", error);
      }
    };
    fetchData();
  }, [userData]);
  if (!userData) return <LoadingComponent />;
  // console.log();
  let TfCode: string = "";
  function focusNextInput(
    el: HTMLInputElement,
    prevId: string | null,
    nextId: string | null
  ) {
    if (el.value.length === 0) {
      if (prevId) {
        const prevElement = document.getElementById(
          prevId
        ) as HTMLInputElement | null;
        if (prevElement) {
          prevElement.focus();
        }
      }
    } else {
      if (nextId) {
        const nextElement = document.getElementById(
          nextId
        ) as HTMLInputElement | null;
        if (nextElement) {
          nextElement.focus();
        }
      }
    }
    TfCode = el.value;
  }
  document.querySelectorAll("[data-focus-input-init]").forEach((element) => {
    element.addEventListener("keyup", function (this: HTMLElement) {
      const prevId = this.getAttribute("data-focus-input-prev");
      const nextId = this.getAttribute("data-focus-input-next");
      if (this instanceof HTMLInputElement) {
        focusNextInput(this, prevId, nextId);
        // console.log(prevId, ' prve ', nextId);
      }
    });
    // console.log(this instanceof HTMLInputElement);
  });

  const onchange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (input.length != 6)
      return;
    await fetchQRcode();
  }
  const fetchQRcode = async () => {
    try {
      // console.log('Tfcode --> ', TfCode, 'userData --> ', userData[0].id, ' input', input);
      const ValidQRcode = await fetch(APIURL + `2fa/authenticate/${input}/${userData[0].id}`, {
        method: 'POST',
        credentials: 'same-origin',
        // redirect: 'follow'
      })
      console.log('status code1 --> : ', ValidQRcode)
      if (ValidQRcode.status == 200) {
        console.log("lisljsjfs -> ");
        console.log('State Two valud 1 --> : ', userData[0].isTwoFactorAuthenticationEnabled)
        userData[0].isTwoFactorAuthenticationEnabled = true;
        console.log('State Two valud 2 --> : ', userData[0].isTwoFactorAuthenticationEnabled)
        console.log('valid UserDate --> ', userData);
        console.log('status code2 --> : ', ValidQRcode);

        // window.location.href = `https://10.12.13.6/`;
      }
      else {
        console.log('invalid Qrcode --> : ', ValidQRcode)
        console.log('State Two valud 1 --> : ', userData[0].isTwoFactorAuthenticationEnabled)
        userData[0].isTwoFactorAuthenticationEnabled = false;
        console.log('State Two valud 2 --> : ', userData[0].isTwoFactorAuthenticationEnabled)
        console.log('valid UserDate --> ', userData[0]);
        // window.location.href = `https://10.12.13.6/Error`;
      }
      // window.location.href = APIURL + `2fa/authenticate/${input}/${userData[0].id}`;
      // window.location.href = `https://10.11.6.10/`;
      // console.log(await ValidQRcode.json());

      // if (ValidQRcode == true)
      //   window.location.href = "http://localhost:4200";
      // console.log("ValidQRcode: ", ValidQRcode);
    }
    catch (error) {
      console.log('Invalid qrcode \n');
    }
  };
  useEffect(() => {}, [ischecked])
  return (
    <div
      className="
            m-4 flex flex-col new:flex-row w-full h-[90vh] 
            justify-between gap-4 bg-inherit overflow-hidden 
            overflow-y-scroll no-scrollbar 
            Setting"
    >
      <div className="part1   gap-4 w-full md:min-w-[35%] overflow-y-scroll no-scrollbar min-h-full overflow-hidden Usredit">
        {/* <div className="titpr"></div> */}
        <div className="p-4  overflow-hidden flex flex-col  overflow-y-scroll no-scrollbar w-full justify-center items-center gap-12 ">
          <img src={userData[0]?.picture || ''} id="list" alt="" />
          <label htmlFor="file" id="uploadbtn" className="gap-4">
            <p onChange={handleFileChange} className="parPhoto">
              TAKE A PHOTO
            </p>
            {/* <FontAwesomeIcon icon={faCamera} className="cameraIcon" /> */}
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M7.5 4.586A2 2 0 0 1 8.914 4h6.172a2 2 0 0 1 1.414.586L17.914 6H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1.086L7.5 4.586ZM10 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm2-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" clipRule="evenodd" />
            </svg>

          </label>
        </div>
        <input type="file" id="file" onChange={handleFileChange} />
        <div>{/* <YourComponent /> */}</div>
        <div className="flex flex-col justify-center items-center gap-12 mt-2">
          <h2
            className="
                    text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br 
                    focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg
                   dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2  FontAwesome -twof--part1"
          >
            2FA-AUTHENTICATION
          </h2>
          <img className={`${ischecked? 'visible' : 'invisible'}`} src={url} alt="" />

          <form className="max-w-sm mx-auto" onSubmit={onchange}>
          <p
              id="helper-text-explanation"
              className={`mt-2 text-sm text-gray-500 dark:text-gray-400 -twof--part1 font-extrabold ${ischecked? 'visible' : 'invisible'}`}
            >
              Please introduce the 6 digit <br />
              code scanned by application
            </p>
            <div className={`flex mt-8 space-x-2 rtl:space-x-reverse flex-row justify-center items-center ${ischecked? 'visible' : 'invisible'}`}>
              <div className="flex flex-row justify-center items-center">
                <label
                  htmlFor="code-1"
                  className="sr-only"
                  onClick={SettingFunction}
                >
                  First code
                </label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={6}
                  autoComplete="OFF"
                  data-focus-input-init
                  data-focus-input-next="code-2"
                  id="code-1"
                  className=" w-full h-9 py-3 text-sm flex flex-row justify-center items-center font-extrabold text-center text-gray-900 bg-gradient-to-r from-green-400 via-green-500 to-green-600 border 
            border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 
            dark:focus:border-primary-500"
                  required
                />
              </div>
            </div>
            
          </form>
          <li>
            <div className={`flex p-2 rounded border-green-600 ${ischecked ? 'bg-gradient-to-r from-green-500 via-green-400 to-green-600 border ' : 'bg-red-500'}`} onChange={FuncClick}>
              <div className="flex items-center h-auto w-8 justify-center" >
                <input
                  id="helper-checkbox-2"
                  aria-describedby="helper-checkbox-text-2"
                  type="checkbox"
                  checked={ischecked}
                  className="w-4 h-4  bg-gray-100 border-gray-300 rounded "
                />
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    checked
                  />

                  {/* <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Checked toggle</span> */}
                </label>
              </div>
              <div className="ms-2 text-sm flex flex-row justify-center items-center "  >
                <label
                  htmlFor="helper-checkbox-2"
                  className="font-medium text-gray-900 dark:text-gray-300 "
                >
                  <div className="--Enable-2fa FontAwesome font-medium flex flex-row justify-center items-center " >
                    {ShowSignUp ? '2F-AUTHENTICATION-ATCIVE': '2F-AUTHENTICATION-DISACTIVE'}
                  </div>
                  {/* <p id="helper-checkbox-text-2" className="text-xs font-normal text-gray-500 dark:text-gray-300">Some helpful instruction goes over here.</p> */}
                </label>
              </div>
            </div>
          </li>

          {/* <h2 className='-twof--part1'>2FA-AUTHENTICATION</h2> */}
        </div>
      </div>
      <div className="part2 flex flex-col  md:flex-row gap-4 w-full md:min-w-[50%] min-h-full overflow-hidden Information justify-center items-center ">
        <form className=" gap-4 mt-2 p-5 form--setting ms:h-[50vh] overflow-hidden">
          <h2 className="header--info overflow-hidden flex flex-row justify-center items-center left-5">
            Information
          </h2>
          <div className="grid gap-6 mb-6 mx:grid-cols-2">
            <div>
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm  text-blue-600 font-bolder dark:text-white"
              >
                First name
              </label>
              <input
                type="text"
                id="first_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Mohamed"
                required
              />
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block mb-2 text-sm   text-blue-600 font-bolder dark:text-white"
              >
                Last name
              </label>
              <input
                type="text"
                id="last_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Darify"
                required
              />
            </div>
            <div>
              <label
                htmlFor="company"
                className="block mb-2 text-sm text-blue-600 font-bolder dark:text-white"
              >
                Company
              </label>
              <input
                type="text"
                id="company"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
               dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="1337 Coding School"
                required
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm text-blue-600 font-bolder dark:text-white"
              >
                Phone number
              </label>

              <input
                type="tel"
                id="phone"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
               dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="+212"
                pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                required
              />
            </div>
            <div>
              <label
                htmlFor="website"
                className="block mb-2 text-sm text-blue-600 font-bolder dark:text-white"
              >
                Country
              </label>
              <input
                type="url"
                id="website"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Morocco"
                required
              />
            </div>
            <div>
              <label
                htmlFor="visitors"
                className="block mb-2 text-sm text-blue-600 font-bolder dark:text-white"
              >
                Birth Day
              </label>
              <input
                type="text"
                id="visitors"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="01-01-2000"
                required
              />
            </div>
            <div>
              <label
                htmlFor="visitors"
                className="block mb-2 text-sm text-blue-600 font-bolder dark:text-white"
              >
                Birth City
              </label>
              <input
                type="text"
                id="visitors"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Casablanca"
                required
              />
            </div>
            <div>
              <label
                htmlFor="visitors"
                className="block mb-2 text-sm text-blue-600  font-bolder dark:text-white"
              >
                Zip Code
              </label>
              <input
                type="number"
                id="visitors"
                className="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="20200"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm text-blue-600 font-bolder dark:text-white"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="UserName@student.1337.ma"
              required
            />
          </div>
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                value=""
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600
                 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                required
                
              />
            </div>
            <label
              htmlFor="remember"
              className="ms-2 text-sm text-blue-600 font-bolder dark:text-gray-300"
            >
              I agree with the{" "}
              <a
                href="#"
                className="text-blue-600 hover:underline dark:text-blue-500"
              >
                Terms and conditions
              </a>
              .
            </label>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bolder rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default SettingFunction;
