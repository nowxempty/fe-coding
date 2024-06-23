import React, { useEffect, useState } from 'react';
import Editor from "@monaco-editor/react";
import './CodeEditorPage.css';
import CodeEditorPageHeader from './CodeEditorPageHeader';
import AllCompletedModal from './CodeEditor-Modal/AllCompletedModal';
import RankingModal from './CodeEditor-Modal/RankingModal';
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

const CodeEditorPage = ({ userId, roomId, access_Token }) => {
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
  const [isAllCompletedModalOpen, setIsAllCompletedModalOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);


  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch(`https://salgoo9.site/api/problem/${roomId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'access': access_Token
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
  }, [userId, roomId, access_Token]);

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
    setIsRunning(true);
    setResult('컴파일 진행중입니다...');
    try {
      const response = await fetch('https://salgoo9.site/api/code/run', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'access': access_Token
        },
        body: JSON.stringify({
          roomId: roomId,
          problemId: problems[0][currentProblemIndex]?.id,
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
      setResult("컴파일 오류가 발생하였습니다. 코드를 다시 확인해 주세요.");
    } finally {
    setIsRunning(false);
  }
  };

  const submitCode = async () => {
    setIsRunning(true);
    setResult('코드를 제출중입니다...');
    setTimerActive(false);
    try {
      const response = await fetch('https://salgoo9.site/api/code/submit', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'access': access_Token
        },
        body: JSON.stringify({
          roomId: roomId,  
          problemId: problems[0][currentProblemIndex]?.id,
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
    } finally {
      setIsRunning(false);
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
        setIsAllCompletedModalOpen(true);   
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(DEFAULT_CODE[newLanguage]);
  };

  if (showFeedbackPage) {
    return <FeedbackPage userId={userId} roomId={roomId} problemId={problems[0][currentProblemIndex]?.id} currentProblemIndex={currentProblemIndex} onComplete={handleFeedbackComplete} access_Token={access_Token} />;
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
            isRunning={isRunning}
          />
          <div className="content">
            <div className="grid-container">
              <div className="problem-container">
                <h3>문제: {problems[0][currentProblemIndex]?.title}</h3>
                <hr />
                <div>{problems[0][currentProblemIndex]?.context}</div>
                <div className="Input-Output">
                  <h3>입력</h3>
                  <hr />
                  <div>{problems[0][currentProblemIndex]?.input}</div>
                  <h3>출력</h3>
                  <hr />
                  <div>{problems[0][currentProblemIndex]?.output}</div>
                </div>
                <h3>입출력 예시</h3>
                <hr />
                <div>
                  {problems[0][currentProblemIndex]?.testCases.map((testCase, index) => (
                    <li key={index}>
                      <strong>Input:</strong> {testCase.input}<br />
                      <strong>Output:</strong> {testCase.output}
                    </li>
                  ))}
                </div>
              </div>
              <div className="right-section">
                <div className="editor-container">
                  <Editor
                    height="50vh"
                    width="65vw"
                    language={language}
                    value={code}
                    theme="light"
                    onChange={(value, event) => setCode(value)}
                  />
                </div>
                <div className="result-container">
  <h3>Result</h3>
  <div className="result-overflow">
  {(() => {
    try {
      const parsedResult = JSON.parse(result);
      return (
        <div>
          {parsedResult.map((item, index) => (
            <div key={index} className="result-item">
              <p>잘못된 카운트 횟수: {item.wrongCount}</p>
              {item.wrongCount === 0 ? (
                <p>정답입니다!</p>
              ) : (
                item.testCase && (
                  <>
                    <p>테스트 케이스</p>
                    <pre>
                    {Object.entries(item.testCase).map(([key, value]) => (
                <div key={key} className="test-case-container">
                    <div className="test-case-item">
                        <span className="test-case-input">Input: {key}</span>
                        <span className="test-case-output">Output: {value}</span>
                    </div>
                </div>
            ))}
                    </pre>
                  </>
                )
              )}
            </div>
          ))}
        </div>
      );
    } catch (error) {
      return <div>{result}</div>;
    }
  })()}
</div>
</div>
              </div>
            </div>
          </div>
          <RankingModal
            isOpen={isRankingModalOpen}
            onClose={handleCloseModal}
            roomId={roomId}
            problemId={problems[0][currentProblemIndex]?.id}
            access_Token={access_Token}
          />
          <AllCompletedModal
            isOpen={isAllCompletedModalOpen}
            onClose={() => setIsAllCompletedModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default CodeEditorPage;