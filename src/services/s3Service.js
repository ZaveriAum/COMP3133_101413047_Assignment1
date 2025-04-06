const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand} = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3Client = require('../config/s3Client')
const {AppError} = require('../utilities/AppError')
require('dotenv').config();

const uploadFile = async (fileBuffer, fileName, mimeType, folder) => {
    
    try{
        const key = `${folder}/${uuidv4()}-${fileName}`

        const command = new PutObjectCommand({
            Bucket: process.env.COMP3133_AWS_BUCKET_NAME,
            Body: fileBuffer,
            Key: key,
            ContentType: mimeType
        });

        await s3Client.send(command);
        return key;
    }catch(e){
        throw new AppError("Internal Server Error", 500)
    }

}

const deleteFile = async (filename) => {

    const command = new DeleteObjectCommand({
        Bucket: process.env.COMP3133_AWS_BUCKET_NAME,
        Key: filename,
    })

    return s3Client.send(command);

}

const getObjectSignedUrl = async (key)=> {
  
    const command = new GetObjectCommand({
        Bucket: process.env.COMP3133_AWS_BUCKET_NAME,
        Key: key
      });
    const seconds = 60
    const url = await getSignedUrl(s3Client, command);
  
    return url
}

module.exports = {
    uploadFile,
    deleteFile,
    getObjectSignedUrl
}
