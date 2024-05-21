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
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const aws_1 = require("./aws");
const build_1 = require("./build");
const subscriber = (0, redis_1.createClient)();
subscriber.connect();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        //await downloadS3Folder("output/a1jn0j")
        while (1) {
            const res = yield subscriber.brPop("build-queue", 0);
            console.log(res);
            // @ts-ignore
            const id = res.element;
            yield (0, aws_1.downloadS3Folder)(`output/${id}`);
            yield (0, build_1.buildProject)(id);
            yield (0, aws_1.copyFinalFileToS3)(id);
            subscriber.hSet("status", id, "deployed");
        }
        console.log("downloaded");
    });
}
main();
