import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ROUND_SPECS = {
  HR: {
    count: 5,
    instructions:
      "Generate 5 HR screening questions. Focus on: motivation for role, career goals, salary/availability, culture fit, basic background. Keep them concise and realistic.",
  },
  Behavioral: {
    count: 8,
    instructions:
      "Generate 8 behavioral interview questions using STAR-method situations. Cover: leadership, conflict resolution, prioritization, data-driven decisions, cross-functional collaboration, failure/learnings, stakeholder management, product intuition.",
  },
  Case: {
    count: 3,
    instructions:
      "Generate 3 PM case study questions. Cover: product design/improvement, metrics & analytics, and go-to-market or prioritization strategy. Make them specific and challenging.",
  },
};

export async function POST(req: NextRequest) {
  try {
    const { candidateName, targetRole, targetCompany } = await req.json();

    if (!candidateName || !targetRole || !targetCompany) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const context = `Candidate: ${candidateName}, Target Role: ${targetRole} at ${targetCompany}`;

    // Run all three round generations in parallel with web_search tool
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
              content: `You are a senior PM hiring manager at a top tech company. Context: ${context}.

First, use web search to find the latest PM interview trends, common questions, and what ${targetCompany} specifically looks for in ${targetRole} candidates.

Then, ${spec.instructions}

Return ONLY a JSON array of question strings, no extra text. Example format:
["Question 1?", "Question 2?", "Question 3?"]

Generate exactly ${spec.count} questions tailored to the candidate's context.`,
            },
          ],
        });

        // Extract the final text response (after tool use)
        const textContent = response.content.find((c) => c.type === "text");
        if (!textContent || textContent.type !== "text") {
          throw new Error(`No text response for ${round} round`);
        }

        // Parse the JSON array from the response
        const jsonMatch = textContent.text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          throw new Error(`Could not parse questions for ${round} round`);
        }

        const questions: string[] = JSON.parse(jsonMatch[0]);
        return { round, questions };
      })
    );

    // Build question objects
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
