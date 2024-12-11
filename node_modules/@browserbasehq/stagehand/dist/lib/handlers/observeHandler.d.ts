import { LogLine } from "../../types/log";
import { Stagehand } from "../index";
import { LLMClient } from "../llm/LLMClient";
import { LLMProvider } from "../llm/LLMProvider";
export declare class StagehandObserveHandler {
    private readonly stagehand;
    private readonly logger;
    private readonly waitForSettledDom;
    private readonly startDomDebug;
    private readonly cleanupDomDebug;
    private readonly llmProvider;
    private readonly verbose;
    private readonly llmClient;
    private observations;
    constructor({ stagehand, logger, waitForSettledDom, startDomDebug, cleanupDomDebug, llmProvider, verbose, llmClient, }: {
        stagehand: Stagehand;
        logger: (logLine: LogLine) => void;
        waitForSettledDom: (domSettleTimeoutMs?: number) => Promise<void>;
        startDomDebug: () => Promise<void>;
        cleanupDomDebug: () => Promise<void>;
        llmProvider: LLMProvider;
        verbose: 0 | 1 | 2;
        llmClient: LLMClient;
    });
    private _recordObservation;
    observe({ instruction, useVision, fullPage, llmClient, requestId, domSettleTimeoutMs, }: {
        instruction: string;
        useVision: boolean;
        fullPage: boolean;
        llmClient: LLMClient;
        requestId?: string;
        domSettleTimeoutMs?: number;
    }): Promise<{
        selector: string;
        description: string;
    }[]>;
}
