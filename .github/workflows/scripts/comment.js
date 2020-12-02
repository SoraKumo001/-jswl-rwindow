const fs = require("fs");
const request = require("request");
const { GITHUB_REF, GITHUB_REPOSITORY, GITHUB_TOKEN } = process.env;

const num = GITHUB_REF.split("/")[2];
const rep = GITHUB_REPOSITORY.split("/");
const url = `https://${rep[0]}.github.io/${rep[1]}/`;

const readFileList = (pathName) =>
  fs.promises
    .readFile(pathName, { encoding: "utf-8" })
    .then((value) => value.split("\n").filter((v) => v))
    .catch(() => []);

const getDiffList = (targetList, srcList) =>
  targetList.filter((name) => !srcList.includes(name));

readFileList("temp/index.json")
  .catch(() => null)
  .then((e) => e.json())
  .then((file) => {
    const body = `
<${url}>  

Images: ${file?.actualItems.length || 0}  
Faild: ${file?.diffItems.length || 0}   
New: ${file?.newItems.length || 0}  
Delete: ${file?.deletedItems.length || 0}  
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
