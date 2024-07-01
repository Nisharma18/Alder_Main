
const data = JSON.parse(sessionStorage.getItem("user"));
const Token = data ? `Bearer ${data.jwtToken}` : '';
export default Token;
       