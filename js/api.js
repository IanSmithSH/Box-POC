const ROOT_FOLDER_ID = "0";

// Base fetch function with common headers.
// Note: use a CORS proxy server to fix local development CORS errors.
async function fetchBase(url, init) {
  let _init = { ...init };
  let _headers = {
    Authorization: `Bearer ${gAccessToken}`,
  };
  if (_init.headers) {
    Object.assign(_init.headers, _headers);
  } else {
    _init.headers = _headers;
  }

  // Uncomment to fix local development CORS errors.
  // fetch("https://cors-anywhere.herokuapp.com/" + url, _init)
  return await fetch(url, _init)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
}

// Returns a list of all items in a folder.
async function getFolderItems(folderId) {
  return await fetchBase(`https://api.box.com/2.0/folders/${folderId}/items`, {
    method: "GET",
  });
}

// Create folder REST API call
// https://developer.box.com/reference/post-folders/
async function createFolder(folderName, parentId) {
  return await fetchBase("https://api.box.com/2.0/folders", {
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
// type: "files" | "folders"
// id: file / folder ID
// scope: owner of the template ("global" | "enterprise" | "enterprise_*")
// template: key of template to be used
// metadata: key value pairs as defined by the template
async function addMetadata(type, id, scope, template, metadata) {
  return await fetchBase(
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
async function addDocTransReqMetadata(id, metadata) {
  return await addMetadata(
    "files",
    id,
    "enterprise",
    "doctranslationrequest",
    metadata
  );
}

// Get an instance of a metadata template on a folder or file.
// https://developer.box.com/guides/metadata/instances/get/
// type: "file" | "folder"
// id: file / folder ID
// scope: owner of the template ("global" | "enterprise" | "enterprise_*")
// template: key of template to be used
async function getMetadata(type, id, scope, template) {
  return await fetchBase(
    `https://api.box.com/2.0/${type}/${id}/metadata/${scope}/${template}`,
    {
      method: "GET",
    }
  );
}

// Get metadata for a file using the "DocTranslationRequest" template.
async function getDocTransReqMetadata(id) {
  return await getMetadata("files", id, "enterprise", "doctranslationrequest");
}

//

// Get all metadata templates in a scope.
// scope: "enterprise" | "global"
async function getMetadataTemplates(scope) {
  return await fetchBase(
    `https://api.box.com/2.0/metadata_templates/${scope}`,
    {
      method: "GET",
    }
  );
}

// Check if a developer token is valid.
async function isValidAccessToken(devToken) {
  let isValid = true;
  try {
    await getFolderItems(ROOT_FOLDER_ID);
  } catch (error) {
    isValid = false;
  } finally {
    return isValid;
  }
}
