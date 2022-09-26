const uploader = new Box.ContentUploader();
const preview = new Box.Preview();

let gAccessToken; // Developer access token token.
let gFolderId = 0;

// Runs when access token submitted.
function onSubmit() {
  getFolderItems("0")
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        return res.json();
      } else {
        throw new Error();
      }
    })
    .then((data) => {
      console.log(`${data.entries[0].name}: ${data.entries[0].id}`);
      gFolderId = `${data.entries[0].id}`;
    })
    .catch((err) => console.log("fetch() failed"));

  console.log(
    createFolder("TestFolder", gFolderId).then((res) => {
      return res.json();
    })
  );
}

// Display Box UI Elements.
function showBoxUi() {
  // Show the content uploader
  uploader.show(gFolderId, gAccessToken, {
    container: "#uploader",
  });

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

function main() {
  document.getElementById("devTokenSubmit").addEventListener("click", () => {
    gAccessToken = document.getElementById("devTokenInput").value;
    onSubmit();
    showBoxUi();
  });
}

main();
