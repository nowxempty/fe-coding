import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header.js';
import { Get_User_code, Get_Problem } from './Mypage_func.js';
import Modal from './Code_Modal.js';
import { refreshAccessToken } from '../../refreshAccessToken.js';
import UserProfileIcon from "../../components/Icon/UserProfileIcon";
import './Mypage.css';

function MyPage({ userInfoms, access_Token, setProblem, setAccessToken, setUserInfo, image, name, setName }) {
    const [user_name, setUser_Name] = useState('');
    const [user_level, setUser_Level] = useState('');
    const [total_exp, setTotal_Exp] = useState(100);
    const [user_exp, setUser_Exp] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [dataList, setDataList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [item, setitem] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (!access_Token) {
            refreshAccessToken(setAccessToken);
        }
        const url = 'https://salgoo9.site/api/myInfo';
        try {
            const response = fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'access': `${access_Token}`
                }
            }).then(async response => {
                const responseData = await response.json();
                // 로컬 스토리지에 결과 저장
                if (responseData.status && responseData.status.code === 200) {
                    const userInfom = responseData.results[0];
                    setUser_Name(userInfom.userName);
                    setUser_Level(userInfom.level);
                    setUser_Exp(userInfom.extraExp);
                    setProfileImage(userInfom.profileImage);
                    setUserInfo(responseData.results[0]);
                    setDataList(userInfom.myCodes || []); // myCodes가 정의되지 않았을 때 빈 배열로 설정
                } else {
                    console.error('Invalid response status:', responseData.status);
                }

            });
        } catch (error) {
            console.error('오류 발생:', error);
        }

        const adjustFontSizeToFit = (elementId) => {
            const element = document.getElementById(elementId);
            const containerWidth = element.clientWidth;
            const containerHeight = element.clientHeight;
        
            // 임시적으로 매우 큰 글자 크기로 설정하여 최소 크기를 구합니다.
            element.style.fontSize = '40px';
            let fontSize = 40;
        
            while (element.scrollWidth > containerWidth || element.scrollHeight > containerHeight) {
                fontSize -= 1;
                element.style.fontSize = fontSize + 'px';
        
                // 글자 크기가 너무 작아지면 루프를 종료합니다.
                if (fontSize <= 10) {
                    break;
                }
            }
        }
        adjustFontSizeToFit('MyPage_User_name');
    }, []);

    const handleinformClick = () => {
        navigate('/InformPage');
    };

    const handleinformClick2 = (item) => {
        console.log(`Clicked on roomId: ${item.roomId}, problemId: ${item.problemId}`);
        Get_User_code(item.roomId, item.problemId, access_Token, user_name);
        Get_Problem(item.roomId, item.problemId, access_Token, setProblem, user_name);
        openModal(item);
    };

    const openModal = (item) => {
        setIsModalOpen(true);
        setitem(item);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    
    return (
        <div className='MyPage_container'>
            <Header access_Token={access_Token} setAccessToken={setAccessToken}/>
            <div className="MyPage">
                <div className="MyPage_Proflie">
                    
                    {profileImage ? (
                            <img src={profileImage} alt="프로필 이미지" className="MyPage_Proflie_img" />
                        ) : (
                            <UserProfileIcon className="MyPage_Proflie_img" />
                        )}

                    <div id = "MyPage_User_name" className="MyPage_User_name">{user_name}</div>
                    <div className="MyPage_Lv">Lv.{user_level}</div>
                    <div className="MyPage_Exp">
                        <div className="MyPage_TotalExp" style={{ width: `${total_exp}%` }} ></div>
                        <div className="MyPage_NowExp" style={{ width: `${user_exp}%`, maxWidth: '100%' }}></div>
                    </div>
                    <button
                        type="button"
                        className='MyPage_button'
                        onClick={handleinformClick}
                    >
                        개인 정보 변경
                    </button>
                </div>

                <div className="MyPage_RecentWork">
                    <div className="MyPage_RecentWork_title">Recent work</div>
                    <div className="MyPage_Group38">
                        <div className="MyPage_Rectangle26">
                            <div className='MyPage_problemName'>문제명</div>
                            <div className='MyPage_durationTile'>소요 시간</div>
                            <div className='MyPage_solve'>해결 유무</div>
                            <div className='MyPage_submitTime'>날짜</div>
                        </div>
                        <div className="MyPage_Rectangle3">
                            {Array.isArray(dataList) && dataList.length > 0 ? (
                                dataList.map((item, index) => (
                                    <div key={index} className="Mypage_item" onClick={() => handleinformClick2(item)}>
                                        <div className="Mypage_item-name">{item.problemName}</div>
                                        <div className="Mypage_item-Lang">{item.durationTime}</div>
                                        <div className="Mypage_item-difficulty">{item.solved ? 'Solved' : 'Not Solved'}</div>
                                        <div className="Mypage_item-date">{item.submitTime ? item.submitTime.split('T')[0] : ''}</div>
                                    </div>
                                ))
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                item={item}
                user_name={user_name}
            />
        </div>

    );
}

export default MyPage;
