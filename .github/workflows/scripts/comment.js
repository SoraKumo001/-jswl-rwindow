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

const getDiffList = (targetList, srcList) => targetList.filter((name) => !srcList.includes(name));

Promise.all([
  readFileList("temp/index.txt"),
  readFileList("__image_snapshots__/index.txt"),
  readFileList("__image_diff__/index.txt"),
]).then(([targetList, srcList, dffList]) => {
  console.log(targetList, srcList, dffList);
  const addList = getDiffList(srcList, targetList);
  const delList = getDiffList(targetList, srcList);

  const body = `
<${url}>  

Images: ${srcList.length}  
Faild: ${dffList.length}  
New: ${addList.length}  
Delete: ${delList.length}  
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
    function (_error, _response, body) {
      console.log(body);
    }
  );
});
