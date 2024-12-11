import { LLMProvider } from "../llm/LLMProvider";
import { Stagehand } from "../index";
import { z } from "zod";
import { LLMClient } from "../llm/LLMClient";
export declare class StagehandExtractHandler {
    private readonly stagehand;
    private readonly logger;
    private readonly waitForSettledDom;
    private readonly startDomDebug;
    private readonly cleanupDomDebug;
    private readonly llmProvider;
    private readonly llmClient;
    private readonly verbose;
    constructor({ stagehand, logger, waitForSettledDom, startDomDebug, cleanupDomDebug, llmProvider, llmClient, verbose, }: {
        stagehand: Stagehand;
        logger: (message: {
            category?: string;
            message: string;
            level?: number;
            auxiliary?: {
                [key: string]: {
                    value: string;
                    type: string;
                };
            };
        }) => void;
        waitForSettledDom: (domSettleTimeoutMs?: number) => Promise<void>;
        startDomDebug: () => Promise<void>;
        cleanupDomDebug: () => Promise<void>;
        llmProvider: LLMProvider;
        llmClient: LLMClient;
        verbose: 0 | 1 | 2;
    });
    extract<T extends z.AnyZodObject>({ instruction, schema, progress, content, chunksSeen, llmClient, requestId, domSettleTimeoutMs, }: {
        instruction: string;
        schema: T;
        progress?: string;
        content?: z.infer<T>;
        chunksSeen?: Array<number>;
        llmClient: LLMClient;
        requestId?: string;
        domSettleTimeoutMs?: number;
    }): Promise<z.infer<T>>;
}
