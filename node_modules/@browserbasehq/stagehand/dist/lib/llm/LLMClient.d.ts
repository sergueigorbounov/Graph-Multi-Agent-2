import { AvailableModel, ToolCall } from "../../types/model";
export interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: ChatMessageContent;
}
export type ChatMessageContent = string | (ChatMessageImageContent | ChatMessageTextContent)[];
export interface ChatMessageImageContent {
    type: "image_url";
    image_url: {
        url: string;
    };
    text?: string;
}
export interface ChatMessageTextContent {
    type: string;
    text: string;
}
export declare const modelsWithVision: AvailableModel[];
export declare const AnnotatedScreenshotText = "This is a screenshot of the current page state with the elements annotated on it. Each element id is annotated with a number to the top left of it. Duplicate annotations at the same location are under each other vertically.";
export interface ChatCompletionOptions {
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
export declare abstract class LLMClient {
    modelName: AvailableModel;
    hasVision: boolean;
    constructor(modelName: AvailableModel);
    abstract createChatCompletion(options: ChatCompletionOptions): Promise<any>;
    abstract logger: (message: {
        category?: string;
        message: string;
    }) => void;
}
