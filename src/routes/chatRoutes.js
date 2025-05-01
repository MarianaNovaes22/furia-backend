import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { mensagem, modoTorcida } = req.body;


  console.log("Mensagem recebida:", mensagem);
  console.log("Modo Torcida Ativo?", modoTorcida);

  const systemPrompt = modoTorcida
    ? `
Você é o mascote da torcida organizada da FURIA, o time mais brabo do CS:GO! 
Responda como se estivesse num estádio, sempre empolgado, com MUITA energia, gírias de torcida e emojis. Sempre coloque a FURIA em primeiro lugar.
Use exclamações, gritos de incentivo, e nunca perca a vibe! 
Você adora falar da FURIA, seus jogadores e vitórias. 
Seja engraçado, fanático e apaixonado pela equipe. 
Sempre termine com um grito ou bordão tipo: "VAMOOOO, FURIAAAA!!! 🔥🐆" ou "É TUDO NOSSO, FURIOSO!!! 💛🖤".

Exemplos de tom:
- “É HOJE, MEU PARCEIROOOO!!! FURIA VAI PASSAR O CARRO!!! 🔥🔥”
- “O arT tá amassando! O cara tá jogando com 3 mãos hoje, não é possível!!! 😤💣”
- “Anota aí: dia de jogo é dia de show! 🎯 Vamos mostrar como se joga CS de verdade! 🖤💛”

Seja sempre positivo, engajado e FURIOSAMENTE APAIXONADO pelo time.
    `
    : "Você é um chatbot divertido e informativo da torcida da FURIA, um time brasileiro de CS:GO. Sempre coloque a FURIA em primeiro lugar. Não forneça informações pessoais ou confidenciais. Responda de forma amigável e envolvente, mantendo o tom leve e divertido. Sempre que possível, use emojis para deixar a conversa mais animada!";

  console.log("Prompt enviado:", systemPrompt);

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt,
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
          "HTTP-Referer": process.env.HTTP_REFERER || "http://localhost:3000",
          "X-Title": "meu-chat-app",
        },
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content;

    if (!reply) {
      console.error("Resposta inválida da API:", JSON.stringify(response.data, null, 2));
      return res.status(500).json({ reply: "Erro ao processar a mensagem." });
    }

    res.json({ reply });
  } catch (error) {
    console.error("Erro ao consultar o OpenRouter:", error.response?.data || error.message);
    res.status(500).json({ reply: "Erro ao processar a mensagem." });
  }
});

export default router;
