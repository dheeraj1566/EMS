const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ac-zqogc3u-shard-00-00.4ont6qs.mongodb.net:27017,ac-zqogc3u-shard-00-01.4ont6qs.mongodb.net:27017,ac-zqogc3u-shard-00-02.4ont6qs.mongodb.net:27017/fsl?ssl=true&replicaSet=atlas-q6tt9g-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`
  );
  console.log("MongoDB connected");
};

module.exports = connectDB;
