///// Copied from index.html /////
// Box UI Element Proof of Concept:

// This proof of concept uses the official Box UI Elements standalone via the Box CDN
// (https://developer.box.com/guides/embed/ui-elements/installation/#manual-installation).
// They can also be used through NPM (except the previewer) with React, however, it is
// currently (as of 12/28/22) impossible to use them this way without downgrading Node and NPM
// several versions and manually resolving dependency issues
// (https://github.com/box/box-ui-elements/issues/3023).

// Box UI elements.
const folderPicker = new Box.FolderPicker();
const uploader = new Box.ContentUploader();
const previewPicker = new Box.FilePicker();
const preview = new Box.Preview();

// Correspond to allowed values in a custom metadata template.
// https://support.box.com/hc/en-us/articles/360044196173-Using-Metadata
const gDocTransReqEnumVals = {
  priority: ["Low", "Medium", "High"],
  language: [
    "Spanish",
    "French",
    "Italian",
    "Chinese (traditional)",
    "Chinese (simplified)",
  ],
};

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

// Metadata for currently previewed file.
let gMetadata = {
  priority: "Low",
  language: "Spanish",
  notes: "none",
};

function main() {
  initEventListeners();
}

// Setup UI event listeners.
function initEventListeners() {
  document
    .getElementById("accessTokenSubmit")
    .addEventListener("click", submitAccessToken);

  // When upload folder is chosen, display its name and ID,
  // and show the file uploader.
  folderPicker.addListener("choose", (folders) => {
    gFolder.id = folders[0].id;
    gFolder.name = folders[0].name;
    setFolderInfoUi();

    // Show uploader
    uploader.show(gFolder.id, gAccessToken, {
      container: "#uploader",
    });
  });

  // Log upload message and attatch metadata to uploaded file.
  uploader.addListener("upload", (data) => {
    statusLog(
      `Successfully uploaded file with name "${data.name}" to Box File ID ${data.id}`
    );

    // Add metadata.
    let metadata = {
      priority: getRandElem(gDocTransReqEnumVals.priority),
      language: getRandElem(gDocTransReqEnumVals.language),
      notes: `File ID: ${data.id}, uploaded: ${data.created_at}`,
    };
    addDocTransReqMetadata(data.id, metadata);
  });

  // Log error message.
  uploader.addListener("error", (data) => {
    statusLog(
      `Error uploading file with name "${data.file.name}". The error was: "${data.error}"`
    );
  });

  // When all files have been uploaded, display the file preview picker.
  uploader.addListener("complete", (data) => {
    log("All files successfully uploaded!");
    previewPicker.show(gFolder.id, gAccessToken, {
      container: "#previewPicker",
      modal: {
        buttonLabel: "Pick File to preview",
      },
      maxSelectable: 1,
      canUpload: false,
      canSetShareAccess: false,
      canCreateNewFolder: false,
    });
  });

  // When preview file chosen, show the Box UI preview element and get metadata.
  previewPicker.addListener("choose", async (files) => {
    gPreviewFile.id = files[0].id;
    gPreviewFile.name = files[0].name;

    // Show the content preview.
    preview.show(gPreviewFile.id, gAccessToken, {
      container: "#preview",
    });

    // Update file info and metadata UI.
    setFileInfoUi();
    gMetadata = await getDocTransReqMetadata(gPreviewFile.id);
    setFileMetadataUi();
  });
}

// Called when access token submit button clicked.
async function submitAccessToken() {
  gAccessToken = document.getElementById("accessTokenInput").value;
  // Show pick folder button.
  if (await isValidAccessToken(gAccessToken)) {
    statusLog("Select upload destination.");
    showFolderPicker();
  } else {
    statusLog("Invalid access token!");
  }
}

// Called after access token button clicked and token is validated.
// Shows the Box folder picker UI element.
function showFolderPicker() {
  folderPicker.show(ROOT_FOLDER_ID, gAccessToken, {
    container: "#folderPicker",
    modal: {
      buttonLabel: "Pick Destination Folder",
    },
    maxSelectable: 1,
    canUpload: false,
    canSetShareAccess: false,
  });
}

// Display upload folder info on webpage.
function setFolderInfoUi() {
  document.getElementById("pickedFolderName").value = gFolder.name;
  document.getElementById("pickedFolderId").value = gFolder.id;
}

// Display preview file info on webpage.
function setFileInfoUi() {
  document.getElementById("previewFileName").value = gPreviewFile.name;
  document.getElementById("previewFileId").value = gPreviewFile.id;
}

// Display custom file metadata on webpage.
function setFileMetadataUi() {
  document.getElementById("metaPriority").value = gMetadata.priority;
  document.getElementById("metaLanguage").value = gMetadata.language;
  document.getElementById("metaNotes").value = gMetadata.notes;
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
