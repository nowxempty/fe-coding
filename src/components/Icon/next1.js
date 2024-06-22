import React from "react";

const Next1 = ({ className, onClick }) => {
  return (
    <svg
      className={`${className}`}
      fill="none"
      height="88"
      viewBox="0 0 56 88"
      width="56"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <path
        className="path"
        d="M30.0025 60.9615C30.6036 60.9628 31.1916 60.7856 31.6918 60.4524C32.192 60.1192 32.5818 59.645 32.8118 59.09C33.0419 58.535 33.1017 57.9242 32.9838 57.3352C32.8658 56.7462 32.5754 56.2054 32.1493 55.7816L20.34 43.9805L32.1493 32.1794C32.4313 31.8977 32.6549 31.5632 32.8075 31.1951C32.9601 30.827 33.0386 30.4325 33.0386 30.034C33.0386 29.6356 32.9601 29.2411 32.8075 28.873C32.6549 28.5049 32.4313 28.1704 32.1493 27.8886C31.8674 27.6069 31.5327 27.3834 31.1643 27.231C30.796 27.0785 30.4012 27 30.0025 27C29.6038 27 29.209 27.0785 28.8406 27.231C28.4722 27.3834 28.1375 27.6069 27.8556 27.8886L13.8994 41.8351C13.6172 42.1167 13.3933 42.4511 13.2405 42.8192C13.0877 43.1874 13.0091 43.582 13.0091 43.9805C13.0091 44.379 13.0877 44.7737 13.2405 45.1418C13.3933 45.5099 13.6172 45.8443 13.8994 46.1259L27.8556 60.0724C28.1372 60.3546 28.4718 60.5784 28.8403 60.731C29.2087 60.8836 29.6037 60.9619 30.0025 60.9615Z"
        fill="white"
      />
    </svg>
  );
};

export default Next1;