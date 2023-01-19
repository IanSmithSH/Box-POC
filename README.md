# Box UI Elements Proof of Concept

This site uses the official [Box UI Elements](https://developer.box.com/guides/embed/ui-elements/) and REST API to upload, preview, and add metadata to files.

## Usage

1. Create a new app in your Box developer console. Make sure to enable the "Write all files" application scope and set up CORS Domains.
2. Either go to the original demo [here](https://IanSmithSH.github.io/Box-POC) or the content explorer demo [here](https://iansmithsh.github.io/Box-POC/explorer.html).
3. Generate and enter the developer token found in your Box developer console and click "Submit".
   Note: the content explorer demo is.

## Info

Some test files are stored in the [test_files](test_files/) folder. The Box UI Elements are loaded from their CDN in [index.html](index.html). [api.js](js/api.js) contains all functions which directly use the REST API. [index.js](js/index.js) contains the page logic and uses both the UI Elements and REST API.
