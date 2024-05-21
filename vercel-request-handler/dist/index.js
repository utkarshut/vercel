"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aws_sdk_1 = require("aws-sdk");
const app = (0, express_1.default)();
const s3 = new aws_sdk_1.S3({
    accessKeyId: "0d2abed5d214570942043a93f549ef40",
    secretAccessKey: "167408f99c4c298f530d4b1c78fbe72949f7813b7fe9332cb8e58393b1bf377a",
    endpoint: "https://207948f15d7380faa7c09c93f3217211.r2.cloudflarestorage.com",
});
app.get("/*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = req.path;
    const host = req.hostname;
    const id = host.split(".")[0];
    console.log(req.hostname, req.path, `dist/${id}/my-angular-app${req.path}`);
    const content = yield s3
        .getObject({
        Bucket: "vercel",
        Key: `dist/${id}/my-angular-app${req.path}`,
    })
        .promise();
    const type = filePath.endsWith("html")
        ? "text/html"
        : filePath.endsWith("css")
            ? "text/css"
            : "application/javascript";
    res.set("Content-Type", type);
    res.send(content.Body);
}));
app.listen(3001, () => console.log("app running on 3001"));
