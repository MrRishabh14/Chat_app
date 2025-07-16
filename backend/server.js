import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from "./routes/auth.routes.js"


dotenv.config();
const app = express();
const server = http.createServer(app); // needed for socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // your React frontend
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth",authRoutes);



// import messageRoutes from './routes/message.routes.js';

// app.use('/api/messages', messageRoutes);


//socket connection.

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('send-message', (message) => {
    socket.broadcast.emit('receive-message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});