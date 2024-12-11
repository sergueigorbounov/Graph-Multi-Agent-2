import { z } from "zod";
import { LLMClient } from "./llm/LLMClient";
import { VerifyActCompletionParams } from "../types/inference";
import { ActResult, ActParams } from "../types/act";
export declare function verifyActCompletion({ goal, steps, llmClient, screenshot, domElements, logger, requestId, }: VerifyActCompletionParams): Promise<boolean>;
export declare function fillInVariables(text: string, variables: Record<string, string>): string;
export declare function act({ action, domElements, steps, llmClient, screenshot, retries, logger, requestId, variables, }: ActParams): Promise<ActResult | null>;
export declare function extract({ instruction, progress, previouslyExtractedContent, domElements, schema, llmClient, chunksSeen, chunksTotal, requestId, }: {
    instruction: string;
    progress: string;
    previouslyExtractedContent: any;
    domElements: string;
    schema: z.ZodObject<any>;
    llmClient: LLMClient;
    chunksSeen: number;
    chunksTotal: number;
    requestId: string;
}): Promise<any>;
export declare function observe({ instruction, domElements, llmClient, image, requestId, }: {
    instruction: string;
    domElements: string;
    llmClient: LLMClient;
    image?: Buffer;
    requestId: string;
}): Promise<{
    elements: {
        elementId: number;
        description: string;
    }[];
}>;
export declare function ask({ question, llmClient, requestId, }: {
    question: string;
    llmClient: LLMClient;
    requestId: string;
}): Promise<any>;
