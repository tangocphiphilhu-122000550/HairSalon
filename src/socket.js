// socket.js

const socketIo = require("socket.io"); 

let io; 

function initSocket(server) { 
  io = socketIo(server, { 
    cors: { 
      origin: [ 
        process.env.FRONTEND_URL || "https://hair-salon-forntend.vercel.app", 
        "http://localhost:3000", // Cho phép cả localhost 
      ], 
      methods: ["GET", "POST"], 
      credentials: true, 
    }, 
  }); 

  io.on("connection", (socket) => { 
    console.log("Client connected:", socket.id); 
    
    socket.on("disconnect", () => { 
      console.log("Client disconnected:", socket.id); 
    }); 
  }); 

  return io; 
} 

function getIo() { 
  if (!io) { 
    throw new Error("Socket.io not initialized! Please call initSocket first."); 
  } 
  return io; 
} 

module.exports = { 
  initSocket, 
  getIo 
};
