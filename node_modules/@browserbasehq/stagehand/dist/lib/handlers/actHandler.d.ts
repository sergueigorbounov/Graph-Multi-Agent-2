import { Stagehand } from "../index";
import { LLMProvider } from "../llm/LLMProvider";
import { LLMClient } from "../llm/LLMClient";
import { LogLine } from "../../types/log";
export declare class StagehandActHandler {
    private readonly stagehand;
    private readonly verbose;
    private readonly llmProvider;
    private readonly enableCaching;
    private readonly logger;
    private readonly waitForSettledDom;
    private readonly actionCache;
    private readonly llmClient;
    private readonly startDomDebug;
    private readonly cleanupDomDebug;
    private actions;
    constructor({ stagehand, verbose, llmProvider, enableCaching, logger, waitForSettledDom, llmClient, startDomDebug, cleanupDomDebug, }: {
        stagehand: Stagehand;
        verbose: 0 | 1 | 2;
        llmProvider: LLMProvider;
        enableCaching: boolean;
        logger: (logLine: LogLine) => void;
        waitForSettledDom: (domSettleTimeoutMs?: number) => Promise<void>;
        llmClient: LLMClient;
        startDomDebug: () => Promise<void>;
        cleanupDomDebug: () => Promise<void>;
    });
    private _recordAction;
    private _verifyActionCompletion;
    private _performPlaywrightMethod;
    private _getComponentString;
    private getElement;
    private _checkIfCachedStepIsValid_oneXpath;
    private _getValidCachedStepXpath;
    private _runCachedActionIfAvailable;
    act({ action, steps, chunksSeen, llmClient, useVision, verifierUseVision, retries, requestId, variables, previousSelectors, skipActionCacheForThisStep, domSettleTimeoutMs, }: {
        action: string;
        steps?: string;
        chunksSeen: number[];
        llmClient: LLMClient;
        useVision: boolean | "fallback";
        verifierUseVision: boolean;
        retries?: number;
        requestId?: string;
        variables: Record<string, string>;
        previousSelectors: string[];
        skipActionCacheForThisStep: boolean;
        domSettleTimeoutMs?: number;
    }): Promise<{
        success: boolean;
        message: string;
        action: string;
    }>;
}
