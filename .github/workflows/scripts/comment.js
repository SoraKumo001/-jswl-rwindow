const fs = require("fs");
const request = require("request");
const { GITHUB_REF, GITHUB_REPOSITORY, GITHUB_TOKEN } = process.env;

const num = GITHUB_REF.split("/")[2];
const rep = GITHUB_REPOSITORY.split("/");
const url = `https://${rep[0]}.github.io/${rep[1]}/`;

const readFileList = (pathName) =>
  fs.promises
    .readFile(pathName, { encoding: "utf-8" })
    .then((e) => e.json())
    .catch(() => {});

readFileList("temp/index.json")
  .then((params) => {
    const body = `
<${url}>  

Images: ${params?.actualItems.length || 0}  
Faild: ${params?.diffItems.length || 0}   
New: ${params?.newItems.length || 0}  
Delete: ${params?.deletedItems.length || 0}  
`;

    request.post(
      {
        uri: `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${num}/comments?access_token=${GITHUB_TOKEN}`,
        headers: {
          "User-Agent": "https://api.github.com/meta",
          "Content-type": "application/json",
        },
        json: { body },
      },
      (_error, _response, body) => {
        console.log(body);
      }
    );
  });
