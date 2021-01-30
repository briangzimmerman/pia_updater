const got                   = require('got');
const { createWriteStream } = require("fs");
const { spawn }             = require("child_process");

const downloadUrl        = 'https://www.privateinternetaccess.com/installer/x/download_installer_linux';
const urlRegex           = new RegExp('url=(https:\/\/.*\.run)');
const scriptFile         = '/tmp/pia.run';
const scriptWriterStream = createWriteStream(scriptFile);

// Create stream to write update script to. Run the script when done.
scriptWriterStream
.on('error', error => {
    console.log('Could not download script:', error);
})
.on('finish', () => {
    console.log('Script downloaded to:', scriptFile);
    console.log("Running script...\n");

    let shell = spawn('sh', [scriptFile], { stdio: 'inherit' });

    shell.on('error', (error) => {
        console.log(`\nError running script: ${error.message}`);
    }).on("close", code => {
        console.log(`\nChild process exited with code ${code}`);
    });
});

// Function to get the script download url from the html
let getDownloadUrl = function (downloadPageHtml)
{
    let regexMatches = urlRegex.exec(downloadPageHtml);
    
    return regexMatches[1] || false;
};

// Grab the html from the download page and download file
got(downloadUrl)
.then(response => {
    let url = getDownloadUrl(response.body);

    if (!url) {
        throw new Error('Could not find script url.');
    }

    return url;
})
.then(scriptDownloadUrl => {
    console.log('Found script url:', scriptDownloadUrl);
    console.log('Downloading script...');

    let downloadStream = got.stream(scriptDownloadUrl);
    downloadStream.pipe(scriptWriterStream);
})
.catch(error => {
    console.log(error);
});