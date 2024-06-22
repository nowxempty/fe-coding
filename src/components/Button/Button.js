import React from "react";
import "./Button.css";

const Button = ({ className, divClassName, text, onClick, icon }) => {
    return (
        <button className={`button ${className}`} onClick={onClick}>
            <div className={`text ${divClassName}`}>
                {text}
                {icon && icon}
            </div>
        </button>
    );
};

export default Button;
