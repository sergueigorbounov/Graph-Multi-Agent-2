var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { graph } from "./workflow/workflow.js";
import { HumanMessage } from "@langchain/core/messages";
let AppService = class AppService {
    async handleQuery(query) {
        const MAX_ITERATIONS = 25;
        const MAX_TOOL_FAILURES = 3;
        const toolFailures = new Map();
        if (!query || typeof query !== "string" || query.trim().length === 0) {
            throw new BadRequestException("Query must be a non-empty string.");
        }
        try {
            const streamResults = await graph.stream({
                messages: [new HumanMessage({ content: query })],
            });
            let iterationCount = 0;
            const processingDetails = [];
            let response = "Workflow completed.";
            let reasoning = "No reasoning provided.";
            let summary = "No summary provided.";
            for await (const output of streamResults) {
                iterationCount++;
                processingDetails.push({ iteration: iterationCount, supervisorState: output });
                if (iterationCount > MAX_ITERATIONS) {
                    return {
                        response: "Recursion limit reached. Workflow terminated.",
                        reasoning: "Too many iterations.",
                        summary: "Workflow stopped due to recursion limit.",
                        processingDetails,
                    };
                }
                // Handle specific tool failures
                const currentTool = output.next;
                if (currentTool && currentTool !== "__end__") {
                    const failures = (toolFailures.get(currentTool) || 0) + 1;
                    toolFailures.set(currentTool, failures);
                    if (failures > MAX_TOOL_FAILURES) {
                        return {
                            response: "The tool failed too many times.",
                            reasoning: `${currentTool} exceeded the maximum retries.`,
                            summary: "Workflow terminated after tool failures.",
                            processingDetails,
                        };
                    }
                }
                if (output.next === "__end__")
                    break;
                if (output?.messages) {
                    response = output.messages[output.messages.length - 1]?.content || response;
                }
                reasoning = output.reasoning || reasoning;
                summary = output.summary || summary;
            }
            return { response, reasoning, summary, processingDetails };
        }
        catch (error) {
            if (error instanceof BadRequestException)
                throw error;
            throw new InternalServerErrorException("An error occurred while processing the query.");
        }
    }
};
AppService = __decorate([
    Injectable()
], AppService);
export { AppService };
