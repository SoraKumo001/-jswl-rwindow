const getSearchParams = () =>
  Object.fromEntries(
    location.search
      .slice(1)
      .split("&")
      .map((s) => s.split("="))
  );

const getStoryList = async () => {
  const res = await fetch("./stories/index.txt?" + Date.now()).catch(() => null);
  return res && (await res.text()).split("\n").filter((v) => v);
};
const getCaptures = async () => {
  const res = await fetch("./captures/index.txt?" + Date.now()).catch(() => null);
  return res && (await res.text()).split("\n").filter((v) => v);
};
const getImages = async (story, prefix) => {
  const res = await fetch(`./captures/${story}/${prefix}/index.txt?` + Date.now()).catch(
    () => null
  );
  return {
    images: res && (await res.text()).split("\n").filter((v) => v && /\.png$/.test(v)),
    prefix,
  };
};
const getSnapshotList = async () =>
  Promise.all(
    (await getCaptures())?.map(async (story) => [
      story,
      await Promise.all(["image_snapshots", "image_diff"].map((name) => getImages(story, name))),
    ])
  );

const storyList = getStoryList();
const snapshotList = getSnapshotList();
const stories = () => {
  Promise.all([snapshotList, storyList]).then(([images]) => {
    const headers = ["Img", "Diff", "Add", "Del"];
    const storiesInfo = images
      .map((image) => [
        image[0].split("--")[0],
        {
          target: image[0].split("--")[1],
          snapshots: [image[1][0].images, image[1][1].images, [], []],
        },
      ])
      .sort((a, b) => (a[0] === "master" ? -1 : a[0] < b[0] ? -1 : 1));
    const storiesHash = Object.fromEntries(storiesInfo);

    const updateImage = () => {
      const params = getSearchParams();
      const index = Math.max(headers.indexOf(params["prefix"]), 0);
      const branch = params["branch"] || "master";
      const target = params["target"] || "";
      const storyInfo = storiesInfo.find(
        ([name, info]) => name === branch && (!target || info.target == target)
      )?.[1];
      const box = document.querySelector(".images");
      while (box.childNodes.length) box.removeChild(box.childNodes[0]);
      storyInfo?.snapshots[index].forEach((file) => {
        const title = document.createElement("div");
        title.className = "imageTitle";
        title.innerText = file;
        box.appendChild(title);
        const img = document.createElement("img");
        img.src = `./captures/${index !== 3 ? branch : storyInfo.target || "master"}/${
          index !== 1 ? "image_snapshots" : "image_diff"
        }/${file}`;
        img.onclick = () => {
          open(img.src, "_blank");
        };
        box.appendChild(img);
      });
      const cell = document.querySelector(
        `table[data-branch=${branch}][data-target${
          target ? `=${target}` : ""
        }] tr:nth-of-type(2) td:nth-of-type(${index+1})`
      );
      document.querySelectorAll("table .select").forEach((node) => node.classList.remove("select"));
      if (cell) cell.classList.add("select");
    };
    storiesInfo.forEach((story) => {
      const srcInfo = story[1];
      const targetInfo = storiesHash[srcInfo.target || "master"];
      if (targetInfo) {
        srcInfo.snapshots[2] = srcInfo.snapshots[0].filter(
          (i) => !targetInfo.snapshots[0].includes(i)
        );
        srcInfo.snapshots[3] = targetInfo.snapshots[0].filter(
          (i) => !srcInfo.snapshots[0].includes(i)
        );
      }
    });

    storiesInfo.forEach(([name, info]) => {
      const list = document.querySelector(".list");
      const table = document.createElement("table");
      table.dataset.branch = name;
      table.dataset.target = info.target || "";
      list.appendChild(table);

      const headerRow = table.insertRow();
      headers.forEach((name) => {
        headerRow.insertCell().innerText = name;
      });
      const row = table.insertRow();
      info.snapshots.forEach((snapshot, i) => {
        const button = document.createElement("div");
        button.className = "link";
        button.innerText = snapshot.length;
        button.onclick = () => {
          history.pushState(
            null,
            null,
            `?branch=${name}&prefix=${headers[i]}&target=${info.target || ""}`
          );
          updateImage();
        };
        row.insertCell().appendChild(button);
      });
      const cellStory = table.insertRow().insertCell();
      cellStory.colSpan = 4;
      cellStory.innerHTML = `<a class="link" target="_blank" href='./stories/${name}/?${Date.now()}'+>${
        info.target ? "[PR]" : ""
      }${name} → ${info.target || "master"}</a>`;
    });
    updateImage();
    addEventListener("popstate", updateImage);
  });
};

addEventListener("DOMContentLoaded", () => stories());
