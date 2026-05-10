import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export async function generateSimulation(topic, panel, context, scale, apiKey) {
  if (!apiKey) {
    throw new Error("Gemini API key is required. Please set it in .env or provide it.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // We use gemini-2.5-flash for speed and cost-effectiveness in structured outputs
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          overallSentimentScore: { type: SchemaType.NUMBER, description: "Score from 0 to 100" },
          sentimentLabel: { type: SchemaType.STRING, description: "e.g., Cautiously Optimistic, Strongly Opposed" },
          topRisk: { type: SchemaType.STRING },
          strongestSupporter: { type: SchemaType.STRING },
          hiddenRisks: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                title: { type: SchemaType.STRING },
                description: { type: SchemaType.STRING }
              }
            }
          },
          recommendedStrategy: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                title: { type: SchemaType.STRING },
                description: { type: SchemaType.STRING }
              }
            }
          },
          sentimentData: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                name: { type: SchemaType.STRING, description: "e.g., Strongly Support, Support, Neutral, Concerned, Strongly Oppose" },
                value: { type: SchemaType.NUMBER }
              }
            }
          },
          agreementData: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                subject: { type: SchemaType.STRING },
                A: { type: SchemaType.NUMBER, description: "Score out of 100" },
                fullMark: { type: SchemaType.NUMBER, description: "Always 100" }
              }
            }
          },
          concernsData: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                name: { type: SchemaType.STRING },
                count: { type: SchemaType.NUMBER }
              }
            }
          },
          personas: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                id: { type: SchemaType.NUMBER },
                name: { type: SchemaType.STRING },
                role: { type: SchemaType.STRING },
                sentiment: { type: SchemaType.STRING },
                quote: { type: SchemaType.STRING }
              }
            }
          }
        },
        required: ["overallSentimentScore", "sentimentLabel", "topRisk", "strongestSupporter", "hiddenRisks", "recommendedStrategy", "sentimentData", "agreementData", "concernsData", "personas"]
      }
    }
  });

  const prompt = `
    You are the backend engine for a 'Parent + Teacher + Student Simulation Lab'.
    The user wants to stress-test an educational decision.
    Topic/Decision: "${topic}"
    Target Panel: "${panel}"
    School Context: "${context}"
    Simulation Scale: "${scale}"
    
    Based on the parameters above, generate a highly realistic, psychologically nuanced simulation response. 
    Ensure the data makes sense (e.g. if the context is IB, use IB terminology like PYP, MYP, DP). 
    Generate exactly ${scale} personas if possible, but for the sake of response length, generate a representative sample of 5 highly detailed personas.
    Ensure 'sentimentData' values sum up to 100.
  `;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  return JSON.parse(responseText);
}
