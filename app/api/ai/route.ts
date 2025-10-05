import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const client = new OpenAI({
	baseURL: "https://router.huggingface.co/v1",
	apiKey: process.env.HF_TOKEN,
});

export async function POST(request: NextRequest) {
	try {
		const { operation, content } = await request.json();

		if (!operation || !content) {
			return NextResponse.json({ error: "Missing operation or content" }, { status: 400 });
		}

		let prompt = "";
		const systemMessage = "You are a helpful AI assistant for content creation and editing.";

		switch (operation) {
			case "suggest-headline":
				prompt = `Based on the following content, suggest a compelling and SEO-friendly headline. Keep it under 60 characters. Content: ${content}`;
				break;
			case "fix-grammar":
				prompt = `Fix any grammar, spelling, and punctuation errors in the following text. Return only the corrected text without any additional comments: ${content}`;
				break;
			case "generate-summary":
				prompt = `Create a concise summary (2-3 sentences) of the following content: ${content}`;
				break;
			case "suggest-tags":
				prompt = `Based on the following content, suggest 4-6 relevant tags separated by commas. Focus on topics, technologies, and themes: ${content}`;
				break;
			case "improve-seo":
				prompt = `Analyze the following content and provide SEO improvement suggestions. Focus on keyword optimization, readability, and structure. Return suggestions as a numbered list: ${content}`;
				break;
			default:
				return NextResponse.json({ error: "Invalid operation" }, { status: 400 });
		}

		const chatCompletion = await client.chat.completions.create({
			model: "deepseek-ai/DeepSeek-V3.2-Exp:novita",
			messages: [
				{ role: "system", content: systemMessage },
				{ role: "user", content: prompt },
			],
		});

		const result = chatCompletion.choices[0].message.content;

		return NextResponse.json({ result });
	} catch (error) {
		console.error("AI API error:", error);
		return NextResponse.json({ error: "Failed to process AI request" }, { status: 500 });
	}
}