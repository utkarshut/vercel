import fs from "fs";
import path from "path";

export const getAllFiles = (folderPath: string): string[] => {
  let ans: any = [];
  const files = fs.readdirSync(folderPath);
  files.forEach((eachFile) => {
    const filePath = path.join(folderPath,eachFile);
    if (fs.statSync(filePath).isDirectory()) {
      ans = ans.concat(getAllFiles(filePath));
    } else {
      ans.push(filePath);
    }
  });
  return ans;
};
