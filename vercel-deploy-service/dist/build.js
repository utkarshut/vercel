"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProject = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const buildProject = (prefix) => {
    return new Promise((resolve) => {
        const child = (0, child_process_1.exec)(`cd ${path_1.default.join(__dirname, `output/${prefix}`)} && npm install && npm run build `, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
        child.on("close", () => resolve(""));
    });
};
exports.buildProject = buildProject;
