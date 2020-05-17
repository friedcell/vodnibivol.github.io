const form = document.getElementById("search");
const inputField = document.getElementById("inputField");
const link = document.getElementById("link");
const tip = document.getElementById("tip");
const background = document.getElementById("bgnd");
const backgroundImage = document.getElementById("bgndImg");

/* ----- EVENT LISTENERS ----- */

search.addEventListener("keydown", () => {
  tip.style.visibility = "visible";
  tip.style.opacity = ".5";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log("was submitted");
  var inputUrl = form.inputUrl.value;

  jsonRequest(inputUrl);
});

/* ----- FUNCTIONS ----- */

(function randomBackground() {
  var randInt = Math.floor(Math.random() * 8);

  // -- image preload for displaying as a background
  backgroundImage.setAttribute("src", `img/bg/bgnd_${randInt}.jpg`);

  backgroundImage.onload = function () {
    background.style["background-image"] = `url(img/bg/bgnd_${randInt}.jpg)`;
    background.classList.remove("hidden");
  };
})();

inputField.select();

function getLink(rtvUrl) {
  arr = rtvUrl.split("/");
  videoId = arr[arr.length - 1];

  return (
    "http://api.rtvslo.si/ava/getRecording/" +
    videoId +
    "?client_id=82013fb3a531d5414f478747c1aca622"
  );
}

function parser(response) {
  var parsedResponse = JSON.parse(response.responseText);
  console.log(parsedResponse);
  console.log('response ok');

  /* ----- FIND LARGEST FILE ----- */

  bitrates = [];

  for (i = 0; i < parsedResponse.response.mediaFiles.length; i++) {
    bitrates.push(parsedResponse.response.mediaFiles[i].bitrate);
  }

  largest = bitrates.indexOf(Math.max(...bitrates));

  /* ----- FIND OTHER PROPERTIES ----- */

  var http = parsedResponse.response.mediaFiles[0].streamers.http;
  var archive = http.split("/");
  archive = archive[archive.length - 1];
  var filename = parsedResponse.response.mediaFiles[largest].filename;
  if (filename[0] != "/") {
    filename = "/" + filename;
  }

  /* ----- REDIRECT ----- */

  urlFound = "https://videoweb2.rtvslo.si/" + archive + filename + "?keylockhash=null";

  console.log(urlFound);
  window.open(urlFound, "_blank");
}

function jsonRequest(inputUrl) {
  var xmlhttp = new XMLHttpRequest();
  var url = getLink(inputUrl);
  const proxy = "https://cors-anywhere.herokuapp.com/";

  console.log(url);

  /* ----- MAKE AN XML REQUEST ----- */

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = this;
      parser(response);
    }
  };

  xmlhttp.open("GET", proxy + url, true);
  xmlhttp.send();
}
