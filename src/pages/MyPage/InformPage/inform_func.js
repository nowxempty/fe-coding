//회원탈퇴 기능 함수
export const handleDeleteAccount = (DeleteAccount) => {
  if (DeleteAccount !== "회원 탈퇴") {
    alert('회원탈퇴를 입력해주세요');
    return;
  }
  
  /*
  if (user) {
    try {
      await deleteUser(user);
      setSuccess(true);
      setError(null);
    } catch (err) {
      setError(err.message);
      setSuccess(false);
    }
  } else {
    setError("No user is signed in");
  }*/
};

export const Change_user_Inform = (Nickname,Password,Passwordcheck,access_Token,setUserInfo,setName) =>{
Put_User_name(Nickname,access_Token,setUserInfo,setName);
}

const Put_User_name = async (user_name,access_Token,setUserInfo,setName) => {
const url = 'https://salgoo9.site/api/myInfo/name'

try {
  const response = await fetch( url, {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ 'userName': user_name }),
    headers: {
      'Content-Type': 'application/json',
      'access': `${access_Token}`
    }
  }).then(async response => {
      const responseData = await response.json();
      handle_User_name_Response(responseData,user_name,setUserInfo,setName);
});
} catch (error) {
  console.error('오류 발생:', error);
}};

const handle_User_name_Response = (responseData,Nickname,setUserInfo,setName) => {
const statusCode = responseData.status.code;
const message = responseData.status.message;

switch (statusCode) {
  case 200:
    setUserInfo((prevState) => ({
      ...prevState,
      userName: Nickname,
    }));
    setName(Nickname);
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

export const uploadImage2 = async (image,access_Token) => {
try {
  
  const url = 'https://salgoo9.site/api/myInfo/image'
  const formData = new FormData();
  formData.append("image", image,image.name);
  console.log(formData);
  
  const response = await fetch( url, {
    method: 'PUT',
    body: formData,
    headers: {
      'access': access_Token,
      'Content-Type': 'multipart/form-data'
    },
    redirect: "follow"
  }).then(async response => {
      //const responseData = await response.json();
});
} catch (error) {
  console.error('오류 발생:', error);
}};

export const uploadImage = async (image,access_Token) => {
const myHeaders = new Headers();
myHeaders.append("access", access_Token);

const formdata = new FormData();
formdata.append("image", image, image.name);

const requestOptions = {
method: "PUT",
headers: myHeaders,
body: formdata,
redirect: "follow"
};

fetch("https://salgoo9.site/api/myInfo/image", requestOptions)
.then((response) => response.text())
.then((result) => console.log(result))
.catch((error) => console.error(error));
};