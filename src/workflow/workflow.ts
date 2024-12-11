import { supervisorChain } from "../agents/supervisor.agent.js"; // Import nodes
import { AgentState } from "../state/agent.state.js"; // Import state
import { members } from '../agents/supervisor.agent.js'
import { START, StateGraph } from "@langchain/langgraph";
import { tavilyNode } from "../agents/tavily.agent.js";
import { cartManagerNode } from "../agents/cartManager.agent.js";

 // 1. Create the graph
const workflow = new StateGraph(AgentState)
  // 2. Add the nodes
  .addNode("researcher", tavilyNode)
  .addNode("cart_manager", cartManagerNode)
  .addNode("supervisor", async (state, config) => {
    console.log("Supervisor executing with state:", state);

    const result = await supervisorChain.invoke(state, config);
    console.log("Supervisor result:", result);

    // Log detailed reasoning
    if (result.reasoning) {
      console.log("Reasoning:", result.reasoning);
    }

    return result;
  });
// 3. Define the edges. Regular and conditional ones
// After a worker completes, report to supervisor
members.forEach((member) => {
  workflow.addEdge(member, "supervisor");
});

workflow.addConditionalEdges(
  "supervisor",
  (x: typeof AgentState.State) => x.next,
);

workflow.addEdge(START, "supervisor");

export const graph = workflow.compile();