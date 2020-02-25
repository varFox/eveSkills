import axios from 'axios';

export const refreshToken = async (token) => {
  
  const response = await axios.get(`http://127.0.0.1:3000/info?token=${token}`);
  return response;
  
};

export const logoutUser = async () => {
  
  const response = await axios.get(`http://127.0.0.1:3000/info?logout=true`);
  return response;
  
};