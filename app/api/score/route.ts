import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { RoundType } from "@/lib/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ROUND_RUBRICS: Record<RoundType, string> = {
  HR: `Score HR answers on:
- Clarity and professionalism (25pts)
- Genuine motivation and cultural fit signals (25pts)
- Conciseness and relevance (25pts)
- Honesty and self-awareness (25pts)`,

  Behavioral: `Score behavioral answers using STAR method on:
- Situation & Task clarity (20pts)
- Specific Actions taken (30pts)
- Measurable Results (30pts)
- Reflection & Learnings (20pts)`,

  Case: `Score PM case answers on:
- Problem framing & structure (25pts)
- User empathy & insight (20pts)
- Data-driven reasoning (20pts)
- Prioritization & trade-offs (20pts)
- Execution thinking (15pts)`,
};

export async function POST(req: NextRequest) {
  try {
    const { questionText, userAnswer, round, candidateName, targetRole } =
      await req.json();

    if (!questionText || !userAnswer || !round) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const rubric = ROUND_RUBRICS[round as RoundType];

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1000,
      system: `You are an expert PM interviewer evaluating candidates for ${targetRole} roles. Candidate: ${candidateName}.

Be honest, specific, and constructive. Do not inflate scores.`,
      messages: [
        {
          role: "user",
          content: `Interview Question (${round} Round):
"${questionText}"

Candidate's Answer:
"${userAnswer}"

${rubric}

Evaluate this answer and respond with ONLY valid JSON in this exact format:
{
  "score": <integer 0-100>,
  "verdict": "<Excellent|Good|Low Pass|Fail>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"],
  "model_answer_snippet": "<2-3 sentence example of what a strong answer would include>",
  "feedback": "<2-3 sentence overall feedback>"
}`,
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from scoring");
    }

    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse scoring response");
    }

    const scoring = JSON.parse(jsonMatch[0]);

    // Normalize score to 0-100
    const score = Math.max(0, Math.min(100, Math.round(scoring.score)));
    const status =
      score >= 76 ? "pass" : score >= 60 ? "low_pass" : "fail";

    return NextResponse.json({
      score,
      status,
      verdict: scoring.verdict,
      strengths: scoring.strengths || [],
      improvements: scoring.improvements || [],
      model_answer_snippet: scoring.model_answer_snippet || "",
      feedback: scoring.feedback || "",
    });
  } catch (error) {
    console.error("Score error:", error);
    return NextResponse.json(
      { error: "Failed to score answer" },
      { status: 500 }
    );
  }
}
