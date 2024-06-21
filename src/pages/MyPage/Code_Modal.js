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

  const problemData = problem.context;
  
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
                <span>{problemData}</span>
              </div>
              <div className="CodePage_codeContainer">
                  <Editor 
                    className='codeEditor'
                    language= "javascript"
                    value={codes}
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
