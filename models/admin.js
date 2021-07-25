async function create(Admin, obj) {
  try {
    return new Promise(async (resolve, reject) => {
      const password = await bcrypt.hash(req.obj.password, 10)
      const user = {
        admin_id: obj.admin_id,
        email: obj.email,
        password: password,
      }
      await new Admin(user)
        .save()
        .then((newUser) => {
          resolve(newUser)
        })
        .catch((err) => {
          reject(err)
        })
    })
  } catch (error) {
    console.log(error)
  }
}

async function fetch(User) {
  try {
    return new Promise(async (resolve, reject) => {
      const items = await User.find().populate("posts")
      if (items) {
        resolve(items)
      } else {
        reject()
      }
    })
  } catch (error) {
    console.log(error)
  }
}

async function fetchAt(User, userId) {
  try {
    return new Promise(async (resolve, reject) => {
      //Fetch all items with specific fields
      //const items = await Product.find().select("name image -_id")
      const items = await User.findById(userId).populate("posts")
      if (items) {
        resolve(items)
      } else {
        reject()
      }
    })
  } catch (error) {
    console.log(error)
  }
}

async function reports(Report, filter) {
  try {
    return new Promise(async (resolve, reject) => {
      const items = await Report.find(filter)
      if (items) {
        resolve(items)
      } else {
        reject()
      }
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  create,
  fetch,
  fetchAt,
  reports,
}
