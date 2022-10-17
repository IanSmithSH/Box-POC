const folderPicker = new Box.FolderPicker();
const uploader = new Box.ContentUploader();
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
    console.log(
      `Successfully uploaded file with name "${data.name}" to Box File ID ${data.id}`
    );
    // Show the content preview
    // preview.show(data.id, gAccessToken, {
    //   container: "#preview",
    // });
  });

  // Log upload data

  uploader.on("complete", (data) => {
    console.log(`All files successfully uploaded: ${JSON.stringify(data)}`);
  });

  uploader.on("error", (data) => {
    console.log(
      `Error uploading file with name "${data.file.name}". The error was: "${data.error}"`
    );
  });
}

// Runs when access token submit button clicked.
function submitAccessToken() {
  gAccessToken = document.getElementById("devTokenInput").value;
  // Show pick folder button.
  if (isValidAccessToken(gAccessToken)) {
    showFolderPicker();
  } else {
    console.log("Invalid access token!");
  }
}

function showFolderPicker() {
  folderPicker.show(ROOT_FOLDER, gAccessToken, {
    container: "#folderPicker",
    modal: {
      buttonLabel: "Pick Destination Folder",
    },
    maxSelectable: 1,
    canCreateNewFolder: true,
  });
}

main();
