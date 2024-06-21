import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {JoinClick} from './Join_func.js';
import './Join.css';
function JoinPage() {
    const navigate = useNavigate();
    const [user_name, setUser_name] = useState('');
    const [Id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [password_check, setPassword_check] = useState('');
    
    //페이지를 이동하면 input 요소에 저장된 값을 초기화
    useEffect(() => {
        setId('');
        setPassword('');
        setPassword_check('');
        setUser_name('');
      }, [setId,setPassword,setPassword_check,setUser_name]);
     
    //================================================================
    
    return (
        <div className="Join_page">
          <div className="Join_Body">
            <div className="Join_WebIde">WEB IDE</div>
            <div className="Join_InputBox">
              <form className="Join_container">
                <div className="Join_Name">
                  <input
                    type="text"
                    placeholder="이름"
                    value={user_name}
                    onChange={(e) => setUser_name(e.target.value)}
                    className="Join_inputField"
                  />
                </div>
                <div className="Join_Id">
                  <input
                    type="id"
                    placeholder="ID는 영문,숫자만 가능"
                    value={Id}
                    onChange={(e) => setId(e.target.value)}
                    className="Join_inputField"
                  />
                </div>
                <div className="Join_Password">
                  <input
                    type="password"
                    placeholder="비밀번호는 영문,숫자 포함 8자리 이상"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="Join_inputField"
                  />
                </div>
                <div className="Join_PasswordCheck">
                  <input
                    type="password"
                    placeholder="비밀번호 확인"
                    value={password_check}
                    onChange={(e) => setPassword_check(e.target.value)}
                    className="Join_inputField"
                  />
                </div>
                
                <div className="Join_Terms">
                  <button
                    className='Join_submitButton'
                    type="button"
                    onClick={() => JoinClick(Id, password, password_check,user_name,navigate)}
                  >
                    회원 가입
                  </button>
                </div>
                <div className="Join_accountLink">
                  <span>계정이 있으신가요?</span>
                  <Link to="/Login" className="Join_Link">로그인</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
      
}

export default JoinPage;

