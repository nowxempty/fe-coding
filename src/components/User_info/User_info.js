import React, { useState, useEffect } from "react";
import UserProfileIcon from "../Icon/UserProfileIcon";
import Logout from "../Icon/Logout";
import Button from "../Button/Button"; 
import { useNavigate } from 'react-router-dom';
import "./User_info.css";

const Userinfo = ({access_Token}) => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://salgoo9.site/api/myInfo', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'access': access_Token
                    }
                });
                const result = await response.json();
                console.log('API 응답:', result); // 응답을 콘솔에 출력
                const user = result.results[0];
                const userData = {
                    name: user.userName,
                    level: user.level,
                    ranking: user.ranking, // rank 값은 응답에 포함되지 않으므로 0으로 설정
                    score: user.totalExpPoint,
                    challenges: user.myCodes.length,
                    profileImage: user.profileImage
                };
                setUserData(userData);

            } catch (error) {
                console.error('API 요청 중 오류 발생:', error);
            }
        };

        fetchData();
    },[]);

    if (!userData) {
        return <div>Loading...</div>; // 데이터가 로드될 때까지 로딩 메시지를 표시합니다.
    }

    const fontSize = userData.name.length > 5 ? "14px" : "18px";

    const handleLogout = () => {
        // const logout_result = logout(navigate,setAccessToken);
        // console.log(logout_result);
        // if(logout_result){
          navigate('/Login');
        // }
    };

    return (
        <div className="user_info">
            <div className="user_header">
                <div className="user_profile">
                    <div className="left_section">
                        {userData.profileImage ? (
                            <img src={userData.profileImage} alt="프로필 이미지" className="user_profile_image" />
                        ) : (
                            <UserProfileIcon />
                        )}
                        <span style={{ fontSize }}>{userData.name}</span>
                        <div className="user_level">Level.{userData.level}</div>
                    </div>
                    <Button
                        className="logout-button-custom"
                        divClassName="logout-text"
                        text="로그아웃"
                        onClick={handleLogout}
                        icon={<Logout />}
                    />
                </div>
            </div>

            <div className="user_footer">
                <div className="user_stats">
                    <div className="stat">
                        <span className="stat_label">순위</span>
                        <span className="stat_value">{userData.ranking} 위</span>
                    </div>
                    <div className="stat">
                        <span className="stat_label">점수</span>
                        <span className="stat_value">{userData.score} 점</span>
                    </div>
                    <div className="stat">
                        <span className="stat_label">진행한 챌린지</span>
                        <span className="stat_value">{userData.challenges} 개</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Userinfo;
