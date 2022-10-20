// Box UI elements.
const folderPicker = new Box.FolderPicker();
const uploader = new Box.ContentUploader();
const previewPicker = new Box.FilePicker();
const preview = new Box.Preview();

const ROOT_FOLDER = "0";

let gAccessToken; // Developer access token.
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
  priority: "invalid",
  language: "invalid",
  notes: "invalid",
};

function main() {
  initEventListeners();
}

// Setup UI event listeners.
function initEventListeners() {
  document
    .getElementById("devTokenSubmit")
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

  uploader.on("upload", (data) => {
    log(
      `Successfully uploaded file with name "${data.name}" to Box File ID ${data.id}`
    );

    // Add metadata.
    addDocTransReqMetadata(data.id, gMetadata);
  });

  uploader.on("error", (data) => {
    log(
      `Error uploading file with name "${data.file.name}". The error was: "${data.error}"`
    );
  });

  // When all files have been uploaded, display the file preview picker.
  uploader.on("complete", (data) => {
    log("All files successfully uploaded!");
    previewPicker.show(gFolder.id, gAccessToken, {
      container: "#previewPicker",
      modal: {
        buttonLabel: "Pick File to preview",
      },
      maxSelectable: 1,
    });
  });

  //
  previewPicker.addListener("choose", (files) => {
    gPreviewFile.id = files[0].id;
    gPreviewFile.name = files[0].name;

    // Show the content preview
    preview.show(gPreviewFile.id, gAccessToken, {
      container: "#preview",
    });

    // Update file info and metadata UI
    setFileInfoUi();
    gFile.metadata = getDocTransReqMetadata(gFile.id);
    setFileMetadataUi();
  });
}

// Runs when access token submit button clicked.
function submitAccessToken() {
  gAccessToken = document.getElementById("devTokenInput").value;
  // Show pick folder button.
  if (isValidAccessToken(gAccessToken)) {
    log("");
    showFolderPicker();
  } else {
    log("Invalid access token!");
  }
}

function showFolderPicker() {
  folderPicker.show(ROOT_FOLDER, gAccessToken, {
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
  document.getElementById("pickedFileName").value = gFile.name;
  document.getElementById("pickedFileId").value = gFile.id;
}

function setFileMetadataUi() {
  console.log(gFile.metadata);
  document.getElementById("metaId").value = gFile.metadata.id;
  document.getElementById("metaPriority").value = gFile.metadata.priority;
  document.getElementById("metaLanguage").value = gFile.metadata.language;
  document.getElementById("metaNotes").value = gFile.metadata.notes;
}

function log(msg) {
  // document.getElementById("log").value = msg;
  console.log("Log: " + msg);
}

main();
