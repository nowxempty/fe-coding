import React, { useEffect, useState } from 'react';
import './RankingModal.css';

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
                    setRankings(data.results[0]);
                    const allRanksAreZero = data.results[0].every(ranking => ranking.rank === 0);
                    if (allRanksAreZero) {
                        setAllFailed(true);
                    } else {
                        setAllFailed(false);
                    }
                    setIsLoading(false);

                    // 모달을 5초 후에 닫기
                    closeTimer = setTimeout(() => {
                        onClose();
                    }, 5000);
                } else {
                    setRankings([]);
                    setError('순위가 집계중입니다...');
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching rankings', error);
                setError('Error fetching rankings.');
                setIsLoading(false);
            }
        };

        if (isOpen) {
            fetchRankings();
            fetchTimer = setInterval(fetchRankings, 5000);
        }

        return () => {
            clearInterval(fetchTimer);
            clearTimeout(closeTimer);
        };
    }, [isOpen, roomId, problemId, access_Token]);

    useEffect(() => {
        let closeTimer;
        if (rankings.length > 0) {
            closeTimer = setTimeout(() => {
                onClose();
            }, 5000); // 5초 후에 모달 닫기
        }
        return () => clearTimeout(closeTimer);
    }, [rankings, onClose]);

    if (!isOpen) return null;

    return (
        <div className="ranking-modal">
            <div className="ranking-modal-content">
                <h2>Ranking</h2>
                {isLoading ? (
                    <p>순위가 집계중입니다...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : allFailed ? (
                    <p>모든 사람이 문제를 푸는데 실패했습니다</p>
                ) : (
                    <ul>
                        {rankings.map((ranking, index) => (
                            <li key={index} className="ranking-item">
                                <span>Rank: {ranking.rank}</span>
                                <img src={ranking.profileImage} alt={`${ranking.username}'s profile`} />
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
