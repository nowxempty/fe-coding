import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import CodeEditorPage from "../CodeEditor/CodeEditorPage";
import Chatting from "../../components/Chatting/Chatting";
import UserList from "../WaitingRoom/UserList/UserList";
import RoomInfo from "../WaitingRoom/RoomInfo/RoomInfo";
import './WaitingRoom.css';
import Button from "../../components/Button/Button";

const WaitingRoom = ({ access_Token }) => {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const location = useLocation();
    const [userData, setUserData] = useState(null);
    const [hostName, setHostName] = useState(location.state?.hostName || '');
    const [isHost, setIsHost] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [allReady, setAllReady] = useState(false);
    const [start, setStart] = useState(false);

    const handleExit = async () => {
        if (isHost) {
            const deleteUrl = `https://salgoo9.site/api/rooms/${roomId}`;
            try {
                const response = await fetch(deleteUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'access': access_Token
                    }
                });
                if (!response.ok) {
                    throw new Error('네트워크 응답이 좋지 않습니다');
                }
                navigate('/ChallengeList');
            } catch (error) {
                console.error('방 삭제 중 오류 발생:', error);
            }
        } else {
            const leaveUrl = `https://salgoo9.site/api/rooms/${roomId}/leave`;
            try {
                const response = await fetch(leaveUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'access': access_Token
                    }
                });
                if (!response.ok) {
                    throw new Error('네트워크 응답이 좋지 않습니다');
                }
                navigate('/ChallengeList');
            } catch (error) {
                console.error('방 떠나기 중 오류 발생:', error);
            }
        }
    };

    const handleReady = async () => {
        const readyUrl = `https://salgoo9.site/api/rooms/${roomId}/ready`;
        const unreadyUrl = `https://salgoo9.site/api/rooms/${roomId}/unready`;

        try {
            const response = await fetch(isReady ? unreadyUrl : readyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'access': access_Token
                }
            });
            if (!response.ok) {
                throw new Error('네트워크 응답이 좋지 않습니다');
            }
            setIsReady(!isReady);
            setRefreshKey(refreshKey + 1);
        } catch (error) {
            console.error('준비 상태 업데이트 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://salgoo9.site/api/myInfo', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'access': access_Token
                    }
                });
                const result = await response.json();
                console.log('API 응답:', result);
                const user = result.results[0];
                const userData = {
                    id: user.userLoginId,
                    name: user.userName,
                    level: user.level,
                    ranking: user.ranking,
                    score: user.totalExpPoint,
                    challenges: user.myCodes.length,
                    profileImage: user.profileImage
                };
                setUserData(userData);
                console.log('user.name:', userData.name, 'hostName:', hostName);
                setIsHost(userData.name === hostName);
            } catch (error) {
                console.error('API 요청 중 오류 발생:', error);
            }
        };

        fetchData();
    }, [access_Token, hostName]);

    useEffect(() => {
        const checkStartStatus = async () => {
            if (isHost) return;
            try {
                const response = await fetch(`https://salgoo9.site/api/rooms/${roomId}/status`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'access': access_Token
                    }
                });
                if (response.ok) {
                    const result = await response.json();
                    if (result.status === 'ONGOING') {
                        setStart(true);
                    }
                }
            } catch (error) {
                console.error('시작 상태 확인 중 오류 발생:', error);
            }
        };

        const intervalId = setInterval(checkStartStatus, 1000);

        return () => clearInterval(intervalId);
    }, [access_Token, roomId, isHost]);

    const handleStart = async () => {
        const startUrl = `https://salgoo9.site/api/rooms/${roomId}/start`;
        try {
            const response = await fetch(startUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'access': access_Token
                }
            });
            if (!response.ok) {
                throw new Error('네트워크 응답이 좋지 않습니다');
            }
            setStart(true);
        } catch (error) {
            console.error('방 시작 중 오류 발생:', error);
        }
    };

    const handleFetchRoomData = (hostName) => {
        setHostName(hostName);
        setIsHost(userData && userData.name === hostName);
    };

    if (start && userData) {
        return <CodeEditorPage userId={userData.id} roomId={roomId} access_Token={access_Token} />;
    }

    return (
        <div>
            <Header className={"Header"} access_Token={access_Token} />
            <div style={{ display: 'flex', width: '100vw', height: '94vh', gap: '30px', justifyContent: 'center', alignItems: 'center' }}>
                <div className="main_left">
                    <UserList access_Token={access_Token} refreshKey={refreshKey} setAllReady={setAllReady} />
                    <Chatting access_Token={access_Token} roomId={roomId} userName={hostName || "Unknown"} />
                </div>
                <div className="main_right">
                    <RoomInfo access_Token={access_Token} onFetchRoomData={handleFetchRoomData} />
                    <div className="Button_Group">
                        {isHost ? (
                            <Button className={"Start"} text={"시작"} onClick={handleStart} disabled={!allReady} />
                        ) : (
                            <Button className={`Ready ${isReady ? "ready-complete" : ""}`} text={isReady ? "준비 완료" : "준비"} onClick={handleReady} />
                        )}
                        <Button className={"Exit"} text={"나가기"} onClick={handleExit} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WaitingRoom;
