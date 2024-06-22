import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./RoomInfo.css";

const RoomInfo = ({access_Token}) => {
    const [roomData, setRoomData] = useState(null);
    const { roomId } = useParams(); // useParams 훅을 사용하여 roomId를 가져옵니다.

    const handleJoin = async (roomId) => {
        const access = access_Token
        try {
            const response = await fetch(`https://salgoo9.site/api/rooms/${roomId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'access': access
                }
            });
            if (!response.ok) {
                throw new Error('네트워크 응답이 좋지 않습니다');
            }
            const data = await response.json();
            setRoomData(data);
            console.log('API 응답 데이터:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (!roomData && roomId) {
            handleJoin(roomId);
        }
    }, [roomId, roomData]);

    const formatDuration = (duration) => {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return `${hours}시 ${minutes}분`;
    };

    const getDifficulty = (averageDifficulty) => {
        switch (averageDifficulty) {
            case 1:
                return <span style={{ color: '#a57939' }}>Bronze</span>;
            case 2:
                return <span style={{ color: '#8a8a8a' }}>Silver</span>;
            case 3:
                return <span style={{ color: '#cbbe2a' }}>Gold</span>;
            case 4:
                return <span style={{ color: '#38BB64' }}>Platinum</span>;
            default:
                return <span>{averageDifficulty}</span>;
        }
    };

    return (
        <div className="room-info">
            <h2>방 정보</h2>
            {roomData ? (
                <div className="room-details">
                    <div className="room-detail-item">
                        <strong>방 제목 </strong>
                        <span className="room-title">{roomData.roomTitle}</span>
                    </div>
                    <div className="room-detail-item">
                        <strong>평균 난이도 </strong>
                        <span className="average-difficulty">{getDifficulty(roomData.averageDifficulty)}</span>
                    </div>
                    <div className="room-detail-item">
                        <strong>풀이 시간 </strong>
                        <span className="duration">{formatDuration(roomData.duration)}</span>
                    </div>
                    <div className="room-detail-item">
                        <strong>문제 목록 </strong>
                        <span className="problems">{roomData.problems.join(', ')}</span>
                    </div>
                    <div className="room-detail-item">
                        <strong>설명 </strong>
                        <span className="description">{roomData.description}</span>
                    </div>
                </div>
            ) : (
                <p>방 정보를 불러오는 중...</p>
            )}
        </div>
    );
}

export default RoomInfo;
