const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const s3 = new aws.S3();

function removeFile(fileName) {
  if (process.env.STORAGE_TYPE === 's3') {
    return s3
      .deleteObject({
        Bucket: process.env.BUCKET_NAME,
        key: fileName,
      })
      .promise()
      .then((response) => {
        console.log(response.status);
      })
      .catch((response) => {
        console.log(response.status);
      });
  } else {
    return promisify(fs.unlink)(
      path.resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', fileName)
    );
  }
}

module.exports = removeFile;
