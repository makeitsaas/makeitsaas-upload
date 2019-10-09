const fileExtensionRegEx = /^.*\.(\w{1,6})$/;

module.exports = {
    getRequestHostAndProtocol: (req) => {
        const host = req.headers.host;
        const scheme = `http${req.secure ? 's':''}`;

        return `${scheme}://${host}`;

    },
    getFileExtension: (file) => {
        if(!file || !file.name || !fileExtensionRegEx.test(file.name)) {
            throw new Error('Invalid file name : ' + (file && file.name));
        }

        return file.name.replace(fileExtensionRegEx, '$1');
    }
};
