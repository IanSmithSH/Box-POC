// Box UI elements.
const folderPicker = new Box.FolderPicker();
const uploader = new Box.ContentUploader();
const previewPicker = new Box.FilePicker();
const preview = new Box.Preview();

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

// Developer access token.
let gAccessToken;
// Folder to upload to.
let gFolder = {
  id: "invalid",
  name: "invalid",
};
// File currently being previewed.
let gPreviewFile = {
  id: "invalid",
  name: "invalid",
};
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

  // When upload folder is chosen: display its name and ID,
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

  previewPicker.addListener("choose", async (files) => {
    gPreviewFile.id = files[0].id;
    gPreviewFile.name = files[0].name;

    // Show the content preview
    preview.show(gPreviewFile.id, gAccessToken, {
      container: "#preview",
    });

    // Update file info and metadata UI
    setFileInfoUi();
    gMetadata = await getDocTransReqMetadata(gPreviewFile.id);
    setFileMetadataUi();
  });
}

// Runs when access token submit button clicked.
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

function setFolderInfoUi() {
  document.getElementById("pickedFolderName").value = gFolder.name;
  document.getElementById("pickedFolderId").value = gFolder.id;
}

function setFileInfoUi() {
  document.getElementById("previewFileName").value = gPreviewFile.name;
  document.getElementById("previewFileId").value = gPreviewFile.id;
}

function setFileMetadataUi() {
  document.getElementById("metaPriority").value = gMetadata.priority;
  document.getElementById("metaLanguage").value = gMetadata.language;
  document.getElementById("metaNotes").value = gMetadata.notes;
}

function statusLog(msg) {
  document.getElementById("log").value = msg;
  console.log("Status Log: " + msg);
}

function getRandElem(arr) {
  return arr[getRandInt(0, arr.length)];
}

// Get a random integer in the range [min, max).
function getRandInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

main();
