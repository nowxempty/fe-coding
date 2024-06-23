import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import './Lastest_Chart.css';

const Lastest_Chart = ({ access_Token, hideMyChallengeButton = false, setModalOpen }) => {
    const [recentChallenges, setRecentChallenges] = useState([]);
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

                // userCodes 배열에서 마지막 4개의 problemName을 추출하여 최근 챌린지 설정
                const recentChallenges = user.myCodes.slice(-4).map(code => code.problemName);
                setRecentChallenges(recentChallenges);
            } catch (error) {
                console.error('API 요청 중 오류 발생:', error);
            }
        };

        fetchData();
    }, [access_Token]);

    const handleCreateChallenge = () => {
        setModalOpen(true);
    };

    const handleMyChallenge = () => {
        navigate("/MyPage");
    };

    return (
        <div className="challenge-container">
            <h2>최근 진행한 챌린지</h2>
            <ul className="challenge-list">
                {recentChallenges.map((challenge, index) => (
                    <li key={index} className="challenge-item">{challenge}</li>
                ))}
            </ul>
            <div className='Buttons'>
                <Button text="챌린지 생성" onClick={handleCreateChallenge} />
                {!hideMyChallengeButton && <Button text="마이페이지" onClick={handleMyChallenge} />}
            </div>
        </div>
    );
};

export default Lastest_Chart;
