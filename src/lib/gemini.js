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
            description: `Generate exactly ${scale} persona outlines.`,
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

export async function generateBulkPersonaReactions(topic, context, personaOutlines, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.ARRAY,
        description: "An array of reactions exactly matching the order of the provided outlines.",
        items: {
          type: SchemaType.OBJECT,
          properties: {
            id: { type: SchemaType.NUMBER, description: "Must match the original ID" },
            sentiment: { type: SchemaType.STRING, description: "Support, Concerned, Neutral, Strongly Support, Strongly Oppose" },
            quote: { type: SchemaType.STRING, description: "A realistic 1-2 sentence first-person reaction to the topic." }
          },
          required: ["id", "sentiment", "quote"]
        }
      }
    }
  });

  const stringifiedOutlines = JSON.stringify(personaOutlines, null, 2);

  const prompt = `
    Here is a list of stakeholder profiles in a ${context} school context:
    ${stringifiedOutlines}
    
    The school is proposing the following decision/policy: "${topic}".
    
    For EACH stakeholder in the list, act as them. How do they react? 
    Provide their sentiment classification and a realistic first-person quote.
    Return the array of reactions matching the IDs exactly.
  `;

  const result = await model.generateContent(prompt);
  const reactions = JSON.parse(result.response.text());
  
  // Merge outlines with their reactions
  return personaOutlines.map(outline => {
    const reaction = reactions.find(r => r.id === outline.id) || {};
    return {
      ...outline,
      sentiment: reaction.sentiment || "Neutral",
      quote: reaction.quote || "I need more information about this."
    };
  });
}
