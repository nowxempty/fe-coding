import React, { useEffect, useState } from 'react';
import './RankingModal.css';
import profileIcon from '../../../components/Icon/UserProfileIcon';

const RankingModal = ({ isOpen, onClose, roomId, problemId, access_Token }) => {
    const [rankings, setRankings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allFailed, setAllFailed] = useState(false);

    useEffect(() => {
        let fetchTimer;
        let closeTimer;

        const fetchRankings = async () => {
            setIsLoading(true);
            setError(null);  // 새로 요청을 시작할 때 에러 상태 초기화
            try {
                const response = await fetch(`https://salgoo9.site/api/rooms/${roomId}/score?problemId=${problemId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'access': access_Token
                    },
                });
                const data = await response.json();
                if (data.results && data.results[0].length > 0) {
                    const filteredRankings = data.results[0].filter(ranking => ranking.rank !== 0);
                    setRankings(filteredRankings);
                    const allRanksAreZero = data.results[0].every(ranking => ranking.rank === 0);
                    setAllFailed(allRanksAreZero);
                } else {
                    setRankings([]);
                    setError('순위가 집계중입니다...');
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching rankings', error);
                setError('Error fetching rankings.');
                setIsLoading(false);
            }
        };

        if (isOpen) {
            fetchRankings();
            fetchTimer = setInterval(fetchRankings, 6000);
        }

        return () => {
            clearInterval(fetchTimer);
            clearTimeout(closeTimer);
        };
    }, [isOpen, roomId, problemId, access_Token]);

    useEffect(() => {
        let closeTimer;
        if (rankings.length > 0 || allFailed) {
            closeTimer = setTimeout(() => {
                onClose();
            }, 5000); // 5초 후에 모달 닫기
        }
        return () => clearTimeout(closeTimer);
    }, [rankings, allFailed, onClose]);

    if (!isOpen) return null;

    return (
        <div className="ranking-modal">
            <div className="ranking-modal-content">
                <h2>Ranking</h2>
                {isLoading ? (
                    <p className="loading">순위가 집계중입니다...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : allFailed ? (
                    <p className="all-failed">모든 사람이 문제를 푸는데 실패했습니다</p>
                ) : (
                    <ul>
                        {rankings.map((ranking, index) => (
                            <li key={index} className="ranking-item">
                                <span className="rank">{ranking.rank}</span>
                                <img className="profile-img" src={ranking.profileImage} alt={profileIcon} />
                                <span>{ranking.username}</span>
                                <span>Level: {ranking.level}</span>
                                <span>Extra EXP: {ranking.extraEXP}</span>
                                <span>Time: {ranking.durationTile || 'N/A'}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default RankingModal;
