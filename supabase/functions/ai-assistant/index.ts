import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { runAgent } from "./agent.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AIRequest {
  feature: "email" | "meeting" | "task" | "research" | "chat";
  input: string;
  context?: Record<string, string>;
}

const SYSTEM_PROMPTS: Record<string, string> = {
  email:
    "You are a professional business writing assistant specializing in corporate email communication. Write clear, polished, and effective emails tailored to the specified tone and audience. Always include a subject line, appropriate greeting, structured body, and professional sign-off.",
  meeting:
    "You are an expert meeting facilitator and note-taker. You excel at extracting key information from raw meeting notes and organizing them into clear, actionable summaries. Focus on accuracy, clarity, and identifying concrete action items and deadlines.",
  task:
    "You are a productivity expert and schedule optimizer. You help professionals prioritize tasks using proven frameworks like Eisenhower Matrix and time-blocking. Provide practical, actionable schedules with clear reasoning.",
  research:
    "You are a knowledgeable business research analyst. You provide comprehensive, well-structured research summaries with practical insights. Focus on accuracy, relevance, and actionable takeaways for business professionals.",
  chat:
    "You are a helpful AI workplace productivity assistant. You assist professionals with work tasks, productivity, communication, career development, and professional challenges. Be concise, practical, and supportive.",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body: AIRequest = await req.json();

    if (!body.feature || !body.input) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: feature and input",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const systemPrompt = SYSTEM_PROMPTS[body.feature] ?? SYSTEM_PROMPTS.chat;

    // Use LangChain agent for orchestration
    const output = await runAgent(body.feature, body.input, systemPrompt);

    return new Response(JSON.stringify({ output }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
