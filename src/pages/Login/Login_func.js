

export const LoginClick = (Id,password,navigate,setAccessToken,setUserInfo,setImage) => {
  // POST 요청 보내기
  //https://salgoo9.site/api/login
  post_Login_Data('https://salgoo9.site/api/login', {
    loginId: Id,
    password: password
  },navigate,setAccessToken,setUserInfo);
};
const post_Login_Data = async (url = '', data = {},navigate,setAccessToken,setUserInfo,setImage) => {
  // 데이터 유효성 검사
  if (!data.loginId || !data.password) {
      console.error('아이디와 비밀번호를 모두 입력해주세요.');
      return;
  }
  if (!/^[a-zA-Z0-9]+$/.test(data.loginId)) {
      console.error('아이디는 영문자와 숫자만 허용됩니다.');
      return;
  }
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(data.password)) {
      console.error('비밀번호는 영문자와 숫자를 포함하여 8자리 이상이어야 합니다.');
      return;
  }

  
  fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(async response => {   
    // 응답 데이터를 Promise로 반환
      const responseData = await response.json();
      // access_Token 추출
      const access_Token = response.headers.get('access');
      setAccessToken(access_Token);
      handle_Login_Response(responseData,navigate,data,access_Token,setUserInfo,setImage);
  });
}    

const Get_User_Inform = async (access_Token,setUserInfo,setImage,setName) => {

  const url = 'https://salgoo9.site/api/myInfo'
  try {
    const response = await fetch( url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'access': `${access_Token}`
      }
    }).then(async response => {
        const responseData = await response.json();
        // 로컬 스토리지에 결과 저장
          if (responseData.status && responseData.status.code === 200) {
            console.log('responseData',responseData);
            console.log('results',responseData.results);
            console.log('results',responseData.results[0]);
            setUserInfo(responseData.results[0]);    
            setImage(responseData.results[0].ProfileImage);
            setName(responseData.results[0].userName);
          } else {
              console.error('Invalid response status:', responseData.status);
          }
              
          });
} catch (error) {
    console.error('오류 발생:', error);
}};


const handle_Login_Response = (responseData,navigate,data,access_Token,setUserInfo) => {
  const statusCode = responseData.status.code;
  const message = responseData.status.message;

  switch (statusCode) {
    case 200:
        console.log( message);
        alert(message);
        navigate('/MyPage');
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


  

  