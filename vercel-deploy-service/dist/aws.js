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
exports.uploadFile = exports.getAllFiles = exports.copyFinalFileToS3 = exports.downloadS3Folder = void 0;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const s3 = new aws_sdk_1.S3({
    accessKeyId: "0d2abed5d214570942043a93f549ef40",
    secretAccessKey: "167408f99c4c298f530d4b1c78fbe72949f7813b7fe9332cb8e58393b1bf377a",
    endpoint: "https://207948f15d7380faa7c09c93f3217211.r2.cloudflarestorage.com",
});
// output/asdasd
function downloadS3Folder(prefix) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const allFiles = yield s3
            .listObjectsV2({
            Bucket: "vercel",
            Prefix: prefix,
        })
            .promise();
        //console.log(allFiles);
        const allPromises = ((_a = allFiles.Contents) === null || _a === void 0 ? void 0 : _a.map((_b) => __awaiter(this, [_b], void 0, function* ({ Key }) {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                if (!Key) {
                    resolve("");
                    return;
                }
                const finalOutputPath = path_1.default.join(__dirname, Key);
                const outputFile = fs_1.default.createWriteStream(finalOutputPath);
                const dirName = path_1.default.dirname(finalOutputPath);
                if (!fs_1.default.existsSync(dirName)) {
                    fs_1.default.mkdirSync(dirName, { recursive: true });
                }
                s3.getObject({
                    Bucket: "vercel",
                    Key,
                })
                    .createReadStream()
                    .pipe(outputFile)
                    .on("finish", () => {
                    //console.log("finished");
                    resolve("");
                });
            }));
        }))) || [];
        console.log("awaiting");
        yield Promise.all(allPromises === null || allPromises === void 0 ? void 0 : allPromises.filter((x) => x !== undefined));
    });
}
exports.downloadS3Folder = downloadS3Folder;
const copyFinalFileToS3 = (prefix) => {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        const folderPath = path_1.default.join(__dirname, `output/${prefix}/dist`);
        const allFiles = (0, exports.getAllFiles)(folderPath);
        for (let i = 0; i < allFiles.length; i++) {
            yield (0, exports.uploadFile)(`dist/${prefix}/` + allFiles[i].slice(folderPath.length + 1), allFiles[i]);
        }
        resolve("");
    }));
};
exports.copyFinalFileToS3 = copyFinalFileToS3;
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
const uploadFile = (fileName, localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("called");
    const fileContent = fs_1.default.readFileSync(localFilePath);
    const res = yield s3
        .upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName,
    })
        .promise();
});
exports.uploadFile = uploadFile;
