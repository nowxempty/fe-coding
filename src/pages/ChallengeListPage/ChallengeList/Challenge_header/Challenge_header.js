import React, { useState } from "react";
import Button from "../../../../components/Button/Button";
import "./Challenge_header.css";

const Challenge_header = ({ onSearch, onDifficultyChange }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [placeholderVisible, setPlaceholderVisible] = useState(true);
    const [selectedDifficulty, setSelectedDifficulty] = useState("난이도");

    const handleDropdownToggle = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchText(value);
        onSearch(value);
    };

    const handleFocus = () => {
        setPlaceholderVisible(false);
    };

    const handleBlur = () => {
        setPlaceholderVisible(true);
    };

    const handleMouseLeave = () => {
        setDropdownVisible(false);
    };

    const handleDifficultySelect = (difficulty) => {
        const displayDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
        setSelectedDifficulty(displayDifficulty);
        onDifficultyChange(difficulty.toLowerCase());
        setDropdownVisible(false);
    };

    return (
        <div className="challenge-header">
            <div className="dropdown" onMouseLeave={handleMouseLeave}>
                <Button className={"Button"} onClick={handleDropdownToggle} text={selectedDifficulty} />
                {dropdownVisible && (
                    <div className="dropdown-menu">
                        <div className="dropdown-item" onClick={() => handleDifficultySelect('난이도')}>전체 난이도</div>
                        <div className="dropdown-item" style={{ color: '#cc7620' }} onClick={() => handleDifficultySelect('bronze')}>Bronze</div>
                        <div className="dropdown-item" style={{ color: '#636088' }} onClick={() => handleDifficultySelect('silver')}>Silver</div>
                        <div className="dropdown-item" style={{ color: '#c6c62c' }} onClick={() => handleDifficultySelect('gold')}>Gold</div>
                        <div className="dropdown-item" style={{ color: '#38BB64' }} onClick={() => handleDifficultySelect('platinum')}>Platinum</div>
                    </div>
                )}
            </div>
            <input
                type="text"
                placeholder={placeholderVisible ? "방 이름을 입력하시오." : ""}
                value={searchText}
                onChange={handleSearchChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="search-input"
            />
        </div>
    );
};

export default Challenge_header;
