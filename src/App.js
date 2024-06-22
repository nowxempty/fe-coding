import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React,{useState} from 'react';

import MyPage from './pages/MyPage/MyPage.js';
import ChallengeList from "./pages/ChallengeListPage/ChallengeListPage";
import WaitingRoom from "./pages/WaitingRoom/WaitingRoom"
import LoginPage from "./pages/Login/Login.js";
import JoinPage from "./pages/Login/Join/Join.js";
import InformPage from "./pages/MyPage/InformPage/inform.js"

function App() {
  const [access_Token,setAccessToken] = useState('');
  const [userInfoms,setUserInfo] = useState(null);
  const [problem,setProblem] = useState(null);
  const [image,setImage] = useState(null);
  const [name,setName] = useState(null);
  return (
    <Router>
      <Routes>
      <Route path="/Login" element={<LoginPage setAccessToken={setAccessToken} setUserInfo={setUserInfo} setImage={setImage} setName={setName} />} />
        <Route path="/Join" element={<JoinPage/>} />
        <Route path="/MyPage" element={<MyPage userInfoms={userInfoms} access_Token={access_Token} setProblem={setProblem} setAccessToken={setAccessToken} setUserInfo={setUserInfo} image ={image} setName={setName} />} />
        <Route path="/InformPage" element={<InformPage userInfoms={userInfoms} setUserInfo={setUserInfo} access_Token={access_Token} setAccessToken={setAccessToken} image ={image} setImage={setImage} name={name} setName = {setName} />} />
        <Route path="/" element={<ChallengeList access_Token={access_Token} setAccessToken={setAccessToken} userInfoms={userInfoms}/>} /> 
        <Route path="/room/:roomId" element={<WaitingRoom access_Token={access_Token} setAccessToken={setAccessToken}/>} />
        {/* <Route path="/code-editor" element={<FeedbackPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

