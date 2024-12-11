import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Query
} from "@nestjs/common";
import { AppService } from "./app.service.js";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get("invoke")
  async invoke(@Query("query") query: string): Promise<any> {
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
    } catch (error) {

      throw new InternalServerErrorException(
        "An error occurred while processing your request."
      );
    }
  }
}
