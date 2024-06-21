
    //페이지를 이동하면 input 요소에 저장된 값을 초기화
    
    export const JoinClick = (Id, password, password_check,user_name,navigate) => {
        if (password !== password_check) {                        //회원 가입시 입력한 비번과 비번 확인용 input의 값이 동일한지 확인 
          alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');   
          return;                                               
      }
        // POST 요청 보내기
        post_Join_Data('https://salgoo9.site/api/join', {
          loginId: Id,
          password: password,
          name: user_name
        },navigate);
    };

    const post_Join_Data = async (url = '', data = {},navigate) => {
      // 데이터 유효성 검사
      if (!data.loginId || !data.password || !data.name) {
          console.error('입력 필드를 모두 작성해주세요.');
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
  
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
  
    const responseData = await response.json();
    handle_Join_Response(responseData,navigate);

  };
  const handle_Join_Response = (responseData,navigate) => {
    const statusCode = responseData.status.code;
    const message = responseData.status.message;

    switch (statusCode) {
        case 200:
            console.log('회원 가입 성공:', message);
            alert(message);
            navigate('/Login');                    //회원 가입 성공이 로그인 페이지로 이동
            // 회원 가입 성공 처리
            break;
        case 400:
            console.error('입력 오류:', message);
            alert(message);
            // 입력 오류 처리
            break;
        case 409:
            console.error('충돌 오류:', message);
            alert(message);
            // 충돌 오류 처리
            break;
        default:
            console.error('알 수 없는 오류:', message);
            alert(message);
            // 기타 오류 처리
            break;
    }
};