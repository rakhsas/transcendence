import React, { useState } from 'react';
import './list.css';
import Google from './assets/google.png';
import Github from './assets/github.jpeg';
import Intra from './assets/42.jpeg';
import backgroundImage2 from './assets/intra42.jpej.jpeg';
import bgm from './assets/Leonardo_Diffusion_XL_images_display_a_man_wears_a_jacket_and_0.jpg';

interface UserForm 
{
    onSignIn:  
    (
        username: string, 
        password: string
    ) 
        => void;
    onSignUp: 
    (
        email: string, 
        username: string,
        password: string
    ) 
        => void;
}

interface User 
{
  email: string;
  username: string;
}


function FunctionSignUpForm()
{
  function SignFormOfUser({ onSignIn, onSignUp }: UserForm){
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const handleSignIn = () => 
    {
      const username = 'john_doe';
      const password = 'password123';
      onSignIn(username, password);
    };
    const handleSignUp = () => {
      const email = 'john.doe@example.com';
      const username = 'new_user';
      const password = 'new_password123';
      onSignUp(email, username, password);
    };
  }
  const [ShowSignUp, SetShowSignUp]= useState<boolean>(false);
  const [ShowSignPassword1, SetShowPassword1]= useState<boolean>(false);
  const [ShowSignPassword2, SetShowPassword2]= useState<boolean>(false);
  const [ShowSignPassword3, SetShowPassword3]= useState<boolean>(false);

  const [email, setEmile] = useState<string>("");
  // const [username, setUsername] = useState<string>("");
  // const [password1, setPassword1] = useState<string>("");

  const FuncClick = () => {
    SetShowSignUp(!ShowSignUp);
  }
  const FuncClick1 = () => {
    SetShowPassword1(!ShowSignPassword1);
  }
  const FuncClick2 = () => {
    SetShowPassword2(!ShowSignPassword2);
  }
  const FuncClick3 = () => {
    SetShowPassword3(!ShowSignPassword3);
  }
  // const Mp = MyComponent;
  return (
    <section className={`new_container forms ${ShowSignUp ? "show-signup" : ""}`}  >
      <div className="container2">
        <div className="list1">
          {/* Login Form */}
          <div className="form login">
            <div className="form-content">
              <header >
                SignIn
              </header>
              {/* <MyComponent></MyComponent> */}
              <form action="#">
                <div className="field input-field">
                  <input type="email" placeholder="Email" className="input" onChange={(e) => {
                      setEmile(e.target.value)
                  }} />
                </div>
                <div className="field input-field">
                  <input type={ShowSignPassword1 ? 'text' : 'password'} placeholder="Password" className="password" />
                  <i onClick={FuncClick1} className={`eye-icon ${ShowSignPassword1 ? 'bx-show' : 'bx-hide'}`}></i>
                </div>
                <div className="form-link">
                  <a href="#" className="forgot-pass">
                    Forgot password?
                  </a>
                </div>
                <div className="field button-field">
                  <button className='Sp' onClick={() => {
                    // validate data
                    console.log(email);
                  }} >SignIn</button>
                </div>
              </form>
              <div className="form-link">
                <span>
                  <p>Don't have an account? </p> <a href="#" onClick={FuncClick} className="link signup-link">Signup</a>
                </span>
              </div>
            </div>
            <div className="line"></div>
            <div className="media-options">
              <a href="#" className="field intra" style={{backgroundImage: `url(${backgroundImage2})`}} >
                <img src={Intra} alt="" className="google-img" />
                <span>Login with Intra42</span>
              </a>
            </div>
            <div className="media-options">
              <a href="#" className="field facebook">
                <img src={Github} alt="" className="google-img" />
                <span>Login with Github</span>
              </a>
            </div>
            <div className="media-options">
              <a href="#" className="field google">
                <img src={Google} alt="" className="google-img" />
                <span>Login with Google</span>
              </a>
            </div>
          </div>
          {/* Signup Form */}
          <div className="form signup">
            <div className="form-content">
              <header  >SignUp</header>
              <form action="#">
                <div className="field input-field">
                  <input type="email" placeholder="Email" className="input" />
                </div>
                <div className="field input-field">
                  <input type="text" placeholder="User Name" className="input" />
                </div>
                <div className="field input-field">
                    <input type={ShowSignPassword2 ? 'text' : 'password'} placeholder="Password" className="password" />
                    <i onClick={FuncClick2} className={`eye-icon ${ShowSignPassword2 ? 'bx-show' : 'bx-hide'}`}></i>
                </div>
                <div className="field input-field">
                  <input type={ShowSignPassword3 ? 'text' : 'password'} placeholder="Confirm Password" className="password" />
                  <i onClick={FuncClick3} className={`eye-icon ${ShowSignPassword3 ? 'bx-show' : 'bx-hide'}`}></i>
                </div>
                <div className="field button-field">
                  <button className="Sp">Sign Up</button>
                </div>
              </form>
              <div className="form-link">
                <span>
                 Already have an account? <a href="#" onClick={FuncClick} className="link login-link">Login</a>
                </span>
              </div>
            </div>
            <div className="line2"></div>
            <div className="media-options">
              <a href="#" className="field intra" style={{backgroundImage: `url(${backgroundImage2})`}} >
                <img src={Intra}  alt="" className="google-img" />
                <span>Login with Intra42</span>
              </a>
            </div>
            <div className="media-options">
              <a href="#" className="field facebook">
                <img src={Github}  alt="" className="google-img" />
                <span>Login with Github</span>
              </a>
            </div>
            <div className="media-options">
              <a href="#" className="field google">
                <img src={Google} alt="" className="google-img" />
                <span>Login with Google</span>
              </a>
            </div>
          </div>
        </div>
        {/* Placeholder for form2 content */}
        <div className="list2">
          <div  style={{backgroundImage: `url(${bgm})`, width: `435px`}} className="form2">{/* Add your content for form2 here */}</div>
        </div>
      </div>
    </section>
  );
}

export default FunctionSignUpForm;
