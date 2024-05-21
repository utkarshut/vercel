import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";

const s3 = new S3({
  accessKeyId: "0d2abed5d214570942043a93f549ef40",
  secretAccessKey:
    "167408f99c4c298f530d4b1c78fbe72949f7813b7fe9332cb8e58393b1bf377a",
  endpoint: "https://207948f15d7380faa7c09c93f3217211.r2.cloudflarestorage.com",
});

// output/asdasd
export async function downloadS3Folder(prefix: string) {
  const allFiles = await s3
    .listObjectsV2({
      Bucket: "vercel",
      Prefix: prefix,
    })
    .promise();
  //console.log(allFiles);
  const allPromises =
    allFiles.Contents?.map(async ({ Key }) => {
      return new Promise(async (resolve) => {
        if (!Key) {
          resolve("");
          return;
        }
        const finalOutputPath = path.join(__dirname, Key);
        const outputFile = fs.createWriteStream(finalOutputPath);
        const dirName = path.dirname(finalOutputPath);
        if (!fs.existsSync(dirName)) {
          fs.mkdirSync(dirName, { recursive: true });
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
      });
    }) || [];
  console.log("awaiting");

  await Promise.all(allPromises?.filter((x) => x !== undefined));
}

export const copyFinalFileToS3 = (prefix: string) => {
  return new Promise(async (resolve) => {
    const folderPath = path.join(__dirname, `output/${prefix}/dist`);
    const allFiles = getAllFiles(folderPath);
    for (let i = 0; i < allFiles.length; i++) {
      await uploadFile(
        `dist/${prefix}/` + allFiles[i].slice(folderPath.length + 1),
        allFiles[i]
      );
    }
    resolve("");
  });
};
export const getAllFiles = (folderPath: string): string[] => {
  let ans: any = [];
  const files = fs.readdirSync(folderPath);
  files.forEach((eachFile) => {
    const filePath = path.join(folderPath, eachFile);
    if (fs.statSync(filePath).isDirectory()) {
      ans = ans.concat(getAllFiles(filePath));
    } else {
      ans.push(filePath);
    }
  });
  return ans;
};
export const uploadFile = async (fileName: string, localFilePath: string) => {
  //console.log("called");
  const fileContent = fs.readFileSync(localFilePath);
  const res = await s3
    .upload({
      Body: fileContent,
      Bucket: "vercel",
      Key: fileName,
    })
    .promise();
};
