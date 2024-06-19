import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from "@monaco-editor/react";
import './CodeEditorPage.css';
import CodeEditorPageHeader from './CodeEditorPageHeader';
import CodeEditorPageFooter from './CodeEditorPageFooter';
import RankingModal from './Ranking-Modal/RankingModal';

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
  const navigate = useNavigate();

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
    const fetchProblems = async () => {
      try {
        const response = await fetch('https://salgoo9.site/api/problem/6', { // `https://salgoo9.site/api/problem/${room_Id}`
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'access': 'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsInVzZXJuYW1lIjoiamhjOTkxMjE1MCIsInJvbGUiOiJST0xFX0FETUlOIiwiaWF0IjoxNzE4NzYyMjY3LCJleHAiOjE3MTg4NDg2Njd9.sySds2iFSry1YdXXNyBTwSH0E3R8dhmfsA2Is5jwx6I'
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

    fetchProblems();
  }, [userId, room_Id]);

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
          'access': 'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsInVzZXJuYW1lIjoiamhjOTkxMjE1MCIsInJvbGUiOiJST0xFX0FETUlOIiwiaWF0IjoxNzE4NzYyMjY3LCJleHAiOjE3MTg4NDg2Njd9.sySds2iFSry1YdXXNyBTwSH0E3R8dhmfsA2Is5jwx6I'
        },
        body: JSON.stringify({
          roomId: 12, //room_id
          problemId: 6, //problems[currentProblemIndex]?.id,
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
          'access': 'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsInVzZXJuYW1lIjoiamhjOTkxMjE1MCIsInJvbGUiOiJST0xFX0FETUlOIiwiaWF0IjoxNzE4NzYyMjY3LCJleHAiOjE3MTg4NDg2Njd9.sySds2iFSry1YdXXNyBTwSH0E3R8dhmfsA2Is5jwx6I'
        },
        body: JSON.stringify({
          roomId: 12,  //room_Id
          problemId: 6, //problems[currentProblemIndex]?.id,
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
    if (currentProblemIndex + 1 < problems[0].length) {
        const newIndex = currentProblemIndex + 1;
        setCurrentProblemIndex(newIndex);
        setCode(DEFAULT_CODE[language]);
        setResult('');
        setTime(0);
        setTimerActive(true);
    } else {
      navigate('/feedback');
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(DEFAULT_CODE[newLanguage]);
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
              <div className="editor-container">
                <Editor
                    height="90vh"
                    language={language}
                    value={code}
                    theme="vs-dark"
                    onChange={(value, event) => setCode(value)}
                  />
              </div>
              <div className="result-container">
                <h3>Result</h3>
                <pre>{result}</pre>
              </div>
            </div>
          </div>
          <CodeEditorPageFooter />
          <RankingModal
            isOpen={isRankingModalOpen}
            onClose={handleCloseModal}
            roomId={room_Id}
            problemId={problems[0][currentProblemIndex]?.id}
          />
        </>
      )}
    </div>
  );
};
  

export default CodeEditorPage;
