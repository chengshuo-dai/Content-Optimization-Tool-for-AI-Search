import OpenAI from "openai";

// Using the provided key directly as requested for this pure frontend MVP
const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || "sk-90029076eeca41369da5bdb394ce85f8";

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // Required for pure frontend app
});

export async function callDeepseek(prompt: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "deepseek-chat",
      response_format: { type: "json_object" }
    });

    return completion.choices[0].message.content || "{}";
  } catch (error) {
    console.error("Deepseek API Error:", error);
    throw error;
  }
}
