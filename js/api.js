// Base fetch function with common headers.
// Note: use a CORS proxy server to fix local development CORS errors.
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
  let res;
  // Uncomment to fix local development CORS errors.
  // fetch("https://cors-anywhere.herokuapp.com/" + url, _init)
  fetch(url, _init)
    .then(checkError)
    .then((response) => {
      res = response;
      console.log(res);
      return response;
    })
    .catch((error) => {
      res = error;
    });
  return res;
}

function checkError(response) {
  if (response.status >= 200 && response.status <= 299) {
    return response.json();
  } else {
    throw Error(response.statusText);
  }
}

// Returns a list of all items in a folder.
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

// Check if a developer token is valid.
function isValidAccessToken(devToken) {
  let isValid = true;
  try {
    getFolderItems("0");
  } catch (error) {
    isValid = false;
  } finally {
    return isValid;
  }
}
