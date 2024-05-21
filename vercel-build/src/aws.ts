import { S3 } from "aws-sdk";
import fs from "fs";

const s3 =  new S3({
    accessKeyId: "0d2abed5d214570942043a93f549ef40",
    secretAccessKey: "167408f99c4c298f530d4b1c78fbe72949f7813b7fe9332cb8e58393b1bf377a",
    endpoint: "https://207948f15d7380faa7c09c93f3217211.r2.cloudflarestorage.com"
})

export const uploadFile =async (fileName:string, localFilePath:string)=>{
    console.log("called")
    const fileContent = fs.readFileSync(localFilePath);
    const res =  await s3.upload({
        Body:fileContent,
        Bucket: "vercel",
        Key: fileName
    }).promise();
    console.log(res);
}