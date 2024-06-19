import React from 'react';

const FeedbackPageHeader = ({ selectedProblemIndex, problems, onProblemSelect }) => {
    return (
        <div className="feedback-page-header">
          <div className="header-top">
            <div className="profile">
              {/* 프로필 이미지 또는 이름 표시 */}
              <span>Profile</span>
            </div>
            <button className="close-button">X</button>
          </div>
          <div className="header-bottom">
            <button className="problem-select-button">문제 선택</button>
            <div className="problem-buttons">
              {problems.map((problem, index) => (
                <button
                  key={index}
                  className={index === selectedProblemIndex ? 'selected' : ''}
                  onClick={() => onProblemSelect(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
};
    
export default FeedbackPageHeader;
