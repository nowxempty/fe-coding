import React, { useState, useEffect, useRef } from 'react';
import Challenge_header from './Challenge_header/Challenge_header';
import Challenge_item from './Challenge-item/Challenge-item';
import './Challenge_chart.css';

const Challenge_chart = ({ access_Token }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('난이도');
    const [exampleData, setExampleData] = useState([]);
    const previousDataRef = useRef([]);

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

                // 데이터 형식 변환 및 필터링
                const filteredData = data
                    .filter(item => item.roomStatus !== 'ONGOING' && item.roomStatus !== 'FULL')
                    .map(item => ({
                        id: item.id,
                        roomTitle: item.roomTitle,
                        hostName: item.hostName,
                        averageDifficulty: item.averageDifficulty,
                        description: item.description,
                        duration: item.duration,
                        roomStatus: item.roomStatus,
                        problems: item.problems.map(String) // 문제 번호를 문자열로 변환
                    }));

                // 이전 데이터와 비교
                if (JSON.stringify(previousDataRef.current) !== JSON.stringify(filteredData)) {
                    setExampleData(filteredData);
                    previousDataRef.current = filteredData;
                }
            } catch (error) {
                console.error('데이터를 가져오는데 오류가 발생했습니다:', error);
            }
        };

        // 첫 번째 fetchData 호출
        fetchData();

        // 1초마다 fetchData 호출
        const intervalId = setInterval(fetchData, 1000);

        // 컴포넌트가 언마운트될 때 인터벌을 정리
        return () => clearInterval(intervalId);
    }, [access_Token]);

    return (
        <div className='Challenge_chart'>
            <Challenge_header onSearch={setSearchTerm} onDifficultyChange={handleDifficultyChange} />
            <Challenge_item access_Token={access_Token} data={exampleData} searchTerm={searchTerm} difficultyFilter={difficultyFilter} />
        </div>
    );
};

export default Challenge_chart;
