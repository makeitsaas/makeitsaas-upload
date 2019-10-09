const utils = require('./utils');

module.exports = (app, fileUploadMiddleware) => {
    app.get('/example/form.html', (req, res) => {
        const baseUrl = utils.getRequestHostAndProtocol(req);
        res.send(HtmlForm(baseUrl));
    });
    app.post('/example/api', fileUploadMiddleware, (req, res) => {
        if (req.files.fileKey) {
            res.send({
                message: 'File received. Name=' + req.files.fileKey.name
            });
        } else {
            res.status(500).send({
                message: 'unknown error'
            })
        }

    });
};


const HtmlForm = (baseUrl) => `
<html>
  <body>
    <h1>Example form</h1>
    <p>This will post a file to an example endpoint that will detect the uploaded file :</p>
    <form ref='uploadForm' 
      id='uploadForm' 
      action='${baseUrl}/example/api' 
      method='post' 
      encType="multipart/form-data">
        <input type="file" name="fileKey" />
        <input type='submit' value='Upload!' />
    </form>     
  </body>
</html>
`;
