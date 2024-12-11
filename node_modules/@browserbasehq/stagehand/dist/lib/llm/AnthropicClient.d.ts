import { ClientOptions } from "@anthropic-ai/sdk";
import { LogLine } from "../../types/log";
import { AvailableModel } from "../../types/model";
import { LLMCache } from "../cache/LLMCache";
import { ChatCompletionOptions, LLMClient } from "./LLMClient";
export declare class AnthropicClient extends LLMClient {
    private client;
    private cache;
    logger: (message: LogLine) => void;
    private enableCaching;
    constructor(logger: (message: LogLine) => void, enableCaching: boolean, cache: LLMCache | undefined, modelName: AvailableModel, clientOptions?: ClientOptions);
    createChatCompletion(options: ChatCompletionOptions & {
        retries?: number;
    }): Promise<any>;
}
