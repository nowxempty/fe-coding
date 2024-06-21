// Create_Modal.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from "../../../components/Button/Button";
import BronzeIcon from '../../../components/Icon/BronzeIcon';
import SilverIcon from '../../../components/Icon/SilverIcon';
import GoldIcon from '../../../components/Icon/GoldIcon';
import "./Create_Modal.css";

const problems = {
    Bronze: Array.from({ length: 10 }, (_, i) => `Bronze 문제 ${i + 1}`),
    Silver: Array.from({ length: 10 }, (_, i) => `Silver 문제 ${i + 1}`),
    Gold: Array.from({ length: 10 }, (_, i) => `Gold 문제 ${i + 1}`)
};

const difficulties = {
    Bronze: 1,
    Silver: 2,
    Gold: 3
};

function Create_Modal({ setmodalopen,access_Token }) {
    const [roomName, setRoomName] = useState('');
    const [hour, setHour] = useState('0');
    const [minute, setMinute] = useState('0');
    const [description, setDescription] = useState('');
    const [level1, setLevel1] = useState('');
    const [question1, setQuestion1] = useState('');
    const [level2, setLevel2] = useState('선택 안함');
    const [question2, setQuestion2] = useState('');
    const [level3, setLevel3] = useState('선택 안함');
    const [question3, setQuestion3] = useState('');
    const [averageDifficulty, setAverageDifficulty] = useState('');
    const [error, setError] = useState('');
    const [response, setResponse] = useState(null);
    const [validationError, setValidationError] = useState({
        roomName: false,
        time: false,
        question1: false,
        description: false
    });

    const navigate = useNavigate();

    const handleClose = () => {
        setmodalopen(false);
    };

    const handleCreate = async () => {
        let valid = true;
        const newValidationError = {
            roomName: false,
            time: false,
            question1: false,
            description: false
        };

        if (!roomName || roomName.length < 1 || roomName.length > 10) {
            newValidationError.roomName = true;
            valid = false;
        }
        if ((parseInt(hour) === 0 && parseInt(minute) < 30) || parseInt(hour) > 2 || (parseInt(hour) === 2 && parseInt(minute) > 0)) {
            newValidationError.time = true;
            valid = false;
        }
        if (!question1) {
            newValidationError.question1 = true;
            valid = false;
        }
        if (!description || description.length < 1) {
            newValidationError.description = true;
            valid = false;
        }

        setValidationError(newValidationError);

        if (!valid) {
            setError('필수 항목을 올바르게 입력하세요.');
            return;
        }

        const selectedQuestions = [question1, question2, question3].filter(q => q && q !== '선택 안함');
        const totalDifficulty = selectedQuestions.reduce((acc, q) => {
            if (q.includes('Bronze')) return acc + difficulties.Bronze;
            if (q.includes('Silver')) return acc + difficulties.Silver;
            if (q.includes('Gold')) return acc + difficulties.Gold;
            return acc;
        }, 0);
        const average = totalDifficulty / selectedQuestions.length;
        const roundedAverage = Math.round(average).toFixed(1) * 1;

        const newChallenge = {
            roomTitle: roomName,
            averageDifficulty: roundedAverage,
            description,
            duration: (parseInt(hour) * 60) + parseInt(minute),
            problems: selectedQuestions.map(q => {
                const match = q.match(/\d+/); // 문제 번호를 추출하는 정규식
                return match ? parseInt(match[0]) : null;
            })
        };

        console.log('보낼 JSON:', JSON.stringify(newChallenge, null, 2));
        
        const access = access_Token;
        try {
            const response = await fetch('https://salgoo9.site/api/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'access': access
                },
                body: JSON.stringify(newChallenge)
            });
            if (!response.ok) {
                throw new Error('네트워크 응답이 좋지 않습니다');
            }
            const result = await response.json();
            console.log('API 응답:', result);
            setResponse(result);
            handleClose();
            navigate(`/room/${result.id}`, { state: { isHost: true, hostName: 'host' } });
        } catch (error) {
            console.error('API 요청 중 오류 발생:', error);
            setError('챌린지 생성 중 오류가 발생했습니다.');
        }
    };

    const calculateAverageDifficulty = () => {
        const selectedQuestions = [question1, question2, question3].filter(q => q && q !== '선택 안함');
        const totalDifficulty = selectedQuestions.reduce((acc, q) => {
            if (q.includes('Bronze')) return acc + difficulties.Bronze;
            if (q.includes('Silver')) return acc + difficulties.Silver;
            if (q.includes('Gold')) return acc + difficulties.Gold;
            return acc;
        }, 0);
        const average = totalDifficulty / selectedQuestions.length;
        const roundedAverage = Math.round(average);
        if (roundedAverage === 1) return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <BronzeIcon />
            <p style={{ margin: '0', color: '#a57939' }}>Bronze</p>
        </div>;
        if (roundedAverage === 2) return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SilverIcon />
            <p style={{ margin: '0', color: '#8a8a8a' }}>Silver</p>
        </div>;
        if (roundedAverage === 3) return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <GoldIcon />
            <p style={{ margin: '0', color: '#cbbe2a' }}>Gold</p>
        </div>;
    };

    useEffect(() => {
        setAverageDifficulty(calculateAverageDifficulty());
    }, [question1, question2, question3]);

    return (
        <div className='create_modal'>
            <div className='modal_content'>
                <div className='header_with_error'>
                    <h2>챌린지 생성</h2>
                    {error && <div className='error_message'>{error}</div>}
                </div>
                <div>
                    <div className='top_section'>
                        <div className='top_left_section'>
                            <div className='form_group'>
                                <div className='input_with_hint'>
                                    <label>방 제목</label>
                                    <span className={`input_hint ${validationError.roomName ? 'error_hint' : ''}`}>
                                        (방 제목은 1~10자를 입력해주세요.)
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    placeholder="방 제목을 입력하세요."
                                />
                            </div>
                            <div className='form_group'>
                                <div className='input_with_hint'>
                                    <label>풀이 시간</label>
                                    <span className={`input_hint ${validationError.time ? 'error_hint' : ''}`}>
                                        (최소 30분 이상 최대 2시간 이내로 선택해주세요.)
                                    </span>
                                </div>
                                <div className='time_input'>
                                    <select value={hour} onChange={(e) => setHour(e.target.value)}>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                    </select>
                                    <span>Hour</span>
                                    <select value={minute} onChange={(e) => setMinute(e.target.value)}>
                                        <option value="0">0</option>
                                        <option value="15">15</option>
                                        <option value="30">30</option>
                                        <option value="45">45</option>
                                    </select>
                                    <span>Min</span>
                                </div>
                            </div>
                            <div className='form_group'>
                                <label>평균 난이도</label>
                                <div className='average_difficulty_container'>
                                    <div className='average_difficulty'>
                                        {averageDifficulty}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='top_right_section'>
                            {['1', '2', '3'].map((num) => (
                                <div className='form_group' key={num}>
                                    <label>{num}번 문제 {num === '1' && <span style={{ color: 'red', fontSize: '12px' }}>필수 선택</span>}</label>
                                    <select
                                        value={eval(`level${num}`)}
                                        onChange={(e) => {
                                            const setLevel = eval(`setLevel${num}`);
                                            setLevel(e.target.value);
                                            eval(`setQuestion${num}`)('선택 안함');
                                        }}
                                    >
                                        <option value="">난이도 선택</option>
                                        <option value="Bronze">Bronze</option>
                                        <option value="Silver">Silver</option>
                                        <option value="Gold">Gold</option>
                                    </select>
                                    <select
                                        value={eval(`question${num}`)}
                                        onChange={(e) => eval(`setQuestion${num}`)(e.target.value)}
                                    >
                                        <option value="">문제 선택</option>
                                        {eval(`level${num}`) && eval(`level${num}`) !== '선택 안함' && problems[eval(`level${num}`)].map((problem, index) => (
                                            <option key={index} value={problem}>{problem}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='bottom_section'>
                        <div className='form_group'>
                            <div className='input_with_hint'>
                                <label>방 설명</label>
                                <span className={`input_hint ${validationError.description ? 'error_hint' : ''}`}>
                                    (1글자 이상 작성해주세요.)
                                </span>
                            </div>
                            <input
                                className='room_explanation'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="방 설명을 입력하시오. ex) 살9의 코딩, 귀납법"
                            />
                        </div>
                    </div>
                    <div className='button_group'>
                        <Button className={`Create_Button`} text="챌린지 생성" onClick={handleCreate} />
                        <Button className={`Cancel_Button`} text="취소" onClick={handleClose} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Create_Modal;
