import express from "express";
import { S3 } from "aws-sdk";
const app = express();

const s3 = new S3({
  accessKeyId: "0d2abed5d214570942043a93f549ef40",
  secretAccessKey:
    "167408f99c4c298f530d4b1c78fbe72949f7813b7fe9332cb8e58393b1bf377a",
  endpoint: "https://207948f15d7380faa7c09c93f3217211.r2.cloudflarestorage.com",
});

app.get("/*", async (req, res) => {
  const filePath = req.path;
  const host = req.hostname;
  const id = host.split(".")[0];
  console.log(req.hostname, req.path, `dist/${id}/my-angular-app${req.path}`);
  const content = await s3
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
});

app.listen(3001, () => console.log("app running on 3001"));
