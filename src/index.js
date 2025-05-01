import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
app.use(cors({
    origin: ["http://localhost:5173", "https://furia-chatbot-chi.vercel.app"],
}))
app.use(express.json());

app.use('/chat', chatRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
