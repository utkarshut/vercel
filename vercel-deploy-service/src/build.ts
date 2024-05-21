import { exec } from "child_process";
import path from "path";
export const buildProject = (prefix: string) => {
  return new Promise((resolve) => {
    const child = exec(
      `cd ${path.join(
        __dirname,
        `output/${prefix}`
      )} && npm install && npm run build `,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      }
    );
    child.on("close", () => resolve(""));
  });
};
