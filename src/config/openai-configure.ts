import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import Plan from '../types/openai.types';

const openai = new OpenAI();

const chatgptReq = async (message: string) => {
    try {
      const response = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Eres un experto en nutrición y entrenamiento"
          },
          { 
            role: "user", 
            content: message 
          }
        ],
        response_format: zodResponseFormat(Plan, 'plan_fitnes'),
        temperature: 0,
        max_tokens: 2000,
      });
      const plan = response.choices[0].message.parsed;
      return plan;
    } catch (error: any) {
      throw error;
    }
  };

  export default chatgptReq;