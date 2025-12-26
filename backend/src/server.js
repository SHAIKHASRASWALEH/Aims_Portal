import express from 'express';
import cookieParser from 'cookie-parser';
import studentRoutes from './routes/student.routes.js';
import courseRoutes from './routes/course.routes.js';
import facultyRoutes from './routes/faculty.routes.js';
import enrollmentRoutes from './routes/enrollment.routes.js';
import authRoutes from './routes/auth.routes.js';
import {sequelize} from './db/index.js';
import dotenv from "dotenv"
import cors from 'cors';
import { WebSocketServer } from 'ws';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true
}))

app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/faculty', facultyRoutes);
app.use('/api/v1/enrollment', enrollmentRoutes);
app.use('/api/v1/auth', authRoutes);

sequelize.sync()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      const wss = new WebSocketServer({ server });
      wss.on('connection', ws => {
        ws.on('message', message => {
          console.log(`Received message => ${message}`);
          wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`${message}`);
            }
        });
      });
    });
    });
  })
  .catch(error => console.error('Error starting server:', error));



