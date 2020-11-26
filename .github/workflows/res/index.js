const getStories = async () => {
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
const getSnapshots = async () =>
  Promise.all(
    (await getCaptures())?.map(async (story) => [
      story,
      await Promise.all(["image_snapshots", "diff_output"].map((name) => getImages(story, name))),
    ])
  );

const imageArea = (images, cell, story, prefix) => {
  if (images) {
    cell.className = "cellImage";
    const link = document.createElement("a");
    link.className = "link";
    link.innerHTML = `${images.length}`;
    cell.appendChild(link);
    link.onclick = (e) => {
      e.preventDefault();
      const box = document.querySelector(".images");
      while (box.childNodes.length) box.removeChild(box.childNodes[0]);
      images.forEach((file) => {
        const title = document.createElement("div");
        title.className = "imageTitle";
        title.innerText = file;
        box.appendChild(title);
        const img = document.createElement("img");
        img.src = `./captures/${story}/${prefix}/${file}`;
        img.onclick = () => open(img.src, "_blank");
        box.appendChild(img);
      });
    };
  }
};

const images = getSnapshots();
const stories = () => {
  images.then((images) => {
    images.sort((a, b) => (a[0] === "master" ? -1 : a[0] < b[0] ? -1 : 1));
    const master = images.find((image) => image[0] === "master");
    images.forEach((image) => {
      const list = document.querySelector(".list");
      const table = document.createElement("table");
      list.appendChild(table);

      table.insertRow().innerHTML = "<th>Img</th><th>Diff</th><th>Add</th><th>Del</th>";
      const row = table.insertRow();
      row.className = "story";
      for (let i = 0; i < 2; i++) {
        const cellImage = row.insertCell();
        imageArea(image[1][i].images, cellImage, image[0], image[1][i].prefix);
      }
      const addImages = !master
        ? []
        : image[1][0].images.filter((i) => !master[1][0].images.includes(i));
      const cellAdd = row.insertCell();
      imageArea(addImages, cellAdd, image[0], image[1][0].prefix);

      const delImages = !master
        ? []
        : master[1][0].images.filter((i) => !image[1][0].images.includes(i));
      const cellDel = row.insertCell();
      imageArea(delImages, cellDel, master?.[0], master?.[1][0].prefix);

      const cellStory = table.insertRow().insertCell();
      cellStory.innerHTML = `<a class="link" href='./stories/${image[0]}/?${Date.now()}'+>${
        image[0]
      }</a>`;
      cellStory.colSpan = 4;
    });
  });
};

addEventListener("DOMContentLoaded", () => stories());
