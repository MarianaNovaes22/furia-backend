import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { mensagem } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Você é um chatbot divertido e informativo da torcida da FURIA, um time brasileiro de CS:GO.",
          },
          {
            role: "user",
            content: mensagem,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "meu-chat-app",
        },
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content;

    if (!reply) {
      console.error("Resposta inválida da API:", response.data);
      return res.status(500).json({ reply: "Erro ao processar a mensagem." });
    }

    res.json({ reply });
  } catch (error) {
    console.error("Erro ao consultar o OpenRouter:", error.response?.data || error.message);
    res.status(500).json({ reply: "Erro ao processar a mensagem." });
  }
});

export default router;
