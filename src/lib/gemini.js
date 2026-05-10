import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export async function generateBaseSimulationContext(topic, panel, context, scale, apiKey) {
  if (!apiKey) throw new Error("Gemini API key is required.");
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          overallSentimentScore: { type: SchemaType.NUMBER },
          sentimentLabel: { type: SchemaType.STRING },
          topRisk: { type: SchemaType.STRING },
          strongestSupporter: { type: SchemaType.STRING },
          hiddenRisks: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.OBJECT, properties: { title: { type: SchemaType.STRING }, description: { type: SchemaType.STRING } } }
          },
          recommendedStrategy: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.OBJECT, properties: { title: { type: SchemaType.STRING }, description: { type: SchemaType.STRING } } }
          },
          sentimentData: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.OBJECT, properties: { name: { type: SchemaType.STRING }, value: { type: SchemaType.NUMBER } } }
          },
          agreementData: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.OBJECT, properties: { subject: { type: SchemaType.STRING }, A: { type: SchemaType.NUMBER }, fullMark: { type: SchemaType.NUMBER } } }
          },
          concernsData: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.OBJECT, properties: { name: { type: SchemaType.STRING }, count: { type: SchemaType.NUMBER } } }
          },
          personaProfilesToGenerate: {
            type: SchemaType.ARRAY,
            description: `Generate exactly ${scale} persona outlines based on the panel.`,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                id: { type: SchemaType.NUMBER },
                name: { type: SchemaType.STRING },
                role: { type: SchemaType.STRING }
              }
            }
          }
        },
        required: ["overallSentimentScore", "sentimentLabel", "topRisk", "strongestSupporter", "hiddenRisks", "recommendedStrategy", "sentimentData", "agreementData", "concernsData", "personaProfilesToGenerate"]
      }
    }
  });

  const prompt = `
    You are the orchestration engine for an educational decision simulation.
    Topic: "${topic}"
    Panel: "${panel}"
    Context: "${context}"
    Scale: ${scale} personas total.
    
    Generate the overall dashboard data (sentiment distributions, charts, risks).
    CRITICAL: Generate exactly ${scale} 'personaProfilesToGenerate' (names and roles only).
  `;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

export async function generateIndividualPersonaReaction(topic, context, personaOutline, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          sentiment: { type: SchemaType.STRING, description: "Support, Concerned, Neutral, Strongly Support, Strongly Oppose" },
          quote: { type: SchemaType.STRING, description: "A realistic 1-2 sentence first-person reaction to the topic." }
        },
        required: ["sentiment", "quote"]
      }
    }
  });

  const prompt = `
    Act as this specific stakeholder in a ${context} school context:
    Name: ${personaOutline.name}
    Role: ${personaOutline.role}
    
    The school is proposing the following decision/policy: "${topic}".
    
    How do you react? Provide your sentiment classification and a realistic first-person quote.
  `;

  // Adding a slight delay to help prevent rate-limiting on the free tier when batching
  await new Promise(resolve => setTimeout(resolve, 500));
  const result = await model.generateContent(prompt);
  const data = JSON.parse(result.response.text());
  
  return {
    ...personaOutline,
    sentiment: data.sentiment,
    quote: data.quote
  };
}
