import "./HomePage.css";
import io from 'socket.io-client';
import { useState, useEffect } from "react";

// import Logo from "./../assets/Frame 1.png";
// import Google from "./../assets/icons8-google.svg";

const socket = io("http://localhost:3000/chat", {
	query: {
		recieverName: 'medo',
	  },
});


interface Message {
	from: number;
	to: number;
	content: string;
  }
  
  const ChatComponent = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState({ from: 0, to: 1, content: '' });
  
	useEffect(() => {
	  // Event handler for incoming messages
	  socket.on('message', (message: Message) => {
		setMessages((prevMessages) => [...prevMessages, message]);
	  });
  
	  // Clean up the socket connection when the component unmounts
	  return () => {
		socket.disconnect();
	  };
	}, []);
  
	const sendMessage = () => {
	  if (newMessage.content.trim() !== '') {
		socket.emit('message', newMessage);
		setNewMessage({ ...newMessage, content: '' }); // Clear the content after sending
	  }
	};
  
	return (
	  <div>
		<div>
		  <h1>Real-time Chat</h1>
		  <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', marginBottom: '10px' }}>
			{messages.map((message, index) => (
			  <div key={index}>
				<p>From: {message.from}</p>
				<p>To: {message.to}</p>
				<p>Content: {message.content}</p>
			  </div>
			))}
		  </div>
		</div>
		<div>
		  <input
			type="text"
			value={newMessage.content}
			onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
			placeholder="Type your message..."
		  />
		  <button onClick={sendMessage}>Send</button>
		</div>
	  </div>
	);
  };
  
  export default ChatComponent;

// function HomePageComponent(): JSX.Element {
// 	const APIURL = import.meta.env.VITE_API_AUTH_KEY;
// 	// async function loginWithIntra() {
// 	// 	window.location.href = APIURL + "auth/42/login";
// 	// }
// 	console.log(APIURL + "auth/42/login");
// 	return (
// 		<>
// 			<div className="dashboardContainer bg-auto sm:bg-center md:bg-center h-full">

// 				{/* <div className="logo-container">
// 					<img src={Logo} alt="Game Logo" className="logo mt-4 lg:ml-32 ml-5" />
// 				</div>
// 				<div
// 					className="LetSKickNow lg:w-auto md:h-auto lg:h-56 lg:ml-44 ml-16 lg:mt-32 mt-8 text-orange-300 lg:text-7xl text-6xl font-bold  font-['IBM Plex Sans Thai Looped'] tracking-widest overflow-hidden">
// 					LET’S
// 					<br />
// 					KICK
// 					<br />
// 					NOW
// 				</div>
// 				<div className="ItSEasyAndTakesLessThan20Second lg:ml-44 ml-16 mt-4 text-orange-300 lg:text-2xl text-1xl font-bold font-['IBM Plex Sans Thai Looped'] tracking-widest">it’s easy and takes less than 20 second</div>
// 				<div className="buttons flex lg:flex-row flex-col lg:ml-40 ml-16 mr-16 mt-12">
// 					<div className="Button lg:ml-4 md:ml-0 mt-4 lg:w-48 lg:h-12 w-full md:w-44 px-2 py-2 bg-neutral-800 rounded-lg shadow border-2 border-red-600 justify-center items-center gap-2 inline-flex">
// 						<div className="ContinueWith text-white text-base font-semibold font-['Inter'] leading-snug">Continue with</div>
// 						<div className="Plus w-6 h-6 p-1 justify-center items-center flex">
// 							<div className="Group w-4 h-4 relative">
// 								<img src={Google} alt="" />
// 							</div>
// 						</div>
// 					</div>
// 					<div className="Button lg:ml-4 md:ml-0 mt-4 lg:w-48 lg:h-12 w-full md:w-44 px-2 py-2 bg-neutral-800 rounded-lg shadow border-2 border-red-600 justify-center items-center gap-2 inline-flex hover:cursor-pointer" onClick={loginWithIntra}>
// 						<div className="ContinueWith text-white text-base font-semibold font-['Inter'] leading-snug">Continue with</div>
// 						<div className="Plus w-6 h-6 p-1 justify-center items-center flex">
// 							<div className="Group w-4 h-4 relative">
// 								<img src="https://profile.intra.42.fr/assets/42_logo_black-684989d43d629b3c0ff6fd7e1157ee04db9bb7a73fba8ec4e01543d650a1c607.png" alt="" />
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 				<div className="info mt-4 lg:ml-40 ml-16">
// 					<span className="text-gray-300 text-sm lg:ml-4 no-underline">
// 						This website requires a 42intra account for sign-up and sign-in.
// 					</span>
// 				</div> */}
// 			</div>
// 		</>
// 	);
// }

// export default HomePageComponent;
