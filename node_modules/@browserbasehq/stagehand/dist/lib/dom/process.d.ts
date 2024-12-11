export declare function isElementNode(node: Node): node is Element;
export declare function isTextNode(node: Node): node is Text;
export declare function processDom(chunksSeen: Array<number>): Promise<{
    outputString: string;
    selectorMap: Record<number, string[]>;
    chunk: number;
    chunks: number[];
}>;
export declare function processAllOfDom(): Promise<{
    outputString: string;
    selectorMap: {};
}>;
export declare function scrollToHeight(height: number): Promise<void>;
export declare function processElements(chunk: number, scrollToChunk?: boolean, indexOffset?: number): Promise<{
    outputString: string;
    selectorMap: Record<number, string[]>;
}>;
