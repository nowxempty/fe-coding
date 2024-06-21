import React, { useState, useEffect } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { logout } from './Header_func';

export default function Header({access_Token,setAccessToken,image,name}) {
  const navigate = useNavigate();
  const accessToken = access_Token;
  const [user_name, setUser_name] = useState('');
  const [user_Lv, setUser_Lv] = useState('');
  const [profileImage,setProfileImage] = useState('');

  const defaultImage = '/logo512.png';
  const imageUrl = profileImage && profileImage !== 'null' ? profileImage : defaultImage;

  useEffect(() => {
    if (!access_Token) {
        navigate('/Login');
    }
    const url = 'https://salgoo9.site/api/myInfo'
        try {
            const response =  fetch( url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'access': access_Token
            }
            }).then(async response => {
                const responseData = await response.json();
                // 로컬 스토리지에 결과 저장
                if (responseData.status && responseData.status.code === 200) {
                    const userInfom = responseData.results[0]
                    setUser_name(userInfom.userName);
                    setUser_Lv(userInfom.level);
                    setProfileImage(userInfom.profileImage);
                } else {
                    console.error('Invalid response status:', responseData.status);
                }
                    
                });
        } catch (error) {
            console.error('오류 발생:', error);
        }
    }, []);


  const nav_Logout = () =>{
    const logout_result = logout(navigate,setAccessToken);
    console.log(logout_result);
    if(logout_result){
      navigate('/Login');
    }
  }
  const Link_MyPage = () => {
    navigate('/MyPage');
  }
  const Login = () => {
    navigate('/Login');
  }

  const Main = () => {
    navigate('/');
  }

  return (
    <nav className='nav_body'>
      <div className="Header">
        <div className="WebIde" onClick={() => Main()} >WEB IDE</div>
        {accessToken ? (
          <div className="Header_user_box" onClick={() => Link_MyPage()}>
            <img className="Header_user_box_Image" src={image} alt="Profile" />
            <div className="Header_user_box_Text">{name}</div>
            <div className="Level1">Level {user_Lv}</div>
            <div className="Logout" onClick={() => nav_Logout()}>로그아웃</div>
          </div>
        ) : (
          <div className="Header_Login_box">
            <div className="Header_Login" onClick={() => Login()}>로그인</div>
          </div>
        )}
        
      </div>
    </nav>

  )
}
