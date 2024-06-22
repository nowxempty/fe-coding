import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './inform.css';
import { handleDeleteAccount, Change_user_Inform, uploadImage } from './inform_func.js';
import Header from '../../../components/Header/Header.js';
import Modal from './Profile_Modal.js';
import { VscAccount } from "react-icons/vsc";
import { refreshAccessToken } from '../../../refreshAccessToken.js';

function InformPage({ userInfoms, setUserInfo, access_Token, setAccessToken}) {
  const [Nickname, setNickname] = useState('');
  const [Password, setPassword] = useState('');
  const [user_level, setUser_Level] = useState('');
  const [Passwordcheck, setPasswordcheck] = useState('');
  const [DeleteAccount, setDeleteAccount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState('/logo512.png'); // 초기값을 기본 이미지로 설정
  const [profileName, setProfileName] = useState(''); // 초기값을 기본 이미지로 설정


  useEffect(() => {
    if (!access_Token) {
      refreshAccessToken(setAccessToken);
    }

    const fetchUserInfo = async () => {
      const url = 'https://salgoo9.site/api/myInfo';
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'access': `${access_Token}`
          }
        });
        const responseData = await response.json();
        if (responseData.status && responseData.status.code === 200) {
          const userInfom = responseData.results[0];
          setUserInfo(userInfom);
          setProfileImage(userInfom.profileImage);
          setProfileName(userInfom.userName);
          setUser_Level(userInfom.level);
        } else {
          console.error('Invalid response status:', responseData.status);
        }
    };
    fetchUserInfo();
  }, [access_Token, setAccessToken,setUserInfo]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleImageSelect = async (image) => {
    try {
      await uploadImage(image, access_Token);
      const imageUrl = URL.createObjectURL(image);
      setProfileImage(imageUrl);
      setUserInfo((prevState) => ({
        ...prevState,
        profileImage: imageUrl,
      }));
      closeModal();
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };

  return (
    <div className='Inform_body'>
      <Header access_Token={access_Token} setAccessToken={setAccessToken}/>
      <div className='Inform_container'>
        <div className="Inform_Page">
          <div className="Inform_profile-section">
            <img className="Inform_profile-image" src={profileImage ? profileImage : <VscAccount/>} alt='프로필 이미지' />
            <div className="Inform_profile-button-container">
              <button className="Inform_Pic_Btn" onClick={openModal}>프로필 사진 변경</button>
            </div>
          </div>
          <div className="Inform_other-section">
            <div className="Inform_info-container">
              <div className="Inform_info-background">
                <div className="Inform_nickname-section">
                  <div className="Inform_label">닉네임</div>
                  <div className="Inform_input-container">
                    <input
                      type="text"
                      className="Inform_input-background"
                      placeholder="입력해주세요"
                      value={Nickname}
                      onChange={(e) => setNickname(e.target.value)}
                    />
                  </div>
                </div>
                <div className="Inform_password-section">
                  <div className="Inform_label">비밀번호</div>
                  <div className="Inform_input-container">
                    <input
                      type="text"
                      className="Inform_input-background"
                      placeholder="입력해주세요"
                      value={Password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="Inform_confirm-password-section">
                  <div className="Inform_label">비밀번호 확인</div>
                  <div className="Inform_input-container">
                    <input
                      type="password"
                      className="Inform_input-background"
                      placeholder="입력해주세요"
                      value={Passwordcheck}
                      onChange={(e) => setPasswordcheck(e.target.value)}
                    />
                  </div>
                </div>
                <div className="Inform_save-button-container">
                <button className="Inform_Rectangle12" onClick={() => {Change_user_Inform(Nickname, Password, Passwordcheck, access_Token, setUserInfo, setProfileName); setNickname('');}}>저장</button>
                </div>
                <div className="Inform_withdraw-instruction">회원 탈퇴 하시려면 “회원 탈퇴”를 입력해주세요.</div>
                <div className="Inform_confirm-password-section">
                  <div className="Inform_input-container">
                    <input
                      type="text"
                      className="Inform_input-background"
                      placeholder="입력해주세요"
                      value={DeleteAccount}
                      onChange={(e) => setDeleteAccount(e.target.value)}
                    />
                    <div className="Inform_icon-container">
                      <button onClick={() => handleDeleteAccount(DeleteAccount)} className="Inform_Rectangle12">탈퇴</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSelect={handleImageSelect}
      />
    </div>
  );
}

export default InformPage;
