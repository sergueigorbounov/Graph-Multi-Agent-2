var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { BadRequestException, Controller, Get, InternalServerErrorException, Query } from "@nestjs/common";
import { AppService } from "./app.service.js";
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    async invoke(query) {
        if (!query) {
            throw new BadRequestException("Query parameter is required.");
        }
        try {
            const result = await this.appService.handleQuery(query);
            return {
                status: "success",
                response: result.response,
                reasoning: result.reasoning,
                summary: result.summary,
                processingDetails: result.processingDetails // Include processing details in the response
            };
        }
        catch (error) {
            throw new InternalServerErrorException("An error occurred while processing your request.");
        }
    }
};
__decorate([
    Get("invoke"),
    __param(0, Query("query")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "invoke", null);
AppController = __decorate([
    Controller(),
    __metadata("design:paramtypes", [AppService])
], AppController);
export { AppController };
