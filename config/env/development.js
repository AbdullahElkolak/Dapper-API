
module.exports = {
    JWT_SECRET            : process.env.JWT_SECRET,
    DB_URL                : process.env.DAPPER_DEV_MONGO_URI,
    S3_BUCKET             : process.env.S3_BUCKET,
    AWS                   : {
        "accessKeyId"     : process.env.AWS_ACCESS_KEY_ID,
        "secretAccessKey" : process.env.AWS_SECRET_ACCESS_KEY,
        "region"          : 'ap-southeast-1'
    }
};
