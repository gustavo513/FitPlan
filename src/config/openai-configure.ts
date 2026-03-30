import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { ZodType } from 'zod';

const openai = new OpenAI();

const chatgptReq = async <T extends ZodType<any>>(message: string, schema: T) => {
    try {
      const response = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Eres un especialista en nutrición deportiva, recomposición corporal y entrenamiento de fuerza, con enfoque en fisicoculturismo y evidencia científica aplicada"
          },
          { 
            role: "user", 
            content: message 
          }
        ],
        response_format: zodResponseFormat(schema, 'plan_fitnes'),
        temperature: 0,
        max_tokens: 2000,
      });
      const results = response.choices[0].message.parsed;
      return results;
    } catch (error: any) {
      throw error;
    }
  };

  export default chatgptReq;