import {createClient, commandOptions} from "redis";
import { S3 } from "aws-sdk";
import { copyFinalFileToS3, downloadS3Folder } from "./aws";
import { buildProject } from "./build";

const subscriber = createClient();
subscriber.connect();

async function main(){

    //await downloadS3Folder("output/a1jn0j")
    while(1){
        const res = await subscriber.brPop("build-queue",0);
        console.log(res);
        // @ts-ignore
        const id =  res.element;
        await downloadS3Folder(`output/${id}`);
        await buildProject(id);
        await copyFinalFileToS3(id);
        subscriber.hSet("status", id, "deployed")
    }


    console.log("downloaded");
}

main();