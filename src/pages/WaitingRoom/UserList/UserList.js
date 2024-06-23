import React, { useState, useEffect } from 'react';
import UserItem from './UserItem/UserItem';
import { useParams } from 'react-router-dom';
import './UserList.css';

const UserList = ({ access_Token, refreshKey, setAllReady }) => {
    const { roomId } = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchParticipants = async () => {
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
                const mappedData = data.map((user, index) => ({
                    id: index, // 고유 키로 사용될 id 설정
                    profileImage: user.profileImage, // 필요한 경우 기본 프로필 이미지를 설정
                    name: user.name,
                    info: user.status,
                    ready: user.status === 'WAITING' ? false : true // 상태에 따라 ready 여부 설정
                }));
                
                setUsers(mappedData); // 상태에 데이터 설정
                setAllReady(mappedData.every(user => user.ready)); // 모든 사용자가 ready인지 여부를 설정
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        // 첫 번째 fetchParticipants 호출
        fetchParticipants();

        // 1초마다 fetchParticipants 호출
        const intervalId = setInterval(fetchParticipants, 1000);

        // 컴포넌트가 언마운트될 때 인터벌을 정리
        return () => clearInterval(intervalId);
    }, [roomId, refreshKey, access_Token, setAllReady]);

    if (loading) {
        return <p>로딩 중...</p>;
    }

    if (error) {
        return <p>오류 발생: {error}</p>;
    }

    return (
        <div className="user-list">
            <h2 className="user-list-title">참여자 목록</h2>
            <div className="user-item-list">
                {users.map((user) => (
                    <UserItem 
                        key={user.id} 
                        profileImage={user.profileImage}
                        name={user.name}
                        ready={user.ready} 
                    />
                ))}
            </div>
        </div>
    );
}

export default UserList;
