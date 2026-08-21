# LangChain.js Integration Guide

## Overview

This project now uses **LangChain.js** to power the AI assistant's agent orchestration. LangChain provides a framework for building composable, context-aware AI applications with tool-calling capabilities.

## What Changed

### New Files
- `supabase/functions/ai-assistant/agent.ts` - LangChain agent configuration and tool definitions
- `package.json` - Updated with LangChain dependencies

### Modified Files
- `supabase/functions/ai-assistant/index.ts` - Now uses `runAgent()` from LangChain instead of raw OpenAI API calls

## Installation

```bash
npm install
```

This will install:
- `langchain` - Core framework
- `@langchain/openai` - OpenAI provider
- `@langchain/core` - Core types and utilities

## Available Tools

The agent has access to the following tools:

### 1. **format_text**
- **Purpose**: Formats and structures text professionally
- **Use Case**: Email generation, document formatting

### 2. **extract_key_points**
- **Purpose**: Extracts key information and action items from text
- **Use Case**: Meeting summaries, research notes

### 3. **prioritize_tasks**
- **Purpose**: Organizes tasks using the Eisenhower Matrix framework
- **Use Case**: Task planning, workload prioritization

## How It Works

1. Frontend sends a request to the Supabase Edge Function
2. Edge Function receives the request and calls `runAgent()`
3. LangChain initializes the agent with:
   - OpenAI LLM (gpt-4o-mini)
   - Available tools
   - System prompt for the feature (email, meeting, task, etc.)
4. Agent processes the input and may invoke tools as needed
5. Final response is returned to the frontend

## Configuration

### Environment Variables

Required in Supabase Edge Function Secrets:
```
OPENAI_API_KEY=sk-...
```

### Agent Parameters

`supabase/functions/ai-assistant/agent.ts`:
- `modelName`: "gpt-4o-mini" (cost-effective free tier)
- `temperature`: 0.7 (balanced creativity/consistency)
- `maxTokens`: 1500 (response length limit)
- `maxIterations`: 5 (max agent steps)
- `agentType`: "zero-shot-react-description" (decision-making style)

## Extending with More Tools

To add new tools, update the `tools` array in `agent.ts`:

```typescript
const tools = [
  new DynamicTool({
    name: "tool_name",
    description: "What this tool does",
    func: async (input: string) => {
      // Tool implementation
      return result;
    },
  }),
  // ... more tools
];
```

Example: Adding a web search tool:

```typescript
new DynamicTool({
  name: "web_search",
  description: "Search the web for current information",
  func: async (query: string) => {
    const response = await fetch(`https://api.duckduckgo.com/?q=${query}`);
    return await response.text();
  },
})
```

## Testing

### Local Testing

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Test any feature (Email, Meeting, Task, Research, Chat)
   - The frontend will automatically use LangChain agent
   - No code changes needed on frontend

### With Supabase Functions

```bash
supabase functions deploy ai-assistant
```

## Troubleshooting

### "OPENAI_API_KEY is not configured"
- Verify the key is set in Supabase Edge Function Secrets
- Check the key is valid and has available quota

### "Agent execution failed"
- Check Supabase function logs for detailed error messages
- Verify input format matches expected schema

### Performance Issues
- Reduce `maxIterations` if responses are slow
- Consider using fewer, simpler tools
- Monitor OpenAI API usage and costs

## Next Steps

1. ✅ Basic LangChain integration (current)
2. 📋 Add memory for conversation context
3. 🔗 Integrate more external APIs (Wikipedia, News, etc.)
4. 🛠️ Create custom tools for specific workflows
5. 📊 Add usage tracking and analytics

## Resources

- [LangChain Documentation](https://js.langchain.com/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Agent Concepts](https://js.langchain.com/docs/modules/agents/)
