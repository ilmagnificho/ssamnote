import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

// Response schema for structured AI output
const TransformResultSchema = z.object({
    refinedContent: z
        .string()
        .describe("Formal observation text in Korean, 3rd person, past tense"),
    interpretation: z
        .string()
        .describe("Brief developmental interpretation and teaching plan in Korean"),
});

export async function POST(request: NextRequest) {
    try {
        // Check for API key
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "OpenAI API key not configured" },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { rawContent, studentNames, domainTags } = body;

        if (!rawContent) {
            return NextResponse.json(
                { error: "rawContent is required" },
                { status: 400 }
            );
        }

        // Build context for AI
        const studentContext =
            studentNames && studentNames.length > 0
                ? `관련 유아: ${studentNames.join(", ")}`
                : "전체 학급 활동";

        const domainContext =
            domainTags && domainTags.length > 0
                ? `누리과정 영역: ${domainTags.join(", ")}`
                : "";

        // Generate structured response using GPT-4o
        const result = await generateObject({
            model: openai("gpt-4o"),
            schema: TransformResultSchema,
            prompt: `당신은 한국 어린이집/유치원 교사의 관찰 기록을 작성하는 전문가입니다.
누리과정(국가수준 유아교육과정)의 평가 언어 체계를 잘 알고 있습니다.

교사가 작성한 비공식적인 메모를 공식적인 평가 기록으로 변환해주세요.

## 규칙
1. 3인칭 과거형으로 작성 (예: "~하였다", "~보였다")
2. 객관적이고 긍정적인 톤 유지
3. 유아의 이름은 그대로 사용
4. 발달적 의미와 교사의 후속 지원 계획을 간단히 제시

## 입력 정보
- 교사 메모: "${rawContent}"
- ${studentContext}
${domainContext ? `- ${domainContext}` : ""}

## 출력
refinedContent: 공식 관찰 기록 (2-3문장)
interpretation: 발달적 해석 및 지원 계획 (1-2문장)`,
        });

        return NextResponse.json({
            refinedContent: result.object.refinedContent,
            interpretation: result.object.interpretation,
        });
    } catch (error) {
        console.error("Transform API error:", error);
        return NextResponse.json(
            { error: "Failed to transform content" },
            { status: 500 }
        );
    }
}
