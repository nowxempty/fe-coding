// 엑세스 토큰 갱신 함수
// 해당 함수는 url에 대하여 엑세스 토큰을 다시 요청하는 저장하는 역할만 함
// 함수를 재실행하는건 오류가 난 함수에서 에러코드 401일때 재실행 하도록 구현
//https://salgoo9.site//api/reissue
export const refreshAccessToken = async (setAccessToken) => {

  const url = 'https://salgoo9.site/api/reissue'

  try {
    const response = await fetch( url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async response => {
        const responseData = await response.json();
        // access_Token 추출
        const access_Token = response.headers.get('access');
        setAccessToken(access_Token);
        console.log("second access token", access_Token);
    });
} catch (error) {
    console.error('오류 발생:', error);
}};
