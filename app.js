const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const utils = require('./lib/utils');
const example = require('./lib/example');
const authMiddleware = require('./future-packages/makeitsaas/api-auth-middleware');
const uuidGenerator = require('uuid/v1');

const app = express();
const port = 3006;
const fileUploadMiddleware = fileUpload({
    limits: {fileSize: 50 * 1024 * 1024},
    safeFileNames: true,
    preserveExtension: true
});
const filesDirectory = __dirname + '/files';

app.use(cors());
app.use(authMiddleware);
example(app, fileUploadMiddleware);

app.use('/files', express.static('files'));

app.post('/upload', fileUploadMiddleware, (req, res) => {
    console.log(req.files); // the uploaded file object
    const uploadedFiles = [];
    const requestHostname = utils.getRequestHostAndProtocol(req);

    for (let key in req.files) {
        if(req.files.hasOwnProperty(key)) {
            const file = req.files[key];
            const fileUuid = uuidGenerator();
            const fileName = `${fileUuid}.${utils.getFileExtension(file)}`;
            const relativeUrl = `/files/${fileName}`;

            uploadedFiles.push(new Promise(((resolve, reject) => {
                file.mv(`${filesDirectory}/${fileName}`, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            uuid: fileUuid,
                            relativeUrl: relativeUrl,
                            absoluteUrl: `${requestHostname}${relativeUrl}`,
                            originalKey: key
                        })
                    }
                });
            })));
        }
    }

    Promise.all(uploadedFiles).then(files => {
        res.send({
            message: `file${files.length ? 's' : ''} has been saved`,
            files: files
        });
    }).catch(err => res.status(500).send({message: 'error during files upload', error: err}));
});

app.get('*', (req, res) => {
    res.send({
        message: 'ok'
    });
});

app.listen(port, function () {
    console.log(`listening on port ${port}`);
});
