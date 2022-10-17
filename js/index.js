const folderPicker = new Box.FolderPicker();
const uploader = new Box.ContentUploader();
const previewPicker = new Box.FilePicker();
const preview = new Box.Preview();

const ROOT_FOLDER = "0";

let gAccessToken; // Developer access token.
let gFolderId = 0;

function main() {
  initEventListeners();
}

// Setup UI event listeners.
function initEventListeners() {
  document
    .getElementById("devTokenSubmit")
    .addEventListener("click", submitAccessToken);

  folderPicker.addListener("choose", (folders) => {
    gFolderId = folders[0].id;

    // Show uploader
    uploader.show(gFolderId, gAccessToken, {
      container: "#uploader",
    });
  });

  uploader.on("upload", (data) => {
    log(
      `Successfully uploaded file with name "${data.name}" to Box File ID ${data.id}`
    );
  });

  // Log upload data

  uploader.on("complete", (data) => {
    log(`All files successfully uploaded: ${JSON.stringify(data)}`);
    previewPicker.show(gFolderId, gAccessToken, {
      container: "#previewPicker",
      modal: {
        buttonLabel: "Pick File to preview",
      },
      maxSelectable: 1,
    });
  });

  uploader.on("error", (data) => {
    log(
      `Error uploading file with name "${data.file.name}". The error was: "${data.error}"`
    );
  });

  previewPicker.addListener("choose", (files) => {
    // Show the content preview
    preview.show(files[0].id, gAccessToken, {
      container: "#preview",
    });
  });
}

// Runs when access token submit button clicked.
function submitAccessToken() {
  gAccessToken = document.getElementById("devTokenInput").value;
  // Show pick folder button.
  if (isValidAccessToken(gAccessToken)) {
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

function log(msg) {
  document.getElementById("log").textContent = msg;
  console.log(msg);
}

main();
