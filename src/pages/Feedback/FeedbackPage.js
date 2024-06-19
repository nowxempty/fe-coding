import React, { useEffect, useState } from 'react';
import Chatting from '../../components/Chatting/Chatting'
import './FeedbackPage.css';

const FeedbackPage = ({ roomId, problemId, currentProblemIndex, userId, onComplete }) => {
  const [problems, setProblems] = useState(null);
  const [feedbackData, setFeedbackData] = useState([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [selectedUserCode, setSelectedUserCode] = useState('');


  useEffect(() => {
    const fetchProblems = async () => {
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
      } catch (error) {
        console.error('Error fetching problems in FeedbackPage', error);
      }
    };

    const fetchFeedbackData = async () => {
      try {
        const response = await fetch('https://salgoo9.site/api/code', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'access': 'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsInVzZXJuYW1lIjoidGVzdDIyMjIxIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3MTg3Nzk4NjksImV4cCI6MTcxODg2NjI2OX0.z132XII5M0Z1B8y33GP0I5oaH8JADg0GTqr0kCnivZo'
          },
          body: JSON.stringify({
            roomId: roomId,
            problemId: problemId,
          }),
        });
        const data = await response.json();
        setFeedbackData(data.results);
      } catch (error) {
        console.error('Error fetching FeedbackData', error);
      }
    };
    
    fetchProblems();
    fetchFeedbackData();
  }, [problemId, roomId]);

  const handleCompleteClick = async () => { //API 개발 완료 되면 수정
    try {
      const response = await fetch('https://yourserver.com/api/feedback/complete', {
        method: 'POST',  // 수정: GET -> POST
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'access': 'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsInVzZXJuYW1lIjoidGVzdDIyMjIxIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3MTg3Nzk4NjksImV4cCI6MTcxODg2NjI2OX0.z132XII5M0Z1B8y33GP0I5oaH8JADg0GTqr0kCnivZo'
        },
        body: JSON.stringify({
          roomId: roomId,
          problemId: problemId,
        }),
      });

      if (!response.ok) {
        throw new Error('Error Fetching handleCompleteClick');
      }
    } catch (error) {
      console.error('Error Fetching handleCompleteClick', error);
    }

    const intervalId = setInterval(async () => { //API 개발 완료 되면 수정
      try {
        const response = await fetch(`https://yourserver.com/api/feedback/status?roomId=${roomId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'access': 'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsInVzZXJuYW1lIjoidGVzdDIyMjIxIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3MTg3Nzk4NjksImV4cCI6MTcxODg2NjI2OX0.z132XII5M0Z1B8y33GP0I5oaH8JADg0GTqr0kCnivZo'
          }
        });
        const data = await response.json();
        if (data.allUsersCompleted) {
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
    const userData = feedbackData[index];
    setSelectedUserCode(userData ? userData.code : '');
  };

  

  return (
    <div className="feedback-page">
      <div className="feedback-header">
        <div className="feedback-header-left">
          {feedbackData && feedbackData.map((feedback, index) => (
            <button
              key={index}
              onClick={() => handleUserClick(index)}
            >
              {feedback.userName}
            </button>
          ))}
        </div>
        <div className="feedback-header-right">
          <button onClick={handleCompleteClick}>피드백 완료</button>
          <div className="user-profile">{userId}</div>
        </div>
      </div>
      <div className="feedback-content">
        <div className="problem-container">
          {problems && problems[currentProblemIndex] && (
            <>
              <h2>문제</h2>
              <h3>{problems[currentProblemIndex].title}</h3>
              <div>{problems[currentProblemIndex].context}</div>
              <div>
                <div><strong>입력:</strong> {problems[currentProblemIndex].input}</div>
                <div><strong>출력:</strong> {problems[currentProblemIndex].output}</div>
              </div>
              <div>
                {problems[currentProblemIndex].testCases && problems[currentProblemIndex].testCases.map((testCase, index) => (
                  <li key={index}>
                    <strong>Input:</strong> {testCase.input}<br />
                    <strong>Output:</strong> {testCase.output}
                  </li>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="code-container">
          {selectedUserIndex !== null && (
            <>
              <h2>{feedbackData[selectedUserIndex].userName}의 코드</h2>
              <pre>{selectedUserCode}</pre>
            </>
          )}
        </div>
        <div className="chat-container">
          <Chatting />
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
