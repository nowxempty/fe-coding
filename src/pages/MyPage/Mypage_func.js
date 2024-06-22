export const Get_User_code = async (roomId,problemId,access_Token,user_name) => {
  const url = `https://salgoo9.site/api/myCode/${roomId}?problemId=${problemId}`
 
    const response = await fetch( url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'access': `${access_Token}`,
      }
    }).then(async response => {
      const responseData = await response.json();
      console.log(responseData);
      handle_Code_Response(responseData,user_name);
  });
};

export const Get_Problem = async (roomId,problemId,access_Token,setProblem,user_name) => {
  const url = `https://salgoo9.site/api/problem/${roomId}`;
  console.log('url',url);
  
    const response = await fetch( url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'access': `${access_Token}`,
      }
    }).then(async response => {
        const responseData = await response.json();
        const problem = findProblemById(responseData,problemId);
        setProblem(problem);
        localStorage.setItem(user_name + "problem", JSON.stringify(problem));
        handle_Code_Response(responseData,user_name);
  });
};

// 특정 id 값을 가진 문제를 찾기 위한 함수
const findProblemById = (response, problemId) => {
  for (const problemSet of response.results) {
      for (const problem of problemSet) {
          if (problem.id === problemId) {
              return problem;
          }
      }
  }
  return null;
};

const handle_Code_Response = (responseData,user_name) => {
  const statusCode = responseData.status.code;
  const message = responseData.status.message;
  
  switch (statusCode) {
    case 200:
        console.log( message);
        const code = responseData.results.code;
        localStorage.setItem(user_name + "code", JSON.stringify(code));
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
