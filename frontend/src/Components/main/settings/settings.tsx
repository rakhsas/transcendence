import "./settings.css";
import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import DataContext from "../../../services/data.context";
import LoadingComponent from "../../shared/loading/loading";
import { TwoFA, TwoFaService } from "../../../services/twoFa.service";
interface AlertProps {
	message: string;
}

const Alert: React.FC<AlertProps> = ({ message }) => {
	return (
		<div className="alert success">
			<span className="closebtn">&times;</span>
			<strong>Success!</strong> {message}
		</div>
	);
};

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
	const twoFaService = new TwoFaService();
	useEffect(() => {
		if (!userData) return;
		const fetchData = async () => {
			try {
				const Qrcode = await twoFaService.generateQrCode(userData[0].id, userData[0].email);
				setUrl(Qrcode);
			} catch (error) {
				console.error("Error fetching user ", error);
			}
		};
		fetchData();
		setIsChecked(userData[0].isTwoFactorAuthenticationEnabled);
	}, [userData]);
	if (!userData) return <LoadingComponent />;
	let TfCode: string = "";
	// function focusNextInput(
	// 	el: HTMLInputElement,
	// 	prevId: string | null,
	// 	nextId: string | null
	// ) {
	// 	if (el.value.length === 0) {
	// 		if (prevId) {
	// 			const prevElement = document.getElementById(
	// 				prevId
	// 			) as HTMLInputElement | null;
	// 			if (prevElement) {
	// 				prevElement.focus();
	// 			}
	// 		}
	// 	} else {
	// 		if (nextId) {
	// 			const nextElement = document.getElementById(
	// 				nextId
	// 			) as HTMLInputElement | null;
	// 			if (nextElement) {
	// 				nextElement.focus();
	// 			}
	// 		}
	// 	}
	// 	TfCode = el.value;
	// }
	// document.querySelectorAll("[data-focus-input-init]").forEach((element) => {
	// 	element.addEventListener("keyup", function (this: HTMLElement) {
	// 		const prevId = this.getAttribute("data-focus-input-prev");
	// 		const nextId = this.getAttribute("data-focus-input-next");
	// 		if (this instanceof HTMLInputElement) {
	// 			focusNextInput(this, prevId, nextId);
	// 			// console.log(prevId, ' prve ', nextId);
	// 		}
	// 	});
	// 	// console.log(this instanceof HTMLInputElement);
	// });

	const onchange = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (input.length != 6)
			return;
		await fetchQRcode();
	}
	const fetchQRcode = async () => {
		try {
			const ValidQRcode = await fetch(APIURL + `2fa/authenticate/${input}/${userData[0].id}`, {
				method: 'POST',
				credentials: 'same-origin',
			})
			if (ValidQRcode.status == 200) {
				userData[0].isTwoFactorAuthenticationEnabled = true;
			}
			else {
				userData[0].isTwoFactorAuthenticationEnabled = false;
			}
		}
		catch (error) {
			console.log('Invalid qrcode \n');
		}
	};
	useEffect(() => { }, [ischecked]);
	const [firstName, setFirstName] = useState<string>('');
	const [SecondName, setSecondName] = useState<string>('');

	const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		// Regular expression for validating first name (only alphabets, no special characters)
		const isValidFirstName = /^[A-Za-z\s]+$/.test(value);
		if (isValidFirstName || value === '') {
			setFirstName(value);
		}
	};
	const handleSecondNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		// Regular expression for validating first name (only alphabets, no special characters)
		const isValidSecond = /^[A-Za-z\s]+$/.test(value);
		if (isValidSecond || value === '') {
			setSecondName(value);
		}
	};
	const [selectedCountry, setSelectedCountry] = useState<string>('');

	const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedCountry(event.target.value);
	};
	const isValidBirthday = (input: string): boolean => {
		const regex = /^\d{4}-\d{2}-\d{2}$/;
		return regex.test(input);
	}
	const [userInput, setUserInput] = React.useState('');
	const [isValid, setIsValid] = React.useState(false);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserInput(event.target.value);
		setIsValid(isValidBirthday(event.target.value));
	}

	const [selectedCity, setSelectedCity] = useState<string>('');

	const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedCity(event.target.value);
	};
	const isValidEmail = (email: string): boolean => {
		const regex = /^[a-zA-Z._%+-]+@student\.1337\.ma$/;
		return regex.test(email);
	}
	const [userEmail, setUserEmail] = React.useState('');
	const [isEmailValid, setIsEmailValid] = React.useState(false);

	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserEmail(event.target.value);
		setIsEmailValid(isValidEmail(event.target.value));
	}
	return (
		<div className="flex flex-col new:flex-row w-full h-[90vh] justify-between gap-4 bg-inherit overflow-visible Setting p-8" >
			<div className="part1 rounded-3xl gap-4 w-full md:min-w-[35%]  min-h-full  Usredit dark:bg-zinc-900  bg-main-light-WHITE">
				<div className="p-4 profile-image overflow-hidden flex flex-col w-full justify-center items-center gap-12 ">
					<img src={userData[0]?.picture || ''} alt={userData[0].username} className="object-cover w-48 h-48 rounded-3xl"/>
					<label htmlFor="file" id="uploadbtn" className="gap-4 change-picture">
						{/* <p onChange={handleFileChange} className="parPhoto dark:text-white text-black bolder font-extrabold font-900">
							TAKE A PHOTO
						</p> */}
						{/* <svg className="w-6 h-6  dark:text-black text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
							<path fillRule="evenodd" d="M7.5 4.586A2 2 0 0 1 8.914 4h6.172a2 2 0 0 1 1.414.586L17.914 6H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1.086L7.5 4.586ZM10 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm2-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" clipRule="evenodd" />
						</svg> */}

						<svg className="w-12 h-12 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
							<path fill-rule="evenodd" d="M12 3a1 1 0 0 1 .78.375l4 5a1 1 0 1 1-1.56 1.25L13 6.85V14a1 1 0 1 1-2 0V6.85L8.78 9.626a1 1 0 1 1-1.56-1.25l4-5A1 1 0 0 1 12 3ZM9 14v-1H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4v1a3 3 0 1 1-6 0Zm8 2a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clip-rule="evenodd"/>
						</svg>


					</label>
				</div>
				<input type="file" id="file" onChange={handleFileChange} />
				<div className="flex flex-col justify-center items-center gap-6 py-2">
					<h2 className="font-poppins font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:text-white text-black bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80">
						2FA-AUTHENTICATION
					</h2>
					<img className={`${ischecked ? 'visible' : 'invisible'} Qrcode bg-gradient-to-r from-green-400 via-green-500 to-green-600`} src={url} alt="" />
					<form className="max-w-sm mx-auto flex flex-col gap-2 p-4 space-y-2" onSubmit={onchange}>
						<p
							id="helper-text-explanation"
							className={`dark:text-white text-black bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br 
			   shadow-lg shadow-green-500/50 dark:shadow-lg font-bold
			 dark:shadow-green-800/80 rounded-md text-sm text-center px-5 py-2.5 ${ischecked ? 'block' : 'hidden'}  `}
						>
							ENTRY QRCODE SCANNED <br />
						</p>
						<div className={`flex space-x-2 flex-row justify-center items-center ${ischecked ? 'block' : 'hidden'}`}>
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
									className="w-full h-9 py-3 text-sm flex flex-row justify-center items-center font-extrabold text-center text-gray-900 bg-gradient-to-r from-green-400 via-green-500 to-green-600 border 
			border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 
			dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 
			dark:focus:border-primary-500"
									required
								/>
							</div>
						</div>
					</form>
					<li className="list-none">
						<div className={`flex p-2 rounded border-green-600 py-2.5 ${ischecked ? 'bg-gradient-to-r from-green-500 via-green-400 to-green-600 border ' : 'bg-red-500'}`} onChange={FuncClick}>
							<div className="flex items-center h-full w-8 justify-center relative py-2" >
								<input
									id="helper-checkbox-2"
									aria-describedby="helper-checkbox-text-2 "
									type="checkbox"
									checked={ischecked}
									className="w-4 h-4  bg-gray-100 border-gray-300 rounded border-y-2"
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
							<div className="w-[250px] ms-2 text-sm flex flex-row justify-center items-center "  >
								<label
									htmlFor="helper-checkbox-2"
									className="font-medium text-gray-900 dark:text-gray-300 "
								>
									<div className="--Enable-2fa FontAwesome font-medium flex flex-row justify-center items-center " >
										{ShowSignUp ? '2F-AUTHENTICATION-ATCIVE' : '2F-AUTHENTICATION-DISACTIVE'}
									</div>
									{/* <p id="helper-checkbox-text-2" className="text-xs font-normal text-gray-500 dark:text-gray-300">Some helpful instruction goes over here.</p> */}
								</label>
							</div>
						</div>
					</li>

					{/* <h2 className='-twof--part1'>2FA-AUTHENTICATION</h2> */}
				</div>
			</div>
			<div className="part2 flex rounded-3xl flex-col  md:flex-row gap-4 w-full md:min-w-[50%] min-h-full Information  justify-center items-center dark:bg-zinc-900  bg-main-light-WHITE ">
				<form className=" gap-4 mt-2 p-5 form--setting ms:h-[50vh] flex flex-col ">
					<h2 className="header--info overflow-hidden flex flex-row justify-center items-center left-5 ">
						Information
					</h2>
					<div className="grid gap-6 mb-6 mx:grid-cols-2">
						<div>
							<label
								htmlFor="first_name"
								className="block mb-2 text-sm  text-main-light-EGGSHELL font-bolder dark:text-main-light-FERN"
							>
								First name
							</label>
							<input
								type="text"
								id="first_name"
								value={firstName}
								onChange={handleFirstNameChange}
								maxLength={15}
								className=" bg-main-light-WHITE border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
			  dark:bg-zinc-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="Mohamed"
								autoComplete="OFF"
								required
							/>
							{!/^$|^[A-Za-z\s]+$/.test(firstName) && (
								<p style={{ color: 'red' }}>Please enter a valid first name (only alphabets).</p>
							)}
						</div>
						<div>
							<label htmlFor="last_name" className="block mb-2 text-sm   text-main-light-EGGSHELL font-bolder dark:text-main-light-FERN" >
								Last name
							</label>
							<input type="text"
								id="last_name" value={SecondName} onChange={handleSecondNameChange} maxLength={10}
								className=" bg-main-light-WHITE border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
			  dark:bg-zinc-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="Darify"
								required
							/>
							{!/^$|^[A-Za-z\s]+$/.test(SecondName) && (
								<p style={{ color: 'red' }}>Please enter a valid first name (only alphabets).</p>
							)}
						</div>

					</div>
					<div className="mb-6">
						<label
							htmlFor="email"
							className="block mb-2 text-sm text-main-light-EGGSHELL font-bolder dark:text-main-light-FERN"
						>
							Email address
						</label>
						<input
							type="email"
							id="email"
							value={userEmail}
							onChange={handleEmailChange}
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
			dark:bg-zinc-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="UserName@student.1337.ma"
							required
						/>
						{/* {isEmailValid ? `${handleEmailChange == handleEmailChange}`: <p>Invalid email format!</p>} */}
					</div>
					{/* <div className="flex items-start mb-6">
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
			  
			</label>
		  </div> */}
					<button
						type="submit"
						className="flex  flex-row justify-center items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bolder rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
}

export default SettingFunction;
