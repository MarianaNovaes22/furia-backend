import { askOpenAI } from '../services/openaiService.js';

export const handleChat = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Mensagem obrigatória.' });
  }

  try {
    const response = await askOpenAI(message);
    res.json({ reply: response });
  } catch (error) {
    console.error('Erro ao consultar a OpenAI:', error.message);
    res.status(500).json({ error: 'Erro ao se comunicar com a OpenAI' });
  }
};
