const mongoose = require("mongoose");

const { MONGO_URL } = process.env;

exports.connect = () => {
  mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("DB Connected Sucessfully"))
    .catch((error) => {
      console.log("Connection Failed");
      console.log(error);
      process.exit(1);
    });
};
