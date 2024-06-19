import React, { useEffect, useState } from 'react';
import './RankingModal.css';

const RankingModal = ({ isOpen, onClose }) => {
    const [rankings, setRankings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allFailed, setAllFailed] = useState(false);


    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const response = await fetch('https://salgoo9.site/api/rooms/2/score?problemId=6', { //`https://salgoo9.site/api/${room_id}/score?problemId=${problemId}
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'access': 'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsInVzZXJuYW1lIjoiamhjOTkxMjE1MCIsInJvbGUiOiJST0xFX0FETUlOIiwiaWF0IjoxNzE4Njc1MjY3LCJleHAiOjE3MTg3NjE2Njd9.bZzG1rqtlmYcgOqHbfOBWpDpfv4_IPmpdffdckiYNLA'
                    },
                });
                const data = await response.json();
                if (data.results && data.results[0].length > 0) {
                    setRankings(data.results[0]);
                    const allRanksAreZero = data.results[0].every(ranking => ranking.rank === 0);
                    if (allRanksAreZero) {
                        setAllFailed(true);
                    }
                } else {
                    setRankings([]);
                    setError('순위가 집계중입니다...');
                }
            } catch (error) {
                console.error('Error fetching rankings', error);
                setError('Error fetching rankings.');
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            fetchRankings();
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="ranking-modal">
          <div className="ranking-modal-content">
            <h2>Ranking</h2>
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : allFailed ? (
              <p>모든 사람이 문제를 푸는데 실패했습니다</p>
            ) : (
              <ul>
                {rankings.map((ranking, index) => (
                  <li key={index} className="ranking-item">
                    <span>Rank: {ranking.rank}</span>
                    <span>Username: {ranking.username}</span>
                    <span>Level: {ranking.level}</span>
                    <span>Extra EXP: {ranking.extraEXP}</span>
                    <span>Time: {new Date(ranking.localDateTime).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );
    };
    
export default RankingModal;
