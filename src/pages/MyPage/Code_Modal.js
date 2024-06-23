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
        if (storedCode === "null") {
          setcode("");
        }else {
          setcode(storedCode);
        }
      };
      fetchProblem();
      fetchCode();

      
    }
  }, [isOpen, user_name]);

  // 특수 문자 변환 함수
const convertSpecialChars = (str) => {
  const modifiedStr = str.slice(1, -1);
  return modifiedStr
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"');
};

  if (!problem) {
    return null;
  }



  const formattedCode = convertSpecialChars(code);

  return (
    isOpen && (
      <div className="Code_modal-background" onClick={onClose}>
        <div className="Code_modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="CodePage">
            <header className="CodePage_header">
              <div className="CodePage_timer">{item.durationTime}</div>
            </header>
            <div className="CodePage_container">
            <div className="CodePage_problem">
              <div className="problem-section">
                <span className='code_bold'>문제</span>
                <br /><br />
                <span className='code_context'>{problem.context}</span>
              </div>
              <div className="problem-section">
                <span className='code_bold'>입력</span>
                <br /><br />
                <span className='code_context'>{problem.input}</span>
              </div>
              <div className="problem-section">
                <span className='code_bold'>출력</span>
                <br /><br />
                <span className='code_context'>{problem.output}</span>
              </div>
              
            </div>

              <div className="CodePage_codeContainer">
                  <Editor 
                    className='codeEditor'
                    language= "javascript"
                    value={formattedCode}
                    theme="light"
                    options={{
                      readOnly: true,
                      quickSuggestions: false,
                      wordBasedSuggestions: false,
                      parameterHints: false,
                      suggestOnTriggerCharacters: false,
                      acceptSuggestionOnEnter: 'off',
                      tabCompletion: 'off',
                      wordWrap: 'on',
                      // 진단 비활성화
                      'semanticValidation': false,
                      'syntacticValidation': false
                    }}
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
