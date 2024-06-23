import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Chatting from '../../components/Chatting/Chatting'
import './FeedbackPage.css';

const FeedbackPage = ({ roomId, problemId, currentProblemIndex, userId, onComplete, access_Token }) => {
  const [problems, setProblems] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleteButtonDisabled, setIsCompleteButtonDisabled] = useState(false);
  const location = useLocation();
  const hostName = location.state?.hostName || '';

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
      } catch (error) {
        console.error('Error fetching problems in FeedbackPage', error);
      }
    };

    const fetchFeedbackData = async () => {
      try {
        const response = await fetch(`https://salgoo9.site/api/code/${roomId}?problemId=${problemId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'access': access_Token
          },
        });
        const data = await response.json();
        setFeedbackData(data.results);
      } catch (error) {
        console.error('Error fetching FeedbackData', error);
      }
    };
    
    fetchProblems();
    fetchFeedbackData();
    setIsLoading(false);
  }, [problemId, roomId, access_Token]);

  const handleCompleteClick = async () => {
    setIsCompleteButtonDisabled(true);
    try {
      const response = await fetch(`https://salgoo9.site/api/rooms/${roomId}/ready`, {
        method: 'POST', 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'access': access_Token
        },
      });

      if (!response.ok) {
        throw new Error('Error Fetching handleCompleteClick');
      }
    } catch (error) {
      console.error('Error Fetching handleCompleteClick', error);
    }

    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`https://salgoo9.site/api/rooms/${roomId}/feedback`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'access': access_Token
          }
        });
        const data = await response.json();
        const allUsersCompleted = data.results;
        if (allUsersCompleted[0]) {
          clearInterval(intervalId);
          onComplete();
        }
      } catch (error) {
        console.error('Error Get Complete', error);
      }
    }, 1000);
  };

  const handleUserClick = (index) => {
    setSelectedUserIndex(index);
  };

  return (
    <div className="feedback-page">
      {isLoading || problems.length === 0 || feedbackData.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="feedback-header">
            <div className="feedback-header-left">
              {feedbackData[0] && feedbackData[0].map((feedback, index) => (
                <button
                  key={index}
                  onClick={() => handleUserClick(index)}
                  className={selectedUserIndex === index ? 'selected-button' : ''}
                >
                  {feedback.userName}
                </button>
              ))}
            </div>
            <div className="feedback-header-right">
              <button onClick={handleCompleteClick} disabled={isCompleteButtonDisabled}>피드백 완료</button>
            </div>
          </div>
          {selectedUserIndex !== null && feedbackData[0][selectedUserIndex] && (
            <div className="feedback-content">
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
                <div>{problems[0][currentProblemIndex]?.testCases.map((testCase, index) => (
                  <li key={index}>
                    <strong>Input:</strong> {testCase.input}<br />
                    <strong>Output:</strong> {testCase.output}
                  </li>
                ))}</div>
              </div>
              <div className="code-container">
                <h2>{feedbackData[0][selectedUserIndex].userName}의 코드</h2>
                <pre>{feedbackData[0][selectedUserIndex].code}</pre>
              </div>
              <div className="chat-container">
                <Chatting access_Token={access_Token} roomId={roomId} userName={hostName || "Unknown"}/>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeedbackPage;
