import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Challenge_chart from './ChallengeList/Challenge_chart';
import Lastest_Chart from '../../components/Lastest_Chart/Lastest_Chart';
import Userinfo from '../../components/User_info/User_info';
import Rank_list from '../../components/Rank_list/Rank_list';
import Create_Modal from './Create_Modal/Create_Modal';

const ChallengeMainpage = ({access_Token ,setAccessToken,userInfoms}) => {
    const [modalOpen, setModalOpen] = useState(false);//false로 수정

    const user = {
        name: "홍길동",
        level: 10,
        rank: 1,
        score: 1000,
        challenges: 1000
    };

    return (
        <div style={{width:'100%',height:'100%'}}>
            <Header access_Token={access_Token} setAccessToken={setAccessToken} image={userInfoms.profileImage} name={userInfoms.userName} level = {userInfoms.level} />
            <div style={{display:'flex', gap:'10px',justifyContent:'center'}}>
                <Challenge_chart access_Token={access_Token}/>
                <div>
                    <Lastest_Chart setModalOpen={setModalOpen} access_Token={access_Token} />
                    <Userinfo 
                        access_Token={access_Token} 
                        name={user.name} 
                        level={user.level} 
                        rank={user.rank}
                        score={user.score}
                        challenges={user.challenges} />
                    <Rank_list access_Token={access_Token}/>
                </div>
            </div>
            {modalOpen && <Create_Modal setmodalopen={setModalOpen} access_Token={access_Token} />}
        </div>
    );
};

export default ChallengeMainpage;
