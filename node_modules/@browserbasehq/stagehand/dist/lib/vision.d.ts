import { Page } from "@playwright/test";
import { LogLine } from "../types/log";
export declare class ScreenshotService {
    private page;
    private selectorMap;
    private annotationBoxes;
    private numberPositions;
    private isDebugEnabled;
    private verbose;
    private externalLogger?;
    constructor(page: Page, selectorMap: Record<number, string[]>, verbose: 0 | 1 | 2, externalLogger?: (logLine: LogLine) => void, isDebugEnabled?: boolean);
    log(logLine: LogLine): void;
    getScreenshot(fullpage?: boolean, quality?: number): Promise<Buffer>;
    getScreenshotPixelCount(screenshot: Buffer): Promise<number>;
    getAnnotatedScreenshot(fullpage: boolean): Promise<Buffer>;
    private createElementAnnotation;
    private findNonOverlappingNumberPosition;
    private isNumberOverlapping;
    saveAndOpenScreenshot(screenshot: Buffer): Promise<void>;
}
