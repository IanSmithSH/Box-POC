// Box Content Explorer Proof of Concept:
// Documentation: https://developer.box.com/guides/embed/ui-elements/explorer/

// Box content explorer UI element.
const contentExplorer = new Box.ContentExplorer();

// Access token. A developer token can be generated through the developer console
// but will need to be manually regenerated after an hour.
let gAccessToken;

// Folder to upload to. Only the ID is used in API calls.
let gFolder = {
  id: "invalid",
  name: "invalid",
};

// File currently being previewed. Only the ID is used in API calls.
let gPreviewFile = {
  id: "invalid",
  name: "invalid",
};

let gCanPreview = true;
let gCanDownload = true;
let gCanDelete = true;
let gCanRename = true;
let gCanUpload = true;
let gCanCreateNewFolder = true;
let gCanShare = true;
let gCanSetShareAccess = true;

function main() {
  // Hide settings until access token submitted
  document.getElementById("rightColumn").style.display = "none";
  initEventListeners();
}

// Setup UI event listeners.
function initEventListeners() {
  document
    .getElementById("accessTokenSubmit")
    .addEventListener("click", submitAccessToken);

  // Setup content explorer settings controls
  document.getElementById("canPreviewToggle").addEventListener("click", (e) => {
    gCanPreview = !gCanPreview;
    document.getElementById("canPreview").innerHTML = gCanPreview
      ? "true"
      : "false";
    showContentExplorer();
  });
  document
    .getElementById("canDownloadToggle")
    .addEventListener("click", (e) => {
      gCanDownload = !gCanDownload;
      document.getElementById("canDownload").innerHTML = gCanDownload
        ? "true"
        : "false";
      showContentExplorer();
    });
  document.getElementById("canDeleteToggle").addEventListener("click", (e) => {
    gCanDownload = !gCanDelete;
    document.getElementById("canDelete").innerHTML = gCanDelete
      ? "true"
      : "false";
    showContentExplorer();
  });
  document.getElementById("canRenameToggle").addEventListener("click", (e) => {
    gCanRename = !gCanRename;
    document.getElementById("canRename").innerHTML = gCanRename
      ? "true"
      : "false";
    showContentExplorer();
  });
  document.getElementById("canUploadToggle").addEventListener("click", (e) => {
    gCanUpload = !gCanUpload;
    document.getElementById("canUpload").innerHTML = gCanUpload
      ? "true"
      : "false";
    showContentExplorer();
  });
  document
    .getElementById("canCreateNewFolderToggle")
    .addEventListener("click", (e) => {
      gCanCreateNewFolder = !gCanCreateNewFolder;
      document.getElementById("canCreateNewFolder").innerHTML =
        gCanCreateNewFolder ? "true" : "false";
      showContentExplorer();
    });
  document.getElementById("canShareToggle").addEventListener("click", (e) => {
    gCanShare = !gCanShare;
    document.getElementById("canShare").innerHTML = gCanShare
      ? "true"
      : "false";
    showContentExplorer();
  });
  document
    .getElementById("canSetShareAccessToggle")
    .addEventListener("click", (e) => {
      gCanSetShareAccess = !gCanSetShareAccess;
      document.getElementById("canSetShareAccess").innerHTML =
        gCanSetShareAccess ? "true" : "false";
      showContentExplorer();
    });

  // Content explorer event listeners
  contentExplorer.addListener("select", (data) => {
    eventLog("select: " + JSON.stringify(data, null, 4));
  });
  contentExplorer.addListener("rename", (data) => {
    eventLog("rename: " + JSON.stringify(data, null, 4));
  });
  contentExplorer.addListener("preview", (data) => {
    eventLog("preview: " + JSON.stringify(data, null, 4));
  });
  contentExplorer.addListener("download", (data) => {
    eventLog("download: " + JSON.stringify(data, null, 4));
  });
  contentExplorer.addListener("delete", (data) => {
    eventLog("delete: " + JSON.stringify(data, null, 4));
  });
  contentExplorer.addListener("upload", (data) => {
    eventLog("upload: " + JSON.stringify(data, null, 4));
  });
  contentExplorer.addListener("navigate", (data) => {
    eventLog("navigate: " + JSON.stringify(data, null, 4));
  });
  contentExplorer.addListener("create", (data) => {
    eventLog("create: " + JSON.stringify(data, null, 4));
  });
}

// Called when access token submit button clicked.
async function submitAccessToken() {
  gAccessToken = document.getElementById("accessTokenInput").value;
  // Show pick folder button.
  if (await isValidAccessToken(gAccessToken)) {
    statusLog(
      "API documentation is at https://developer.box.com/guides/embed/ui-elements/explorer/"
    );
    showContentExplorer();
    document.getElementById("rightColumn").style.display = "block";
  } else {
    statusLog("Invalid access token!");
  }
}

// Called after access token button clicked and token is validated.
// Shows the Box content explorer UI element.
function showContentExplorer() {
  contentExplorer.show(ROOT_FOLDER_ID, gAccessToken, {
    container: "#contentExplorer",
    canPreview: gCanPreview,
    canDownload: gCanDownload,
    canDelete: gCanDelete,
    canRename: gCanRename,
    canUpload: gCanUpload,
    canCreateNewFolder: gCanCreateNewFolder,
    canShare: gCanShare,
    canSetShareAccess: gCanSetShareAccess,
  });
}

// Display content explorer events to webpage and browser console.
function eventLog(msg) {
  document.getElementById("eventData").value = msg;
  console.log("Event Log: " + msg);
}

main();

///// Utility /////

// Display messages to webpage and browser console.
function statusLog(msg) {
  document.getElementById("log").value = msg;
  console.log("Status Log: " + msg);
}

// Get a random array element.
function getRandElem(arr) {
  return arr[getRandInt(0, arr.length)];
}

// Get a random integer in the range [min, max).
function getRandInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
