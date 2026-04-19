import Groq from "groq";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function analyzeCleaningPhoto(base64Image: string): Promise<{
  cleanliness_improvement: number;
  description: string;
}> {
  try {
    const message = await groq.messages.create({
      model: "llama-2-90b-chat",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: base64Image,
              },
            },
            {
              type: "text",
              text: `この画像は掃除前後の比較写真です。以下のJSON形式で返してください：
{
  "cleanliness_improvement": 0-100の数値,
  "description": "改善内容の簡潔な説明（20文字以内）"
}

数値の目安：
- 90-100: すごく綺麗になった
- 70-89: かなり綺麗になった
- 50-69: 結構綺麗になった
- 30-49: まあまあ綺麗になった
- 10-29: ちょっと綺麗になった
- 0-9: ほぼ変わらない

JSONのみを返してください。`,
            },
          ],
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    const jsonStr = content.text.match(/\{[\s\S]*\}/)?.[0];
    if (!jsonStr) {
      throw new Error("No JSON found in response");
    }

    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error analyzing photo:", error);
    throw error;
  }
}
