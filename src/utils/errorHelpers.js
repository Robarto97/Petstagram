const { MongooseError } = require("mongoose");

exports.getErrorMessage = (err) => {
  if (err instanceof MongooseError) {
    return Object.values(err.errors)[0];
  } else {
    return err.message;
  }
};
