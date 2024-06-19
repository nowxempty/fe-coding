import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';

import CodeEditorPage from "./pages/CodeEditor/CodeEditorPage";
import FeedbackPage from "./pages/Feedback/FeedbackPage";
// import ChallengeListPage from "./pages/ChallengeList/ChallengListPage";
// import WaitingRoomPage from "./pages/WaitingRoom";
// import LoginPage from "./pages/Login";
// import JoinPage from "./pages/Join";
// import MyPage from "./pages/MyPage";
// import InformPage from "./pages/MyPage/InformPage";
// import CodePage from "./pages/MyPage/CodePage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/code-editor" element={<CodeEditorPage/>} />
        <Route path="/feedback" element={<FeedbackPage />} />
        {/* <Route path="/challengeList" element={<ChallengeListPage />} />
        <Route path="/waitingroom" element={<WaitingRoomPage />} />
        <Route path="/Login" element={<LoginPage/>} />
        <Route path="/Join" element={<JoinPage/>} />
        <Route path="/MyPage" element={<MyPage/>} />
        <Route path="/InformPage" element={<InformPage />} />
        <Route path="/CodePage" element={<CodePage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;