import { OpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicTool } from "@langchain/core/tools";

// Initialize the LLM with OpenAI
const llm = new OpenAI({
  openAIApiKey: Deno.env.get("OPENAI_API_KEY"),
  modelName: "gpt-4o-mini",
  temperature: 0.7,
  maxTokens: 1500,
});

// Define custom tools for your assistant
const tools = [
  new DynamicTool({
    name: "format_text",
    description:
      "Formats and structures text content professionally for the given purpose",
    func: async (input: string) => {
      return `Formatted content: ${input}`;
    },
  }),
  new DynamicTool({
    name: "extract_key_points",
    description:
      "Extracts key points, action items, and important information from text",
    func: async (input: string) => {
      return `Key points extracted: ${input}`;
    },
  }),
  new DynamicTool({
    name: "prioritize_tasks",
    description:
      "Prioritizes tasks using the Eisenhower Matrix (urgent/important framework)",
    func: async (input: string) => {
      return `Prioritized tasks: ${input}`;
    },
  }),
];

export async function runAgent(
  feature: string,
  userInput: string,
  systemPrompt: string
): Promise<string> {
  try {
    const agent = await initializeAgentExecutorWithOptions(tools, llm, {
      agentType: "zero-shot-react-description",
      verbose: false,
      maxIterations: 5,
    });

    const result = await agent.invoke({
      input: `${systemPrompt}\n\nUser request: ${userInput}`,
    });

    return result.output;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Agent execution failed";
    throw new Error(`LangChain Agent Error: ${message}`);
  }
}
