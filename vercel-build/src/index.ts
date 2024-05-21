import express from "express";
import cors from "cors";
import { generateRandomID } from "./utils";
import simpleGit from "simple-git";
import fs from "fs";
import path from "path";
import { getAllFiles } from "./files";
import { uploadFile } from "./aws";
import { createClient } from "redis";

// Create a Redis client and connect to the Redis server
const publisher = createClient();
publisher.connect();

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies in requests
app.use(express.json());

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  const id = generateRandomID(); // Generate a random ID for the deployment

  console.log(__dirname, __filename, `./output/${id}`);

  // Clone the specified repository into a directory named after the generated ID
  await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

  // Get a list of all files in the cloned repository
  const files = getAllFiles(path.join(__dirname + `/output/${id}`));

  // Upload each file to S3
  for (let i = 0; i < files.length; i++) {
    await uploadFile(files[i].slice(__dirname.length + 1), files[i]);
  }

  // Push the generated ID to the "build-queue" list in Redis
  await publisher.lPush("build-queue", id);

  // Retrieve the current content of the "build-queue" list
  const listContent = await publisher.lRange("build-queue", 0, -1);
  console.log("Current content of build-queue:", listContent);
 
  // something like redis db to store value
  await publisher.hSet("status",id,"uploaded");

  // Respond with the deployment ID and repository URL
  res.json({ id, repoUrl });
});

app.get("/status", (req,res)=>{
    const id = req.query.id;
    const status = publisher.hGet("status",id as string);
    res.json({"status":status});
})

// Start the Express server on port 3000
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
