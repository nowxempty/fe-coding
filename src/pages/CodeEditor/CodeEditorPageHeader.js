import React, { useState } from 'react';
import Icon from '../../components/Icon/Icon.svg';

const CodeEditorPageHeader = ({ runCode, submitCode, time, handleLanguageChange, selectedLanguage, currentProblemIndex }) => {
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectLanguage = (language) => {
    handleLanguageChange(language);
    setIsDropdownOpen(false);
  };

  return (
    <header className="code-editor-header">
      <div className="top-header">
        <div className="timer">Time: {time}s</div>
        <div className="actions">
          <button className="header-button" onClick={runCode}>Run Code</button>
          <button className="header-button" onClick={submitCode}>Submit Code</button>
          <div className="profile">
            <img src={Icon} alt="Icon" />
          </div>
        </div>
      </div>
      <div className="bottom-header">
        <div className="problem-indicator">문제 {currentProblemIndex + 1}</div>
        <div className="language-selector">
          <button onClick={toggleDropdown} className="header-button">
            Language: {selectedLanguage} ▼
          </button>
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li onClick={() => selectLanguage('java')}>Java</li>
              <li onClick={() => selectLanguage('python')}>Python</li>
              <li onClick={() => selectLanguage('javascript')}>JavaScript</li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default CodeEditorPageHeader;
