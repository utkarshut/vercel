const max_len = 5;

export function generateRandomID(){
    const str = "asojnniusan13310un1ono45";
    let res = "";
    for(let i = 0; i<= max_len;i++){
        res +=  str[Math.floor(Math.random()*str.length)]
    }
    console.log("upload service: Id generated ", res);
    return res;
}