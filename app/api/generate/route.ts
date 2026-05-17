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

/** Extract and parse a JSON object from a Claude response that may include
 *  multiple content blocks, markdown fences, and surrounding prose. */
function extractJsonObject(content: Anthropic.ContentBlock[]): unknown {
  // 1. Collect all text blocks (tool_use / tool_result blocks are ignored)
  const fullText = content
    .filter((c): c is Anthropic.TextBlock => c.type === "text")
    .map((c) => c.text)
    .join("\n");

  // 2. Strip markdown code fences (```json ... ``` or ``` ... ```)
  const stripped = fullText.replace(/```(?:json)?\s*/g, "").replace(/```/g, "");

  // 3. Extract the outermost JSON object by brace position
  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`No JSON object found in response. Raw text:\n${fullText.slice(0, 500)}`);
  }

  return JSON.parse(stripped.slice(start, end + 1));
}

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

IMPORTANT: Respond with ONLY a valid JSON object in this exact format — no prose, no markdown fences:
{"questions": ["Question 1?", "Question 2?", ...]}

Generate exactly ${spec.count} questions.`,
            },
          ],
        });

        const parsed = extractJsonObject(response.content) as { questions: string[] };
        if (!Array.isArray(parsed.questions)) {
          throw new Error(`Invalid questions format for ${round} round`);
        }

        return { round, questions: parsed.questions };
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
