import { Annotation, END } from "@langchain/langgraph";
export const AgentState = Annotation.Root({
    messages: Annotation({
        reducer: (x, y) => x.concat(y),
        default: () => [],
    }),
    next: Annotation({
        reducer: (x, y) => y ?? x ?? END,
        default: () => END,
    }),
});
