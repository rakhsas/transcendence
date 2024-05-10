import "./settings.css";
import React, { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
import DataContext from "../../../services/data.context";
import LoadingComponent from "../../shared/loading/loading";
import { TwoFaService } from "../../../services/twoFa.service";
import { SettingService } from "../../../services/setting.service";
import UserService from "../../../services/user.service";
import TwoFAActivateComponent from "../../modal/2fa.activate.modal";
import { Socket } from "socket.io-client";


function SettingFunction(): JSX.Element {
	const APIURL = import.meta.env.VITE_API_AUTH_KEY;
	const twoFaService = new TwoFaService();
	const userData = useContext(DataContext);
	const [ischecked, setIsChecked] = useState<boolean>(userData[0].isTwoFactorAuthenticationEnabled);
	const [input, setInput] = useState("");
	const [url, setUrl] = useState<string>("");
	const [firstName, setFirstName] = useState<string>('');
	const [SecondName, setSecondName] = useState<string>('');
	const [socketChat, setSocketChat] = useState<Socket>();
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: ''
	});
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const fileInput = event.target;
		const chosenFile = fileInput.files && fileInput.files[0];
		if (chosenFile) {
			const fileName = chosenFile.name.toLowerCase();
			if (fileName.endsWith('.jpg')) {
				const reader = new FileReader();
				reader.onload = () => {
					const imgElement = document.querySelector("#list") as HTMLImageElement;
					changePicture(chosenFile);
					if (imgElement) {
						imgElement.src = reader.result as string;
					}
				};
				reader.readAsDataURL(chosenFile);
			} else {
				alert('Please select a valid file format (JPG)');
			}
		}
	};
	const enable2FA = async () => {
		await fetch(APIURL + `user/2fa/enable2FA/${userData[0].id}`, {
			method: 'PUT',
			credentials: 'same-origin',
		})
		setIsChecked(false);
	}
	const changePicture = async (file: File) => {
		socketChat?.emit('changePicture', {
			userId: userData[0].id,
			picture: file
		});
		// const result = await userService.updateUserPicture(userData[0].id, file);
		// userData[0].picture = result.picture;
	}
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
		setSocketChat(userData[1]);
	}, [userData]);
	if (!userData)
		return <LoadingComponent />;
	const handleSubmitForm = async (event: any) => {
		event.preventDefault();
		socketChat?.emit('updateUser', {
			userID: userData[0].id,
			firstName: formData.firstName,
			lastName: formData.lastName,
			email: formData.email
		});
		setSecondName('');
		setFirstName('');
		setUserEmail('');
	}
	const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		setFormData(prevState => ({
			...prevState,
			firstName: value
		}));
		const isValidFirstName = /^[A-Za-z\s]+$/.test(value);
		if (isValidFirstName || value === '') {
			setFirstName(value);
		}
	};
	const handleSecondNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		setFormData(prevState => ({
			...prevState,
			lastName: value
		}));
		const isValidSecond = /^[A-Za-z\s]+$/.test(value);
		if (isValidSecond || value === '') {
			setSecondName(value);
		}
	};
	const isValidEmail = (email: string): boolean => {
		const regex = /^[a-zA-Z._%+-]+@student\.1337\.ma$/;
		return regex.test(email);
	}
	const [userEmail, setUserEmail] = React.useState('');
	const [isEmailValid, setIsEmailValid] = React.useState(false);

	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserEmail(event.target.value);
		setFormData(prevState => ({
			...prevState,
			email: event.target.value
		}));
		if (isEmailValid)
			setIsEmailValid(isValidEmail(event.target.value));
	}
	const disableTwoFA = useCallback(async () => {
        await fetch(APIURL + `user/2fa/disable2FA/${userData[0].id}`, {
            method: 'PUT',
            credentials: 'same-origin',
        });
		userData[0].isTwoFactorAuthenticationEnabled = false;
        setIsChecked(false);
    }, [userData]);

    useEffect(() => {
        if (!ischecked && userData[0].isTwoFactorAuthenticationEnabled) {
            disableTwoFA();
        }
    }, [ischecked, userData, disableTwoFA]);
	return (
		<div className="flex flex-col new:flex-row w-full h-[90vh] overflow-hidden justify-between gap-4 bg-inherit Setting p-8" >
			<div className="part1 rounded-3xl w-full md:min-w-[35%] min-h-full Usredit dark:bg-zinc-900 bg-main-light-PRIMARY09 px-8 py-4 overflow-hidden">
				<div className="p-4 profile-image overflow-hidden flex flex-col w-full justify-center items-center gap-12 relative">
					<img src={APIURL + userData[0]?.picture || ''} alt={userData[0].username} className="object-cover w-48 h-48 rounded-3xl" id="list" />
					<label htmlFor="file" id="uploadbtn" className="gap-4 change-picture rounded-3xl bg-zinc-800">
						<svg className="hoverIcon__2025e" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="white" d="m13.96 5.46 4.58 4.58a1 1 0 0 0 1.42 0l1.38-1.38a2 2 0 0 0 0-2.82l-3.18-3.18a2 2 0 0 0-2.82 0l-1.38 1.38a1 1 0 0 0 0 1.42ZM2.11 20.16l.73-4.22a3 3 0 0 1 .83-1.61l7.87-7.87a1 1 0 0 1 1.42 0l4.58 4.58a1 1 0 0 1 0 1.42l-7.87 7.87a3 3 0 0 1-1.6.83l-4.23.73a1.5 1.5 0 0 1-1.73-1.73Z"></path></svg>
					</label>
				</div>
				<input type="file" id="file" accept=".jpg" onChange={handleFileChange}  />
				<div className="flex flex-col justify-center items-center gap-6 py-2">
					<li className="list-none">
						<div className={`flex p-2 rounded border-green-600 py-2.5 ${ischecked ? 'bg-gradient-to-r from-green-500 via-green-400 to-green-600 border ' : 'bg-red-500'}`}>
							<div className="flex items-center h-full w-8 justify-center relative py-2" >
								<input
									id="helper-checkbox-2"
									aria-describedby="helper-checkbox-text-2 "
									type="checkbox"
									onChange={() => setIsChecked(!ischecked)}
									checked={ischecked}
									className="w-4 h-4  bg-gray-100 border-gray-300 rounded border-y-2"
								/>
							</div>
							<div className=" ms-2 text-sm flex flex-row justify-center items-center " >
								<div className="--Enable-2fa font-medium flex flex-row justify-center items-center " >
									{ischecked ? 'DISABLE 2FA AUTHENTICATION' : 'ENABLE 2FA AUTHENTICATION'}
								</div>
							</div>
						</div>
					</li>
					{
						ischecked && !userData[0].isTwoFactorAuthenticationEnabled && <TwoFAActivateComponent userData={userData} />
					}
				</div>
				<form onSubmit={handleSubmitForm} className="mt-2 m-auto p-5 form--setting flex flex-col border-2 border-white overflow-visible">
					<h2 className="header--info overflow-hidden flex flex-row justify-center items-center left-5">
						Information
					</h2>
					<div className="grid gap-6 mb-6">
						<div>
							<label htmlFor="first_name" className="block mb-2 text-sm  text-main-light-EGGSHELL font-bolder dark:text-main-light-FERN">First name </label>
							<input type="text" id="first_name" value={firstName} onChange={handleFirstNameChange}
								maxLength={15}
								className=" bg-main-light-WHITE border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
			  dark:bg-zinc-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="Ayyoub" autoComplete="OFF" required />
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
								placeholder="GaouGaou"
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
					</div>
					<button
						type="submit"
						className="flex  flex-row justify-center items-center text-white dark:bg-main-light-PRIMARY09 bg-main-dark-SPRUCE focus:ring-4 focus:outline-none focus:ring-blue-300 font-bolder rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
					>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
}

export default SettingFunction;
