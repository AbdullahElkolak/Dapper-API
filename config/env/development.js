
module.exports = {
    JWT_SECRET     : process.env.JWT_SECRET,
    DB_URL         : process.env.DAPPER_DEV_MONGO_URI,
    S3_BUCKET      : process.env.S3_BUCKET,
    AWS_ACCESS_KEY : process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY : process.env.AWS_SECRET_KEY
};
