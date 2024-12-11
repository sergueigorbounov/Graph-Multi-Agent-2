import { AIMessageChunk, type BaseMessage } from "@langchain/core/messages";
import { BaseLanguageModelInput, StructuredOutputMethodOptions } from "@langchain/core/language_models/base";
import { CallbackManagerForLLMRun } from "@langchain/core/callbacks/manager";
import { BaseChatModel, BaseChatModelCallOptions, BindToolsInput, LangSmithParams, type BaseChatModelParams } from "@langchain/core/language_models/chat_models";
import { ChatGenerationChunk, ChatResult } from "@langchain/core/outputs";
import { TextChatParameterTools, TextChatParams, TextChatResponseFormat, TextChatToolCall } from "@ibm-cloud/watsonx-ai/dist/watsonx-ai-ml/vml_v1.js";
import { WatsonXAI } from "@ibm-cloud/watsonx-ai";
import { Runnable } from "@langchain/core/runnables";
import { z } from "zod";
import { WatsonxAuth, WatsonxParams } from "../types/ibm.js";
export interface WatsonxDeltaStream {
    role?: string;
    content?: string;
    tool_calls?: TextChatToolCall[];
    refusal?: string;
}
export interface WatsonxCallParams extends Partial<Omit<TextChatParams, "modelId" | "toolChoice">> {
    maxRetries?: number;
}
export interface WatsonxCallOptionsChat extends Omit<BaseChatModelCallOptions, "stop">, WatsonxCallParams {
    promptIndex?: number;
    tool_choice?: TextChatParameterTools | string | "auto" | "any";
}
type ChatWatsonxToolType = BindToolsInput | TextChatParameterTools;
export interface ChatWatsonxInput extends BaseChatModelParams, WatsonxParams, WatsonxCallParams {
    streaming?: boolean;
}
export declare class ChatWatsonx<CallOptions extends WatsonxCallOptionsChat = WatsonxCallOptionsChat> extends BaseChatModel<CallOptions> implements ChatWatsonxInput {
    static lc_name(): string;
    lc_serializable: boolean;
    get lc_secrets(): {
        [key: string]: string;
    };
    get lc_aliases(): {
        [key: string]: string;
    };
    getLsParams(options: this["ParsedCallOptions"]): LangSmithParams;
    model: string;
    version: string;
    maxTokens: number;
    maxRetries: number;
    serviceUrl: string;
    spaceId?: string;
    projectId?: string;
    frequencyPenalty?: number;
    logprobs?: boolean;
    topLogprobs?: number;
    n?: number;
    presencePenalty?: number;
    temperature?: number;
    topP?: number;
    timeLimit?: number;
    maxConcurrency?: number;
    service: WatsonXAI;
    responseFormat?: TextChatResponseFormat;
    streaming: boolean;
    constructor(fields: ChatWatsonxInput & WatsonxAuth);
    _llmType(): string;
    invocationParams(options: this["ParsedCallOptions"]): {
        maxTokens: number;
        temperature: number | undefined;
        timeLimit: number | undefined;
        topP: number | undefined;
        presencePenalty: number | undefined;
        n: number | undefined;
        topLogprobs: number | undefined;
        logprobs: boolean | NonNullable<CallOptions["logprobs"]> | undefined;
        frequencyPenalty: number | undefined;
        tools: TextChatParameterTools[] | undefined;
        responseFormat: CallOptions["responseFormat"] | undefined;
    };
    bindTools(tools: ChatWatsonxToolType[], kwargs?: Partial<CallOptions>): Runnable<BaseLanguageModelInput, AIMessageChunk, CallOptions>;
    scopeId(): {
        projectId: string;
        modelId: string;
        spaceId?: undefined;
    } | {
        spaceId: string | undefined;
        modelId: string;
        projectId?: undefined;
    };
    completionWithRetry<T>(callback: () => T, options?: this["ParsedCallOptions"]): Promise<T>;
    _generate(messages: BaseMessage[], options: this["ParsedCallOptions"], runManager?: CallbackManagerForLLMRun): Promise<ChatResult>;
    _streamResponseChunks(messages: BaseMessage[], options: this["ParsedCallOptions"], _runManager?: CallbackManagerForLLMRun): AsyncGenerator<ChatGenerationChunk>;
    /** @ignore */
    _combineLLMOutput(): never[];
    withStructuredOutput<RunOutput extends Record<string, any> = Record<string, any>>(outputSchema: z.ZodType<RunOutput> | Record<string, any>, config?: StructuredOutputMethodOptions<false>): Runnable<BaseLanguageModelInput, RunOutput>;
    withStructuredOutput<RunOutput extends Record<string, any> = Record<string, any>>(outputSchema: z.ZodType<RunOutput> | Record<string, any>, config?: StructuredOutputMethodOptions<true>): Runnable<BaseLanguageModelInput, {
        raw: BaseMessage;
        parsed: RunOutput;
    }>;
}
export {};
