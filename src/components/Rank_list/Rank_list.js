import React, { useEffect, useState } from "react";
import "./Rank_list.css";

const Rank_list = ({access_Token}) => {
    const [rankings, setRankings] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await fetch('https://salgoo9.site/api/ranking', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'access': access_Token
                    }
                });
                if (!response.ok) {
                    
                }
                const data = await response.json();
                
                // JSON 데이터를 콘솔 로그로 출력
                console.log('API 응답 데이터:', data);

                // 순위 데이터를 상태에 저장
                setRankings(data.results[0]);
            } catch (error) {
                
            }
        };

        fetchData();
    }, []);

    

    return (
        <div className="Rank_list">
            <div className="Rank_fixed">
                <h3 className="Rank_title">실시간 순위</h3>
                <div className="Rank_list-header">
                    <span className="rank">등수</span>
                    <span className="nickname">닉네임</span>
                    <span className="score">점수</span>
                </div>
            </div>
                
            {rankings.slice(0, 10).map((item, index) => (
                <div className="Rank_list-item" key={index}>
                    <span className="rank">{index + 1}</span>
                    <span className="nickname">{item.userName}</span>
                    <span className="score">{item.userPoint}</span>
                </div>
            ))}
        </div>
    );
}

export default Rank_list;
