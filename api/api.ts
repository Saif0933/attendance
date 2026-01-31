import axios from "axios";

// If you are using a physical device or emulator, "localhost" might not work.
// - Android Emulator: Use "http://10.0.2.2:8000/api/v1"
// - Physical Device: Use your machine's local IP (e.g., "http://192.168.1.10:8000/api/v1")
const BASE_URL = "http://192.168.1.6:5000/api/v1"; 

//192.168.1.9, localhost

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor for debugging
api.interceptors.request.use((request) => {
  console.log('Starting Request', JSON.stringify(request, null, 2));
  return request;
});

// Add a response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response;
  },
  (error) => {
    console.log('Response Error:', JSON.stringify(error, null, 2));
    return Promise.reject(error);
  }
);
