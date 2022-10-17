const folderPicker = new Box.FolderPicker();
const uploader = new Box.ContentUploader();
const preview = new Box.Preview();

const ROOT_FOLDER = "0";

let gAccessToken; // Developer access token.
let gFolderId = 0;

// Setup Box UI Elements.
function setupBoxUi() {
  // Log upload data to console
  uploader.on("complete", (data) => {
    console.log(`All files successfully uploaded: ${JSON.stringify(data)}`);
  });

  uploader.on("upload", (data) => {
    console.log(
      `Successfully uploaded file with name "${data.name}" to Box File ID ${data.id}`
    );
    // Show the content preview
    preview.show(data.id, gAccessToken, {
      container: "#preview",
    });
  });

  uploader.on("error", (data) => {
    console.log(
      `Error uploading file with name "${data.file.name}". The error was: "${data.error}"`
    );
  });
}

// Display Box UI Elements.
function showBoxUi() {
  // Show the content uploader
  uploader.show(gFolderId, gAccessToken, {
    container: "#uploader",
  });
}

function main() {
  addEventListeners();
}

function addEventListeners() {
  document
    .getElementById("devTokenSubmit")
    .addEventListener("click", onSubmitAccessToken);

  folderPicker.addListener("choose", (folders) => {
    console.log(folders[0]);
    // TODO: set gFolderId to selected folder and show upload button.
  });
}

// Runs when access token submitted.
function onSubmitAccessToken() {
  gAccessToken = document.getElementById("devTokenInput").value;
  // Show pick folder button.
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
