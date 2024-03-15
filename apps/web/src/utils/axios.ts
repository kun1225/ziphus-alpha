import axios from 'axios';

// eslint-disable-next-line turbo/no-undeclared-env-vars
const baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT;

if (!baseURL) {
  throw new Error('NEXT_PUBLIC_API_ENDPOINT is not defined');
}

const axiosInstance = axios.create({ baseURL });

export default axiosInstance;