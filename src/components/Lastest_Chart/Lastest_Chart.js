import React from 'react';
import useNavigate from 'react-router-dom'
import Button from '../Button/Button';
import './Lastest_Chart.css';

const Lastest_Chart = ({access_Token, hideMyChallengeButton = false, setModalOpen }) => {
    const recentChallenges = [
        "챌린지 A",
        "챌린지 B",
        "챌린지 C",
        "챌린지 D"
    ];

    const Navigate = useNavigate();

    const handleCreateChallenge = () => {
        setModalOpen(true);
    };

    const handleMyChallenge = () => {
        Navigate("/MyPage");
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
