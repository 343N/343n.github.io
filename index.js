const DATA_FILE_URL = "data.json";
let PROJECT_DATA = null;
let mouseX, mouseY;

// retrieve JSON from some URL asynchronously
function getJSON(url) {
  return new Promise((res, rej) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        res(JSON.parse(xhr.responseText));
        console.log(xhr);
      }
    };
    xhr.send();
    console.log(xhr);
  });
}

// populate the page with my projects (in data.json)
function populateProjects() {
  const PROJECT_CATEGORIES = Object.keys(PROJECT_DATA.projects);
  const PROJECT_CONTAINER = document.querySelector("#projectsContainer");

  for (let cat of PROJECT_CATEGORIES) {
    const PDATA = PROJECT_DATA.projects[cat];
    const MASTER_CONTAINER = createElement(
      "div.projectCategory",
      PROJECT_CONTAINER
    );
    let heading = createElement("div.projectsTitle", MASTER_CONTAINER);
    heading.innerText = PDATA.title;

    const spinnerContainer = createElement(
      "div.projectsSpinnerContainer",
      PROJECT_CONTAINER
    );
    const spinner = createElement("div.projectsSpinner", spinnerContainer);

    for (let projData of PDATA.items) {
      let html = createProjectHTML(projData);
      if (!html) continue;
      // console.log(html)
      spinner.appendChild(html);
    }
  }
}

// create elements and set classes/id's with a selector syntax
// i.e. createElement(div#id.class1.class2) will return a div
// with the respective ID and classes
function createElement(string, parent = null) {
  const elementRegex = /^([^.\# ]+)/g;
  const idRegex = /(#[^ \.#]+)/g;
  const classRegex = /\.([^ \.#]+)/g;

  string = string.trim();
  const elementType = string.match(elementRegex);
  const id = string.match(idRegex)?.map((x) => x.slice(1));
  const classes = string.match(classRegex)?.map((x) => x.slice(1));

  const element = document.createElement(elementType);
  if (id) element.id = id;
  if (classes) element.classList.add(...classes);
  if (parent) parent.appendChild(element);
  return element;
}

// create the html for an individual project
function createProjectHTML(data) {
  if (!shouldShowProject(data)) return null;
  const block = createElement("div.projectBlock");
  // block inner divs
  createElement("div.projectOverlay", block);

  const media = createElement("div.projectMedia", block);
  if (!data.media?.src) {
    createElement("img.media", media).src = "images/missing.png";
  } else {
    switch (data.media.type) {
      case "image":
        createElement("img.media", media).src = data.media.src;
        break;
      case "video":
        const video = createElement("video.media", media);
        video.setAttribute("muted", "");
        video.setAttribute("src", data.media.src);
        block.addEventListener("mouseenter", () => {
          video.play();
          video.setAttribute("loop", "");
        });
        block.addEventListener("mouseleave", () =>
          video.removeAttribute("loop")
        );
        break;
      default:
        createElement("img.media", media).src = "img/missing.png";
        break;
    }
  }

  const heading = createElement("div.projectBlockHeading", block);
  heading.innerText = data.title;

  const content = createElement("div.projectBlockContent", block);
  const textContainer = createElement("div", content);

  const miniHeading = createElement("b", textContainer);
  miniHeading.innerText = data.title;
  // console.log(block)
  const p = createElement("p", textContainer);
  p.innerText += data.description;
  // console.log(block)

  const linkContainer = createElement("div.projectLinks", content);
  const LINK_TYPES = Object.keys(PROJECT_DATA.LINK_TEMPLATES);

  for (let t of LINK_TYPES) {
    if (!data[t]) continue;
    const TDATA = PROJECT_DATA.LINK_TEMPLATES[t];

    const LINK_TEMPLATE = TDATA.link_template;
    const ALT_TEMPLATE = TDATA.alt_template;
    const IMG_ICON = TDATA.icon_url;

    // create the link
    console.log(data[t]);
    const a = createElement("a", linkContainer);
    a.href = LINK_TEMPLATE.replace("{}", data[t]);
    a.target = "_blank";

    // create the link icon
    const img = createElement("img.projectLink", a);
    img.alt = ALT_TEMPLATE.replace("{}", data.title);
    img.src = IMG_ICON;
  }
  console.log(block);
  return block;
}

// whether we should display the project on the page
// (only if there's a title and there's no "hidden" flag)
function shouldShowProject(data) {
  return data.title && !("hidden" in data);
}

// function scrollListener(event){
//     if (!event.deltaY) return;

//     event.currentTarget.scrollLeft += event.deltaY + event.deltaX
//     event.preventDefault()
// }

// load the project data and populate the page
async function main() {
  PROJECT_DATA = await getJSON(DATA_FILE_URL);
  populateProjects();
}

main();
