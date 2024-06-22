import React, { useState, useEffect } from 'react';
import './Code_Modal.css';
import Editor from '@monaco-editor/react'

const Modal = ({ isOpen, onClose, item, user_name }) => {
  const [problem, setProblem] = useState(null);
  const [code, setcode] = useState(null);
  useEffect(() => {
    if (isOpen) {
      const fetchProblem = async () => {
        const storedProblem = localStorage.getItem(user_name + "problem");
        if (storedProblem) {
          const parsedProblem = JSON.parse(storedProblem);
          setProblem(parsedProblem);
          console.log(parsedProblem);
        }
      };
      const fetchCode = async () => {
        const storedCode = localStorage.getItem(user_name + "code");
        if (storedCode) {
          setcode(storedCode);
          console.log(storedCode);
        }
      };
      fetchProblem();
      fetchCode();
    }
  }, [isOpen, user_name]);

  if (!problem) {
    return null;
  }

  const codes = `function add(a, b) {
    return a + b;
  }

  // Example usage
  const result = add(1, 2);
  console.log(result); // Output: 3
  `;

  return (
    isOpen && (
      <div className="Code_modal-background" onClick={onClose}>
        <div className="Code_modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="CodePage">
            <header className="CodePage_header">
              <div className="CodePage_timer">{item.durationTile}</div>
            </header>
            <div className="CodePage_container">
            <div className="CodePage_problem">
              <div className="problem-section">
                <span className='code_bold'>문제</span>
                <br /><br />
                <span>{problem.context}</span>
              </div>
              <div className="problem-section">
                <span className='code_bold'>입력</span>
                <br /><br />
                <span>{problem.input}</span>
              </div>
              <div className="problem-section">
                <span className='code_bold'>출력</span>
                <br /><br />
                <span>{problem.output}</span>
              </div>
            </div>

              <div className="CodePage_codeContainer">
                  <Editor 
                    className='codeEditor'
                    language= "javascript"
                    value={code}
                    theme="light"
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;
