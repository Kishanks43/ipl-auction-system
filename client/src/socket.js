import { io } from "socket.io-client";

const socket = io(
  window.location.hostname === "localhost"
    ? "http://localhost:3001"
    : `http://${window.location.hostname}:3001`
);

export default socket;
