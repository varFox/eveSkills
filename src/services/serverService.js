import axios from 'axios';
import Cookies from 'universal-cookie';

export const refreshToken = async (token) => {
  
  localStorage.clear();
  localStorage.setItem('autorization', '');
  const response = await axios.get(`http://127.0.0.1:3000/info?token=${token}`)
  return response;
  
};

export const logoutUser = async () => {

  const response = await axios.get(`http://127.0.0.1:3000/info?logout=true`)
  const cookies = new Cookies();
  cookies.remove('connect.sid', { path: '/' });
  return response;
};