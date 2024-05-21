"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getAllFiles = (folderPath) => {
    let ans = [];
    const files = fs_1.default.readdirSync(folderPath);
    files.forEach((eachFile) => {
        const filePath = path_1.default.join(folderPath, eachFile);
        if (fs_1.default.statSync(filePath).isDirectory()) {
            ans = ans.concat((0, exports.getAllFiles)(filePath));
        }
        else {
            ans.push(filePath);
        }
    });
    return ans;
};
exports.getAllFiles = getAllFiles;
