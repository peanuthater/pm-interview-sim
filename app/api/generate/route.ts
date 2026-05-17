import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ROUND_SPECS = {
  HR: {
    count: 5,
    instructions:
      "Generate 5 HR screening questions. Focus on: motivation for role, career goals, salary/availability, culture fit, and background alignment with the JD.",
  },
  Behavioral: {
    count: 8,
    instructions:
      "Generate 8 behavioral interview questions using STAR-method situations. Cover: leadership, conflict resolution, prioritization, data-driven decisions, cross-functional collaboration, failure/learnings, stakeholder management, product intuition. Reference specific experiences from the resume where relevant.",
  },
  Case: {
    count: 3,
    instructions:
      "Generate 3 PM case study questions. Cover: product design/improvement, metrics & analytics, and go-to-market or prioritization strategy. Ground them in the company's domain from the JD.",
  },
};

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jdText } = await req.json();

    if (!resumeText || !jdText) {
      return NextResponse.json(
        { error: "Missing resumeText or jdText" },
        { status: 400 }
      );
    }

    const context = `
CANDIDATE RESUME:
${resumeText.slice(0, 3000)}

JOB DESCRIPTION:
${jdText.slice(0, 2000)}
`.trim();

    const roundKeys = ["HR", "Behavioral", "Case"] as const;

    const results = await Promise.all(
      roundKeys.map(async (round) => {
        const spec = ROUND_SPECS[round];
        const response = await client.messages.create({
          model: "claude-opus-4-6",
          max_tokens: 2000,
          tools: [{ type: "web_search_20250305", name: "web_search" } as never],
          messages: [
            {
              role: "user",
              content: `You are a senior PM hiring manager. You have the following candidate context:

${context}

Use web search to find the latest PM interview trends and what this specific company (inferred from the JD) looks for in candidates.

Then, ${spec.instructions}

Tailor each question directly to the candidate's background and the specific role/company in the JD.

Return ONLY a JSON array of question strings, no extra text. Example:
["Question 1?", "Question 2?"]

Generate exactly ${spec.count} questions.`,
            },
          ],
        });

        const textContent = response.content.find((c) => c.type === "text");
        if (!textContent || textContent.type !== "text") {
          throw new Error(`No text response for ${round} round`);
        }

        const jsonMatch = textContent.text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          throw new Error(`Could not parse questions for ${round} round`);
        }

        const questions: string[] = JSON.parse(jsonMatch[0]);
        return { round, questions };
      })
    );

    const allQuestions = results.flatMap(({ round, questions }) =>
      questions.map((text, idx) => ({
        id: `${round}-${idx}`,
        round,
        text,
        status: "pending" as const,
        attempts: 0,
      }))
    );

    return NextResponse.json({ questions: allQuestions });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
