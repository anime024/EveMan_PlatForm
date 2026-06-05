const {RekognitionClient,CreateCollectionCommand}=require("@aws-sdk/client-rekognition")

const rekognitionClient=new RekognitionClient({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY,
        secretAccessKey:process.env.AWS_SECRET_KEY
    }
})


module.exports={rekognitionClient};