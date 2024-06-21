import React, { useState, useEffect } from 'react';
import Challenge_header from './Challenge_header/Challenge_header';
import Challenge_item from './Challenge-item/Challenge-item';
import './Challenge_chart.css';

const Challenge_chart = ({access_Token} ) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('난이도');
    const [exampleData, setExampleData] = useState([]);

    const handleDifficultyChange = (difficulty) => {
        setDifficultyFilter(difficulty === difficultyFilter ? '난이도' : difficulty);
    };

    useEffect(() => {
        

        const fetchData = async () => {
            try {
                const response = await fetch('https://salgoo9.site/api/rooms', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'access': access_Token
                    }
                });
                if (!response.ok) {
                    throw new Error('네트워크 응답이 좋지 않습니다');
                }
                const data = await response.json();
                
                // JSON 데이터를 콘솔 로그로 출력
                console.log('API 응답 데이터:', data);

                // 데이터 형식 변환
                const filteredData = data.map(item => ({
                    id: item.id,
                    roomTitle: item.roomTitle,
                    hostName: item.hostName,
                    averageDifficulty: item.averageDifficulty,
                    description: item.description,
                    duration: item.duration,
                    problems: item.problems.map(String) // 문제 번호를 문자열로 변환
                }));

                setExampleData(filteredData);
            } catch (error) {
            }
        };

        fetchData();
    }, []);

    return (
        <div className='Challenge_chart'>
            <Challenge_header onSearch={setSearchTerm} onDifficultyChange={handleDifficultyChange} />
            <Challenge_item access_Token={access_Token} data={exampleData} searchTerm={searchTerm} difficultyFilter={difficultyFilter} />
        </div>
    );
};

export default Challenge_chart;
