const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const authMiddleware = require('./future-packages/makeitsaas/api-auth-middleware');

const app = express();
const port = 3006;
const fileUploadMiddleware = fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
});
const filesDirectory = __dirname + '/files';

app.use(cors());
app.use(authMiddleware);

app.use('/files', express.static('files'));

app.post('/upload', fileUploadMiddleware, (req, res) => {
    console.log(req.files); // the uploaded file object
    const file = req.files && req.files['file-0'];
    if(file) {
        file.mv(`${filesDirectory}/file-0.png`, (err) => {
            if(err) {
                res.status(500).send(err);
            } else {
                res.send({
                    message: 'ok files are ' + (file.name)
                });
            }
        });
    } else {
        res.status(400).send({message: 'cannot read files'});
    }
});

app.get('*', (req, res) => {
    res.send({
        message: 'ok'
    }) ;
});

app.listen(port, function () {
    console.log(`listening on port ${port}`);
});
