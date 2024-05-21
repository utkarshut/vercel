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
const cors_1 = __importDefault(require("cors"));
const utils_1 = require("./utils");
const simple_git_1 = __importDefault(require("simple-git"));
const path_1 = __importDefault(require("path"));
const files_1 = require("./files");
const aws_1 = require("./aws");
const redis_1 = require("redis");
// Create a Redis client and connect to the Redis server
const publisher = (0, redis_1.createClient)();
publisher.connect();
const app = (0, express_1.default)();
// Enable CORS for all routes
app.use((0, cors_1.default)());
// Parse JSON bodies in requests
app.use(express_1.default.json());
app.post("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repoUrl = req.body.repoUrl;
    const id = (0, utils_1.generateRandomID)(); // Generate a random ID for the deployment
    console.log(__dirname, __filename, `./output/${id}`);
    // Clone the specified repository into a directory named after the generated ID
    yield (0, simple_git_1.default)().clone(repoUrl, path_1.default.join(__dirname, `output/${id}`));
    // Get a list of all files in the cloned repository
    const files = (0, files_1.getAllFiles)(path_1.default.join(__dirname + `/output/${id}`));
    // Upload each file to S3
    for (let i = 0; i < files.length; i++) {
        yield (0, aws_1.uploadFile)(files[i].slice(__dirname.length + 1), files[i]);
    }
    // Push the generated ID to the "build-queue" list in Redis
    yield publisher.lPush("build-queue", id);
    // Retrieve the current content of the "build-queue" list
    const listContent = yield publisher.lRange("build-queue", 0, -1);
    console.log("Current content of build-queue:", listContent);
    // something like redis db to store value
    yield publisher.hSet("status", id, "uploaded");
    // Respond with the deployment ID and repository URL
    res.json({ id, repoUrl });
}));
app.get("/status", (req, res) => {
    const id = req.query.id;
    const status = publisher.hGet("status", id);
    res.json({ "status": status });
});
// Start the Express server on port 3000
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
