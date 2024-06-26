import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginClick } from './Login_func.js';
import Logo from "../../components/Icon/Logo.png";
import './Login.css';

function LoginPage({ setAccessToken, setUserInfo, setImage, setName }) {
  const navigate = useNavigate();
  const [Id, setId] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setId('');
    setPassword('');
    setAccessToken('');
  }, [setId, setPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    LoginClick(Id, password, navigate, setAccessToken, setUserInfo, setImage, setName);
  };

  return (
    <div className="Login_page">
      <div className='Login_leftSction'>
        <img src={Logo} alt="logo" />
      </div>
      <div className="Login_Body">
        <div className="Login_WebIde">WEB IDE</div>
        <div className="Login_InputBox">
          <form className="Login_container" onSubmit={handleSubmit}>  
            <div className="Login_Id">
              <input 
                type="text" 
                placeholder="Id" 
                value={Id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
            <div className="Login_Pw">
              <input 
                type="password" 
                placeholder="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="Login_Btn">
              <button
                className='Login_Button' 
                type="submit"
              >
                로그인
              </button>
            </div>
          </form>
          <div className="Login_CreateAccount">
            <span>계정이 없으신가요?</span>
            <Link className="Login_Link" to="/Join">회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
