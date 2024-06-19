import React, { useEffect, useState } from 'react';
import Editor from "@monaco-editor/react";
import './CodeEditorPage.css';
import CodeEditorPageHeader from './CodeEditorPageHeader';
import RankingModal from './Ranking-Modal/RankingModal';
import FeedbackPage from '../Feedback/FeedbackPage';

const DEFAULT_CODE = {
  java: `public static String solution(String input){
    String answer="";

    return answer;
}`,
  python: `def solution(input):
    answer = ""

    return answer`,
  javascript: `function solution(input) {
    let answer = "";

    return answer;
}`
};

const CodeEditorPage = ({ userId, room_Id }) => {
  const [code, setCode] = useState(DEFAULT_CODE.java);
  const [result, setResult] = useState('');
  const [problems, setProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [language, setLanguage] = useState('java');
  const [isLoading, setIsLoading] = useState(true);
  const [showFeedbackPage, setShowFeedbackPage] = useState(false);
  const [roomId, setRoomId] = useState(0); //test용

  useEffect(() => {
    const fetchCreateRoom = async () => {
      try {
        const response = await fetch('https://salgoo9.site/api/rooms', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'access': 'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsInVzZXJuYW1lIjoidGVzdDIyMjIxIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3MTg3Nzk4NjksImV4cCI6MTcxODg2NjI2OX0.z132XII5M0Z1B8y33GP0I5oaH8JADg0GTqr0kCnivZo'
          },
          body: JSON.stringify({
            roomTitle: "재빈테스트",
            averageDifficulty: 2,
            description: "재빈테스트방입니다",
            roomStatus: "ONGOING",
            duration: 50,
            problems: [14, 15, 16]
          }),
        });

        if (!response.ok) {
          throw new Error('Error in runCode');
        }

        const data = await response.json();
        const roomId = data.id;
        setRoomId(roomId);

        fetchProblems(roomId);
      } catch (error) {
        console.log("Error fetchingCreateRoom", error);
      }
    };

    const fetchProblems = async (roomId) => {
      try {
        const response = await fetch(`https://salgoo9.site/api/problem/${roomId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'access': 'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsInVzZXJuYW1lIjoidGVzdDIyMjIxIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3MTg3Nzk4NjksImV4cCI6MTcxODg2NjI2OX0.z132XII5M0Z1B8y33GP0I5oaH8JADg0GTqr0kCnivZo'
          },
        });
        const data = await response.json();
        setProblems(data.results);
        setIsLoading(false);
        setTimerActive(true);
      } catch (error) {
        console.error('Error fetching problems', error);
        setIsLoading(false);
      }
    };

    fetchCreateRoom();
  }, []);

  useEffect(() => {
    let timerHandle;
    if (timerActive) {
      timerHandle = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timerHandle);
  }, [timerActive]);

  useEffect(() => {
    setCode(DEFAULT_CODE[language]);
  }, [currentProblemIndex, language]);

  const runCode = async () => {
    try {
      const response = await fetch('https://salgoo9.site/api/code/run', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'access': 'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsInVzZXJuYW1lIjoidGVzdDIyMjIxIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3MTg3Nzk4NjksImV4cCI6MTcxODg2NjI2OX0.z132XII5M0Z1B8y33GP0I5oaH8JADg0GTqr0kCnivZo'
        },
        body: JSON.stringify({
          roomId: roomId, //room_id
          problemId: problems[0][currentProblemIndex]?.id, //problems[currentProblemIndex]?.id,
          code: code,
          compileLanguage: language,
          time: time,
        }),
      });

      if (!response.ok) {
        throw new Error('Error in runCode');
      }

      const data = await response.json();
      const results = data.results || [];
      setResult(JSON.stringify(results, null, 2));
    } catch (error) {
      setResult(String(error));
    }
  };

  const submitCode = async () => {
    setTimerActive(false);
    try {
      const response = await fetch('https://salgoo9.site/api/code/submit', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'access': 'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsInVzZXJuYW1lIjoidGVzdDIyMjIxIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3MTg3Nzk4NjksImV4cCI6MTcxODg2NjI2OX0.z132XII5M0Z1B8y33GP0I5oaH8JADg0GTqr0kCnivZo'
        },
        body: JSON.stringify({
          roomId: roomId,  //room_Id
          problemId: problems[0][currentProblemIndex]?.id, //problems[currentProblemIndex]?.id,
          code: code,
          compileLanguage: language,
          time: time,
        })
      });

      if (!response.ok) {
        throw new Error('Error in submitCode');
      }

      setIsRankingModalOpen(true);

    } catch (error) {
      setResult(String(error));
    }
  };

  const handleCloseModal = () => {
    setIsRankingModalOpen(false);
    setShowFeedbackPage(true);
  };
  

  const handleFeedbackComplete = () => {
    setShowFeedbackPage(false);
    if (currentProblemIndex + 1 < problems[0].length) {
        const newIndex = currentProblemIndex + 1;
        setCurrentProblemIndex(newIndex);
        setCode(DEFAULT_CODE[language]);
        setResult('');
        setTime(0);
        setTimerActive(true);
    } else {
        // 모든 문제가 끝난 경우
        console.log('All problems completed');
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(DEFAULT_CODE[newLanguage]);
  };

  if (showFeedbackPage) {
    return <FeedbackPage userId={6} roomId={roomId} problemId={problems[0][currentProblemIndex]?.id} currentProblemIndex={currentProblemIndex} onComplete={handleFeedbackComplete} />;
  //userId 부분 수정
  }

  return (
    <div className="code-editor-page">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <CodeEditorPageHeader
            runCode={runCode}
            submitCode={submitCode}
            time={time}
            handleLanguageChange={handleLanguageChange}
            selectedLanguage={language}
            currentProblemIndex={currentProblemIndex}
          />
          <div className="content">
            <div className="grid-container">
              <div className="problem-container">
                <h2>Problem</h2>
                <h3>{problems[0][currentProblemIndex]?.title}</h3>
                <div>{problems[0][currentProblemIndex]?.context}</div>
                <div>
                    <div>{problems[0][currentProblemIndex]?.input}</div>
                    <div>{problems[0][currentProblemIndex]?.output}</div>
                </div>
                <div>{problems[0][currentProblemIndex]?.testCases.map((testCase, index) => (
                  <li key={index}>
                    <strong>Input:</strong> {testCase.input}<br />
                    <strong>Output:</strong> {testCase.output}
                  </li>
                ))}</div>
              </div>
              <div className="right-section">
                <div className="editor-container">
                  <Editor
                      height="50vh"
                      width="65vw"
                      language={language}
                      value={code}
                      theme="vs-dark"
                      onChange={(value, event) => setCode(value)}
                    />
                </div>
                <div className="result-container">
                  <h3>Result</h3>
                  <pre className="resultValue">{result}</pre>
                </div>
              </div>
            </div>
          </div>
          <RankingModal
            isOpen={isRankingModalOpen}
            onClose={handleCloseModal}
            roomId={roomId} //room_Id
            problemId={problems[0][currentProblemIndex]?.id}
          />
        </>
      )}
    </div>
  );
};
  

export default CodeEditorPage;
