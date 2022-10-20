// Base fetch function with common headers.
// Note: use a CORS proxy server to fix local development CORS errors.
function fetchBase(url, init) {
  let _init = {
    headers: {
      Authorization: `Bearer ${gAccessToken}`,
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
      return response;
    })
    .catch((error) => {
      res = error;
    });
  return res;
}

// Helper function for fetch request error handling.
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

// Create folder REST API call
// https://developer.box.com/reference/post-folders/
function createFolder(folderName, parentId) {
  return fetchBase("https://api.box.com/2.0/folders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: folderName,
      parent: {
        id: parentId,
      },
    }),
  });
}

// Create an instance of a metadata template on a folder or file
// https://developer.box.com/reference/post-files-id-metadata-id-id/
// type: "file" | "folder"
// id: file / folder ID
// scope: owner of the template ("global" | "enterprise" | "enterprise_*")
// template: name of template to be used
// metadata: key value pairs as defined by the template
function addMetadata(type, id, scope, template, metadata) {
  return fetchBase(
    `https://api.box.com/2.0/${type}/${id}/metadata/${scope}/${template}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    }
  );
}

// Add metadata to a file using a custom "DocTranslationRequest" template.
function addDocTransReqMetadata(id, metadata) {
  return addMetadata(
    "file",
    id,
    "enterprise",
    "DocTranslationRequest",
    metadata
  );
}

// Get an instance of a metadata template on a folder or file.
// https://developer.box.com/guides/metadata/instances/get/
// type: "file" | "folder"
// id: file / folder ID
// scope: owner of the template ("global" | "enterprise" | "enterprise_*")
// template: name of template to be used
function getMetadata(type, id, scope, template) {
  return fetchBase(
    `https://api.box.com/2.0/${type}/${id}/metadata/${scope}/${template}`,
    {
      method: "GET",
    }
  );
}

// Get metadata for a file using a custom "DocTranslationRequest" template.
function getDocTransReqMetadata(id) {
  return addMetadata("file", id, "enterprise", "DocTranslationRequest");
}

// Check if a developer token is valid.
function isValidAccessToken(devToken) {
  let isValid = true;
  try {
    let f = getFolderItems("0");
  } catch (error) {
    isValid = false;
  } finally {
    return isValid;
  }
}
