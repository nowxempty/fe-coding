import React, { useState, useRef, useEffect } from 'react';
import Button from '../Button/Button';
import Arrow from '../Icon/Arrow';
import './Chatting.css';

const Chatting = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const nickname = '닉네임'; // 예시로 닉네임을 지정합니다. 실제로는 API에서 가져올 수 있습니다.

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            const newMessage = {
                content: inputValue,
                timestamp: new Date().toLocaleTimeString(),
                type: 'sent', // 보낸 메시지로 설정
                nickname: nickname
            };
            setMessages([...messages, newMessage]);
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
                    icon={<Arrow />}
                />
            </div>
        </div>
    );
}

export default Chatting;