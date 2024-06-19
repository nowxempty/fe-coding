import React from 'react';

const FeedbackPageFooter = ({ feedbackData, onUserSelect }) => {
    return (
        <div className="feedback-page-footer">
          <div className="user-buttons">
            {feedbackData.map((data, index) => (
              <button key={index} onClick={() => onUserSelect(data.userName)}>
                {data.userName}
              </button>
            ))}
          </div>
        </div>
      );
};
    
export default FeedbackPageFooter;
