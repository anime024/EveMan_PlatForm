const {DeleteObjectsCommand}=require('@aws-sdk/client-s3')
const {client}=require('../config/s3')
async function deleteFilesFromS3(keys){
    try{
        if(!keys.length) return;

    await client.send(
        new DeleteObjectsCommand({
            Bucket:process.env.AWS_BUCKET_NAME,
            Delete:{
                Objects:keys.map(key=>({Key:key}))
            }
        })
    );

    console.log("DELETED FROM S3");
    }catch(error){
        console.log("ERROR IN DLEETE FROM S3 ",error);
    }
}

module.exports={deleteFilesFromS3}