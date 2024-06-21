import React from 'react';
import './Input.css';

const Input = ({ labelText, inputType = 'text', inputValue, handleChange, inputPlaceholder, hintMessage, hasError }) => {
    return (
        <div className="input">
            {labelText && <label className="input_label">{labelText}</label>}
            <input
                type={inputType}                // 입력 필드의 타입 (예: text, password, email 등)
                // 예시: <Input inputType="password" />
                value={inputValue}              // 입력 필드의 현재 값
                // 예시: <Input inputValue="John Doe" />
                onChange={handleChange}         // 입력 필드의 값이 변경될 때 호출되는 함수
                // 예시: <Input handleChange={(e) => setName(e.target.value)} />
                placeholder={inputPlaceholder}  // 입력 필드의 플레이스홀더 텍스트
                // 예시: <Input inputPlaceholder="Enter your name" />
                className={`input_field ${hasError ? 'input_error' : ''}`}  // 입력 필드의 클래스, 에러 상태일 경우 'input_error' 클래스 추가
                /// 예시: <Input hasError={true} />

            />
            {hintMessage && <span className={`input_hint ${hasError ? 'error_hint' : ''}`}>{hintMessage}</span>}
        </div>
    );
};

export default Input;