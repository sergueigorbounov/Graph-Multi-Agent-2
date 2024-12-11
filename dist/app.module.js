var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from "@nestjs/common";
import { AppService } from "./app.service.js";
import { AppController } from "./app.controller.js";
import { ServeStaticModule } from "@nestjs/serve-static";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [ServeStaticModule.forRoot({
                rootPath: join(__dirname, "..", "public") // Adjust the path if needed
            })],
        controllers: [AppController],
        providers: [AppService]
    })
], AppModule);
export { AppModule };
