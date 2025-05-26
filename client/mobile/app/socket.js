import { io } from "socket.io-client";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.apiUrl;

const socket = io(API_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
