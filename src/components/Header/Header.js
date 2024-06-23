import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { logout } from './Header_func';
import { SlArrowLeft , SlArrowRight } from "react-icons/sl";
import Logo from "../Icon/Logo.png";


export default function Header({ access_Token, setAccessToken}) {
  const navigate = useNavigate();
  const accessToken = access_Token;
  
  const nav_Logout = () =>{
    logout(navigate,setAccessToken);
  }

  const Login = () => {
    navigate('/Login');
  }

  const Main = () => {
    navigate('/ChallengeList');
  }

  const handleBack = () => {
    navigate(-1);
  }
  const handleFront = () => {
    navigate(1);
  }

  return (
    <nav className='nav_body'>
      <div className="Header">
        <div className="WebIde" onClick={() => Main()} >
          <img src={Logo} alt="logo" />
        </div>
        <div className='Header_rightsection'>
        {accessToken ? (
          <div className="Logout" onClick={() => nav_Logout()}>로그아웃</div>
        ) : (
          <div className="Header_Login_box">
            <div className="Header_Login" onClick={() => Login()}>로그인</div>
          </div>
          
        )}
        <div className='navi_btn'>
          <button className="back-button" onClick={handleBack}>
            <SlArrowLeft className="icon" />
          </button>
          <button className="front-button" onClick={handleFront}>
            <SlArrowRight className="icon" />
          </button>
        </div>
 
        </div>
       </div>
    </nav>

  )
}