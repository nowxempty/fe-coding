import React, { useState, useEffect } from 'react';
import './Code_Modal.css';
import Editor from '@monaco-editor/react'

const Modal = ({ isOpen, onClose, item, access_Token }) => {
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const Get_User_code = async (roomId, problemId, access_Token) => {
        const url = `https://salgoo9.site/api/myCode/${roomId}?problemId=${problemId}`;
       
        const fetchCode = async () => {
          const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'access': `${access_Token}`,
            }
          });
      
          const responseData = await response.json();
          const code = responseData.results[0].code;
          
          if (code === null) {
            // Retry after 3 seconds if code is null
            console.log('code is null');
          } else {
            handle_Code_Response(responseData);
          }
        };
      
        await fetchCode();
      };
      
      const Get_Problem = async (roomId, problemId, access_Token) => {
        const url = `https://salgoo9.site/api/problem/${roomId}`;
        
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'access': `${access_Token}`,
          }
        });

        const responseData = await response.json();
        const problem = findProblemById(responseData, problemId);
        setProblem(problem);
      };
      
      // 특정 id 값을 가진 문제를 찾기 위한 함수
      const findProblemById = (response, problemId) => {
        if (!response.results || !Array.isArray(response.results)) {
          console.error('Invalid response structure:', response);
          return null;
        }

        for (const problemSet of response.results) {
          for (const problem of problemSet) {
            if (problem.id === problemId) {
              return problem;
            }
          }
        }
        return null;
      };
      
      const handle_Code_Response = (responseData) => {
        const statusCode = responseData.status.code;
        const message = responseData.status.message;
        
        switch (statusCode) {
          case 200:
            const code = responseData.results[0].code;
            setCode(code);
            break;
          case 400:
          case 401:
            console.error(message);
            alert(message);
            break;
          default:
            console.error(message);
            alert(message);
            break;
        }
      };
      setProblem("");
      setCode("");
      // 실제 데이터 가져오기 호출
      Get_User_code(item.roomId, item.problemId, access_Token);
      Get_Problem(item.roomId, item.problemId, access_Token);

    }
  }, [isOpen, item.roomId, item.problemId, access_Token]);

  // 특수 문자 변환 함수
  const convertSpecialChars = (str) => {
    if (!str) return '';
    const modifiedStr = str.slice(1, -1);
    return modifiedStr
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"');
  };

  if (!problem) {
    return null;
  }

  const onClose_Modal = () => {
    setProblem(null);
    setCode(null);
    onClose();
  }

  const formattedCode = convertSpecialChars(code);

  return (
    isOpen && (
      <div className="Code_modal-background" onClick={onClose_Modal}>
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
                  language="javascript"
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
