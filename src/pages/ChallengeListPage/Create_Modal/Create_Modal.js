import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from "../../../components/Button/Button";
import BronzeIcon from '../../../components/Icon/BronzeIcon';
import SilverIcon from '../../../components/Icon/SilverIcon';
import GoldIcon from '../../../components/Icon/GoldIcon';
import "./Create_Modal.css";

const difficulties = {
    BRONZE: 1,
    SILVER: 2,
    GOLD: 3
};

function Create_Modal({ setmodalopen, access_Token }) {
    const [roomName, setRoomName] = useState('');
    const [hour, setHour] = useState('0');
    const [minute, setMinute] = useState('0');
    const [description, setDescription] = useState('');
    const [level1, setLevel1] = useState('');
    const [question1, setQuestion1] = useState({ title: '', id: null, level: '' });
    const [level2, setLevel2] = useState('선택 안함');
    const [question2, setQuestion2] = useState({ title: '', id: null, level: '' });
    const [level3, setLevel3] = useState('선택 안함');
    const [question3, setQuestion3] = useState({ title: '', id: null, level: '' });
    const [averageDifficulty, setAverageDifficulty] = useState('');
    const [error, setError] = useState('');
    const [response, setResponse] = useState(null);
    const [validationError, setValidationError] = useState({
        roomName: false,
        time: false,
        question1: false,
        description: false
    });

    const [bronzeProblems, setBronzeProblems] = useState([]);
    const [silverProblems, setSilverProblems] = useState([]);
    const [goldProblems, setGoldProblems] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProblems = async (rank, setProblems) => {
            try {
                const response = await fetch(`https://salgoo9.site/api/problem?rank=${rank}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'access': access_Token
                    }
                });
                const data = await response.json();
                if (data.status.code === 200) {
                    setProblems(data.results[0]);
                } else {
                    console.error('Failed to fetch problems:', data.status.message);
                }
            } catch (error) {
                console.error('Error fetching problems:', error);
            }
        };

        fetchProblems('BRONZE', setBronzeProblems);
        fetchProblems('SILVER', setSilverProblems);
        fetchProblems('GOLD', setGoldProblems);
    }, [access_Token]);

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
        if (!question1.title) {
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

        const selectedQuestions = [question1, question2, question3].filter(q => q.id);
        const totalDifficulty = selectedQuestions.reduce((acc, q) => acc + difficulties[q.level.toUpperCase()], 0);
        const average = totalDifficulty / selectedQuestions.length;
        const roundedAverage = Math.round(average * 10) / 10;

        const newChallenge = {
            roomTitle: roomName,
            averageDifficulty: roundedAverage,
            description,
            duration: (parseInt(hour) * 60) + parseInt(minute),
            problems: selectedQuestions.map(q => q.id)
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
        const selectedQuestions = [question1, question2, question3].filter(q => q.id);
        if (selectedQuestions.length === 0) return null;
        const totalDifficulty = selectedQuestions.reduce((acc, q) => acc + difficulties[q.level.toUpperCase()], 0);
        const average = totalDifficulty / selectedQuestions.length;
        const roundedAverage = Math.round(average);
        if (roundedAverage === 1) return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <BronzeIcon />
                <p style={{ margin: '0', color: '#a57939' }}>Bronze</p>
            </div>
        );
        if (roundedAverage === 2) return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <SilverIcon />
                <p style={{ margin: '0', color: '#8a8a8a' }}>Silver</p>
            </div>
        );
        if (roundedAverage === 3) return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <GoldIcon />
                <p style={{ margin: '0', color: '#cbbe2a' }}>Gold</p>
            </div>
        );
    };

    useEffect(() => {
        setAverageDifficulty(calculateAverageDifficulty());
    }, [question1, question2, question3]);

    const getProblems = (level) => {
        switch (level) {
            case 'BRONZE':
                return bronzeProblems;
            case 'SILVER':
                return silverProblems;
            case 'GOLD':
                return goldProblems;
            default:
                return [];
        }
    };

    const handleQuestionSelect = (num, level, title) => {
        const problems = getProblems(level);
        const selectedProblem = problems.find(problem => problem.title === title);
        const setQuestion = eval(`setQuestion${num}`);
        setQuestion({ title: selectedProblem.title, id: selectedProblem.id, level });
    };

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
                                            eval(`setQuestion${num}`)({ title: '', id: null, level: '' });
                                        }}
                                    >
                                        <option value="">난이도 선택</option>
                                        <option value="BRONZE">BRONZE</option>
                                        <option value="SILVER">SILVER</option>
                                        <option value="GOLD">GOLD</option>
                                    </select>
                                    <select
                                        value={eval(`question${num}`).title}
                                        onChange={(e) => handleQuestionSelect(num, eval(`level${num}`), e.target.value)}
                                    >
                                        <option value="">문제 선택</option>
                                        {getProblems(eval(`level${num}`)).map((problem, index) => (
                                            <option key={index} value={problem.title}>{problem.title}</option>
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
