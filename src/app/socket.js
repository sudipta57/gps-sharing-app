import { io } from "socket.io-client";

const socket = io("https://gps-sharing-app-codewithsudipta.vercel.app/");

export { socket };
