import { Page, BrowserContext, Browser } from '@playwright/test';
import { z } from 'zod';
import Browserbase from '@browserbasehq/sdk';
import { ClientOptions as ClientOptions$2 } from '@anthropic-ai/sdk';
import { Tool } from '@anthropic-ai/sdk/resources';
import { ClientOptions as ClientOptions$1 } from 'openai';
import { ChatCompletionTool } from 'openai/resources';

type LogLine = {
    id?: string;
    category?: string;
    message: string;
    level?: 0 | 1 | 2;
    timestamp?: string;
    auxiliary?: {
        [key: string]: {
            value: string;
            type: "object" | "string" | "html" | "integer" | "float" | "boolean";
        };
    };
};

type AvailableModel = "gpt-4o" | "gpt-4o-mini" | "gpt-4o-2024-08-06" | "claude-3-5-sonnet-latest" | "claude-3-5-sonnet-20241022" | "claude-3-5-sonnet-20240620";
type ModelProvider = "openai" | "anthropic";
type ClientOptions = ClientOptions$1 | ClientOptions$2;
type ToolCall = Tool | ChatCompletionTool;

interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: ChatMessageContent;
}
type ChatMessageContent = string | (ChatMessageImageContent | ChatMessageTextContent)[];
interface ChatMessageImageContent {
    type: "image_url";
    image_url: {
        url: string;
    };
    text?: string;
}
interface ChatMessageTextContent {
    type: string;
    text: string;
}
interface ChatCompletionOptions {
    messages: ChatMessage[];
    temperature?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    image?: {
        buffer: Buffer;
        description?: string;
    };
    response_model?: {
        name: string;
        schema: any;
    };
    tools?: ToolCall[];
    tool_choice?: string;
    maxTokens?: number;
    requestId: string;
}
declare abstract class LLMClient {
    modelName: AvailableModel;
    hasVision: boolean;
    constructor(modelName: AvailableModel);
    abstract createChatCompletion(options: ChatCompletionOptions): Promise<any>;
    abstract logger: (message: {
        category?: string;
        message: string;
    }) => void;
}

declare class LLMProvider {
    private modelToProviderMap;
    private logger;
    private enableCaching;
    private cache;
    constructor(logger: (message: LogLine) => void, enableCaching: boolean);
    cleanRequestCache(requestId: string): void;
    getClient(modelName: AvailableModel, clientOptions?: ClientOptions): LLMClient;
}

interface ConstructorParams {
    env: "LOCAL" | "BROWSERBASE";
    apiKey?: string;
    projectId?: string;
    verbose?: 0 | 1 | 2;
    debugDom?: boolean;
    llmProvider?: LLMProvider;
    headless?: boolean;
    logger?: (message: LogLine) => void;
    domSettleTimeoutMs?: number;
    browserBaseSessionCreateParams?: Browserbase.Sessions.SessionCreateParams;
    enableCaching?: boolean;
    browserbaseResumeSessionID?: string;
    modelName?: AvailableModel;
    modelClientOptions?: ClientOptions;
}
interface InitOptions {
    modelName?: AvailableModel;
    modelClientOptions?: ClientOptions;
    domSettleTimeoutMs?: number;
}
interface InitResult {
    debugUrl: string;
    sessionUrl: string;
}
interface InitResult {
    debugUrl: string;
    sessionUrl: string;
}
interface InitFromPageOptions {
    page: Page;
    modelName?: AvailableModel;
    modelClientOptions?: ClientOptions;
}
interface InitFromPageResult {
    context: BrowserContext;
}
interface ActOptions {
    action: string;
    modelName?: AvailableModel;
    modelClientOptions?: ClientOptions;
    useVision?: "fallback" | boolean;
    variables?: Record<string, string>;
    domSettleTimeoutMs?: number;
}
interface ActResult {
    success: boolean;
    message: string;
    action: string;
}
interface ExtractOptions<T extends z.AnyZodObject> {
    instruction: string;
    schema: T;
    modelName?: AvailableModel;
    modelClientOptions?: ClientOptions;
    domSettleTimeoutMs?: number;
}
type ExtractResult<T extends z.AnyZodObject> = z.infer<T>;
interface ObserveOptions {
    instruction?: string;
    modelName?: AvailableModel;
    modelClientOptions?: ClientOptions;
    useVision?: boolean;
    domSettleTimeoutMs?: number;
}
interface ObserveResult {
    selector: string;
    description: string;
}

interface BrowserResult {
    browser?: Browser;
    context: BrowserContext;
    debugUrl?: string;
    sessionUrl?: string;
    contextPath?: string;
}

declare class PlaywrightCommandException extends Error {
    constructor(message: string);
}
declare class PlaywrightCommandMethodNotSupportedException extends Error {
    constructor(message: string);
}

declare class Stagehand {
    private llmProvider;
    private llmClient;
    page: Page;
    context: BrowserContext;
    private env;
    private apiKey;
    private projectId;
    private verbose;
    private debugDom;
    private headless;
    private logger;
    private externalLogger?;
    private domSettleTimeoutMs;
    private browserBaseSessionCreateParams?;
    private enableCaching;
    private variables;
    private browserbaseResumeSessionID?;
    private contextPath?;
    private actHandler?;
    private extractHandler?;
    private observeHandler?;
    constructor({ env, apiKey, projectId, verbose, debugDom, llmProvider, headless, logger, browserBaseSessionCreateParams, domSettleTimeoutMs, enableCaching, browserbaseResumeSessionID, modelName, modelClientOptions, }?: ConstructorParams);
    init({ modelName, modelClientOptions, domSettleTimeoutMs, }?: InitOptions): Promise<InitResult>;
    initFromPage({ page, modelName, modelClientOptions, }: InitFromPageOptions): Promise<InitFromPageResult>;
    private pending_logs_to_send_to_browserbase;
    private is_processing_browserbase_logs;
    log(logObj: LogLine): void;
    private _run_browserbase_log_processing_cycle;
    private _log_to_browserbase;
    private _waitForSettledDom;
    private startDomDebug;
    private cleanupDomDebug;
    act({ action, modelName, modelClientOptions, useVision, variables, domSettleTimeoutMs, }: ActOptions): Promise<ActResult>;
    extract<T extends z.AnyZodObject>({ instruction, schema, modelName, modelClientOptions, domSettleTimeoutMs, }: ExtractOptions<T>): Promise<ExtractResult<T>>;
    observe(options?: ObserveOptions): Promise<ObserveResult[]>;
    close(): Promise<void>;
}

export { type ActOptions, type ActResult, type AvailableModel, type BrowserResult, type ClientOptions, type ConstructorParams, type ExtractOptions, type ExtractResult, type InitFromPageOptions, type InitFromPageResult, type InitOptions, type InitResult, type LogLine, type ModelProvider, type ObserveOptions, type ObserveResult, PlaywrightCommandException, PlaywrightCommandMethodNotSupportedException, Stagehand, type ToolCall };
