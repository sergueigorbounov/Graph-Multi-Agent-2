import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { JsonOutputToolsParser } from "langchain/output_parsers";
import { z } from "zod";
import { END } from "@langchain/langgraph";

interface SupervisorState extends Record<string, any> {
  agentSummaries?: string[]; // Add agentSummaries as an optional property
}

export const members = ["researcher", "cart_manager"] as const;

const systemPrompt = `
  You are a supervisor tasked with managing a conversation between the following workers: {members}.
  For each user request, respond with the worker to act next. Include reasoning for why this worker is chosen.
  Summarize the output from the worker in a user-friendly way.
  When the entire process is complete, respond with FINISH and a summary of all information from the workers.
`;

const options = [END, ...members];

const routingTool = {
  name: "route",
  description: "Select the next role and provide reasoning for the choice.",
  schema: z.object({
    next: z.enum([END, ...members]),
    reasoning: z.string(), // Include reasoning
    summary: z.string().optional(), // Include a summary of worker results
  }),
};

const prompt = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  new MessagesPlaceholder("messages"),
  [
    "system",
    "Given the conversation above, who should act next?" +
    " Or should we FINISH? Select one of: {options}",
  ],
]);

const formattedPrompt = await prompt.partial({
  options: options.join(", "),
  members: members.join(", "),
});

export const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o",
  temperature: 0,
});

let recursionCount = 0;
const MAX_RECURSION = 25;


// Initialize OpenAI API instance
const summarizationLLM = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4",
  temperature: 0.7,
});

export const supervisorChain = formattedPrompt
  .pipe(llm.bindTools(
    [routingTool],
    {
      tool_choice: "route",
    },
  ))
  .pipe(new JsonOutputToolsParser())
  .pipe(async (output, state: SupervisorState) => {
    // Initialize agent summaries if missing
    state.agentSummaries = state.agentSummaries || [];

    // Check recursion limits
    recursionCount++;
    if (recursionCount > MAX_RECURSION) {
      return {
        next: END,
        reasoning: "Recursion limit reached. Stopping the workflow.",
        summary: await generateFinalSummary(state.agentSummaries, summarizationLLM),
      };
    }

    const firstOutput = output[0];

    // Handle invalid outputs or no actions available
    if (!firstOutput || !firstOutput.args) {
      return {
        next: END,
        reasoning: "No valid actions determined. Stopping workflow.",
        summary: await generateFinalSummary(state.agentSummaries, summarizationLLM),
      };
    }

    // Capture agent responses for summarization
    if (firstOutput.args.summary) {
      state.agentSummaries.push(firstOutput.args.summary);
    }

    // End workflow if requested
    if (firstOutput.args.next === END) {
      return {
        next: END,
        reasoning: "Workflow completed successfully.",
        summary: await generateFinalSummary(state.agentSummaries, summarizationLLM),
      };
    }

    // Pass the next agent and reasoning
    return {
      next: firstOutput.args.next,
      reasoning: firstOutput.args.reasoning || "Reasoning not provided by agent.",
    };
  });


// Helper function to generate a polished summary using OpenAI
async function generateFinalSummary(agentSummaries: string[], llmInstance: ChatOpenAI): Promise<string> {
  if (agentSummaries.length === 0) {
    return "No meaningful actions or outputs were produced by the workflow.";
  }

  const completion = await llmInstance.call([
    {
      role: "system",
      content: "You are an assistant summarizing a complex workflow. Your task is to generate a clear, user-friendly summary of all information from all agents during this process.",
    },
    {
      role: "user",
      content: `Here are the details of all information from all the agents:\n\n${agentSummaries.join("\n\n")}\n\nSummarize this in a concise, readable format for the user.`,
    },
  ]);

  const result = completion.content;
  if (typeof result === "string") {
    return result.trim();
  } else if (Array.isArray(result)) {
    return result.map((item) => String(item)).join(" ").trim();
  } else {
    return "Unable to generate a proper summary. Please check the workflow logs for details.";
  }
}
