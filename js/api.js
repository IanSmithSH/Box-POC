// Base fetch function with common headers.
// Note: currently passes API calls through CORS Anywhere to fix local development
// CORS errors.
function fetchBase(url, init) {
  const headers = {
    Authorization: `Bearer ${gAccessToken}`,
    "Content-Type": "application/json",
  };
  let _init = {
    headers: {
      ...headers,
      ...init.headers,
    },
    ...init,
  };
  // return fetch("https://cors-anywhere.herokuapp.com/" + url, _init);
  return fetch(url, _init);
}

// Returns a list of all items in a folder/
function getFolderItems(folderId) {
  return fetchBase(`https://api.box.com/2.0/folders/${folderId}/items`, {
    method: "GET",
  });
}

// Create folder REST API call (https://developer.box.com/reference/post-folders/)
function createFolder(folderName, parentId) {
  return fetchBase("https://api.box.com/2.0/folders", {
    method: "POST",
    body: JSON.stringify({
      name: folderName,
      parent: {
        id: parentId,
      },
    }),
  });
}
