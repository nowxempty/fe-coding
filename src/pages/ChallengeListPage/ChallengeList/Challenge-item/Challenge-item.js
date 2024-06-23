import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/Button/Button";
import ResetIcon from '../../../../components/Icon/reset';
import Downicon from '../../../../components/Icon/downicon';
import Upicon from '../../../../components/Icon/upicon';
import "./Challenge-item.css";

const ChallengeItem = ({ access_Token, data = [], searchTerm, difficultyFilter }) => {
    const [sortedData, setSortedData] = useState(data);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [participants, setParticipants] = useState({});
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const difficultyMapping = {
        1: "Bronze",
        2: "Silver",
        3: "Gold",
        4: "Platinum"
    };

    const difficultyColors = {
        1: "#cc7620",
        2: "#636088",
        3: "#c6c62c",
        4: "#38BB64"
    };

    useEffect(() => {
        const filteredData = data.filter(item =>
            item.roomTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (difficultyFilter === "난이도" || difficultyMapping[item.averageDifficulty].toLowerCase() === difficultyFilter.toLowerCase())
        );
        setSortedData(filteredData);
    }, [data, searchTerm, difficultyFilter]);

    useEffect(() => {
        const fetchParticipants = async (roomId) => {
            try {
                const response = await fetch(`https://salgoo9.site/api/rooms/${roomId}/participants`, {
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
                return data.length; 
            } catch (error) {
                console.error('네트워크 오류 발생:', error);
                return 0;
            }
        };

        const fetchAllParticipants = async () => {
            const participantsCount = {};
            for (const item of data) {
                const count = await fetchParticipants(item.id);
                participantsCount[item.id] = count;
            }
            setParticipants(participantsCount);
        };

        fetchAllParticipants();
    }, [access_Token, data]);

    useEffect(() => {
        console.log("Participants:", participants);
    }, [participants]);

    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }

        const sortedArray = [...sortedData].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

        setSortedData(sortedArray);
        setSortConfig({ key, direction });
    };

    const sortByDifficulty = () => {
        let direction = 'ascending';
        if (sortConfig.key === 'averageDifficulty' && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }

        const sortedArray = [...sortedData].sort((a, b) => {
            if (a.averageDifficulty < b.averageDifficulty) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a.averageDifficulty > b.averageDifficulty) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

        setSortedData(sortedArray);
        setSortConfig({ key: 'averageDifficulty', direction });
    };

    const sortByParticipants = () => {
        let direction = 'ascending';
        if (sortConfig.key === 'participants' && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }

        const sortedArray = [...sortedData].sort((a, b) => {
            const participantsA = participants[a.id] || 0;
            const participantsB = participants[b.id] || 0;

            if (participantsA < participantsB) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (participantsA > participantsB) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

        setSortedData(sortedArray);
        setSortConfig({ key: 'participants', direction });
    };

    const resetSort = () => {
        setSortedData(data);
        setSortConfig({ key: '', direction: '' });
    };

    const renderIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? <Upicon /> : <Downicon />;
        }
        return <Downicon />;
    };

    const renderDifficulty = (difficulty) => {
        const color = difficultyColors[difficulty] || 'black';
        const difficultyText = difficultyMapping[difficulty] || difficulty;
        return <span style={{ color }}>{difficultyText}</span>;
    };

    const handleJoin = async (roomId) => {
        const participantCount = participants[roomId] || 0;
        if (participantCount >= 8) { // 1명 이상이면 모달 표시
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
            }, 700);
            return;
        }

        const joinUrl = `https://salgoo9.site/api/rooms/${roomId}/join`;

        try {
            const response = await fetch(joinUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'access': access_Token
                }
            });
            const result = await response.json();
            console.log('API 응답:', result);

            const joinedUserName = result.name;
            navigate(`/room/${roomId}`, { state: { name: joinedUserName } });
        } catch (error) {
            console.error('참가 중 오류 발생:', error);
        }
    };

    return (
        <div className='Challenge_item'>
            <div className='Challenge_header'>
                <div onClick={sortByParticipants} className="participants_count_header" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <span>인원수</span> <span>{renderIcon('participants')}</span>
                </div>
                <div onClick={() => sortData('roomTitle')} className="title" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <span>제목</span> <span>{renderIcon('roomTitle')}</span>
                </div>
                <div onClick={sortByDifficulty} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <span>난이도</span> <span>{renderIcon('averageDifficulty')}</span>
                </div>
                <div onClick={() => sortData('hostName')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <span>생성자</span> <span>{renderIcon('hostName')}</span>
                </div>
                <div className="reset_button" onClick={resetSort} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ResetIcon /><p style={{ color: "#4679fd", fontSize: '1rem' }}>초기화</p>
                </div>
            </div>
            <div className='Challenge_list'>
                {sortedData.map((item) => (
                    <div className='Challenge_list_item' key={item.id}>
                        <div className="participants_count">{`${participants[item.id] || 0} / 8`}</div>
                        <div className="title">{item.roomTitle}</div>
                        <div className={`difficulty`}>{renderDifficulty(item.averageDifficulty)}</div>
                        <div className="creator">{item.hostName}</div>
                        <div>
                            <Button 
                                className="participants_button" 
                                text="참가" 
                                onClick={() => handleJoin(item.id)} 
                                disabled={participants[item.id] >= 8} 
                            />
                        </div>
                    </div>
                ))}
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <p>현재 참가 인원이 가득 찼습니다.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChallengeItem;
