const mongoose = require("mongoose")

exports.connect = async () => {
  try {
    if (process.env.NODE_ENV === "test") {
      const Mockgoose = require("mockgoose").Mockgoose
      const mockgoose = new Mockgoose(mongoose)

      mockgoose.prepareStorage().then(() => {
        mongoose
          .connect(process.env.LOCAL_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
          })
          .then((err, res) => {
            if (err) return rejection(err)
            resolve(err)
          })
      })
    } else {
      await mongoose
        .connect(process.env.LOCAL_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: true,
        })
        .then(() => {
          console.log("Database connected...")
        })
        .catch((err) => {
          console.log("Err: " + err)
        })
    }
  } catch (error) {
    console.log(error)
  }
}

exports.disconnect = () => {
  return mongoose.disconnect()
}
