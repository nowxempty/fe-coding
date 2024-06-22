import React, { useState, useRef, useEffect } from 'react';
import { useParams } from "react-router-dom";
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import Button from '../Button/Button';
// import Arrow from '../Icon/arrow.js';
import { FaArrowRight } from 'react-icons/fa';
import './Chatting.css';

const Chatting = ({ userName,access_Token }) => {
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const stompClientRef = useRef(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // 소켓 서버에 연결
        const socket = new SockJS(`https://salgoo9.site/chat`);
        const stompClient = Stomp.over(socket);
        stompClientRef.current = stompClient;

        // STOMP 연결 설정
        stompClient.connect({ "access": getTokenFromSomeWhere() }, (frame) => {
            console.log('Connected to the server: ' + frame);
            setConnected(true);

            // Room ID로 연결된 방을 구독
            const subscriptionUrl = `/sub/${roomId}`;
            stompClient.subscribe(subscriptionUrl, (message) => {
                displayMessage(message);
            });
            console.log('Subscribed to room ' + roomId);
        }, (error) => {
            console.log('Error: ' + error);
            setConnected(false);
        });

        // 컴포넌트 언마운트 시 소켓 연결 해제
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.disconnect(() => {
                    console.log('Disconnected from the server');
                });
                setConnected(false);
            }
        };
    }, [roomId]);

    const handleSendMessage = () => {
        const stompClient = stompClientRef.current;
        if (!connected) {
            alert('WebSocket is not connected.');
            return;
        }

        if (inputValue.trim()) {
            const headers = { "access": getTokenFromSomeWhere() };
            stompClient.send(`/pub/message/${roomId}`, headers, JSON.stringify({
                content: inputValue,
                sender: userName // 서버로 보낼 때도 userName을 sender로 보냅니다.
            }));

            setInputValue('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const displayMessage = (message) => {
        const messageBody = JSON.parse(message.body);
        const newMessage = {
            content: messageBody.content,
            timestamp: new Date().toLocaleTimeString(),
            type: messageBody.sender === userName ? 'sent' : 'received',
            nickname: messageBody.sender // 서버로부터 받은 메시지에서 sender를 nickname으로 설정합니다.
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    function getTokenFromSomeWhere() {
        return access_Token;
    }

    return (
        <div className="chatting_list">
            <h2>실시간 채팅</h2>
            <div className='chatting'>
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.type}`}>
                        <div className='message-content'><strong>{msg.nickname}:</strong> {msg.content}</div>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>
            <div className='input_chatting'>
                <input 
                    type="text" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    onKeyPress={handleKeyPress} 
                />
                <Button 
                    className="button" 
                    divClassName="text" 
                    onClick={handleSendMessage} 
                    icon={<FaArrowRight />}
                />
            </div>
        </div>
    );
}

export default Chatting;
