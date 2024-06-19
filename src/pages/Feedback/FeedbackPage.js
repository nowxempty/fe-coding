import React, { useEffect, useState } from 'react';
import './FeedbackPage.css';
import FeedbackPageHeader from './FeedbackPageHeader';
import FeedbackPageFooter from './FeedbackPageFooter';

const FeedbackPage = ({ room_Id }) => {
    const [problemId, setProblemId] = useState(6);
    const [problems, setProblems] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [feedbackData, setFeedbackData] = useState([]);
    const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
    
    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await fetch('https://salgoo9.site/api/problem/6', { //`https://salgoo9.site/api/problem/${room_Id}`
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
                console.error('Error fetching problems', error);
            }
        };

        fetchProblems();
    }, [room_Id]);

    useEffect(() => {
        if (selectedUser) {
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
                            roomId: room_Id,
                            problemId: problemId,
                        })
                    });

                    const data = await response.json();
                    setFeedbackData(data.results);
                } catch (error) {
                    console.error('Error fetching feedback Data', error);
                }
            };

            fetchFeedbackData();
        }
    }, [selectedUser, problemId, room_Id]);

    const handleUserSelection = (userName) => {
        setSelectedUser(userName);
    };

    const handleProblemSelection = (index) => {
        setSelectedProblemIndex(index);
        setProblemId(problems[index]?.id);
    };

    return (
        <div className="feedback-page">
          <FeedbackPageHeader
            selectedProblemIndex={selectedProblemIndex}
            problems={problems}
            onProblemSelect={handleProblemSelection}
          />
          <div className="content">
            <div className="problem-container">
              <h2>Problem</h2>
              {problems.length > 0 && problems[selectedProblemIndex] ? (
                <>
                  <h3>{problems[selectedProblemIndex].title}</h3>
                  <div>{problems[selectedProblemIndex].context}</div>
                </>
              ) : (
                <p>Loading problem...</p>
              )}
            </div>
            <div className="code-container">
              <h2>Code</h2>
              {feedbackData.length > 0 && selectedUser ? (
                feedbackData.map((data, index) => (
                  data.userName === selectedUser && (
                    <pre key={index}>{data.code}</pre>
                  )
                ))
              ) : (
                <p>Select a user to view their code</p>
              )}
            </div>
            <div className="chat-container">
              <h2>Chat</h2>
              <p>Chat will be displayed here.</p>
            </div>
          </div>
          <FeedbackPageFooter
            feedbackData={feedbackData}
            onUserSelect={handleUserSelection}
          />
        </div>
      );
};
    
export default FeedbackPage;
