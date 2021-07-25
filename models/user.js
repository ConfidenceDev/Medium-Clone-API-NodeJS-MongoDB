async function signup(Users, obj) {
  try {
    return new Promise(async (resolve, reject) => {
      const password = await bcrypt.hash(obj.password1, 10)
      const repass = await bcrypt.hash(obj.password2, 10)
      const user = {
        username: obj.username,
        email: obj.email,
        password1: password,
        password2: repass,
      }

      await new Users(user)
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

async function suspended(User, userId) {
  try {
    return new Promise(async (resolve, reject) => {
      const item = await User.findById(userId)
      if (item) {
        resolve(item)
      } else {
        reject()
      }
    })
  } catch (error) {
    console.log(error)
  }
}

async function fetch(Posts) {
  try {
    return new Promise(async (resolve, reject) => {
      //Fetch all items with specific fields
      //const items = await Product.find().select("name image -_id")
      const items = await Posts.find().sort({ createdOn: "desc" })
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

async function fetchAt(Posts, postId) {
  try {
    return new Promise(async (resolve, reject) => {
      const item = await Posts.findById(postId)
      if (item) {
        resolve(item)
      } else {
        reject()
      }
    })
  } catch (error) {
    console.log(error)
  }
}

async function fetchByCategory(Posts, category) {
  try {
    return new Promise(async (resolve, reject) => {
      const items = await Posts.find({ category: category })
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

async function create(Posts, obj) {
  try {
    return new Promise(async (resolve, reject) => {
      const post = new Posts(obj)
      post
        .save()
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        })
    })
  } catch (error) {
    console.log(error)
  }
}

async function update(id, obj, Posts) {
  try {
    return new Promise(async (resolve, reject) => {
      Posts.findOneAndUpdate(id, obj, { new: true, useFindAndModify: false })
        .then((item) => {
          resolve(item)
        })
        .catch((err) => {
          reject(err)
        })
    })
  } catch (error) {
    console.log(error)
  }
}

async function like(Posts, postId, obj) {
  try {
    return new Promise(async (resolve, reject) => {
      Posts.findByIdAndUpdate(
        postId,
        {
          $push: { likes: obj },
        },
        {
          new: true,
        }
      ).exec((err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  } catch (error) {
    console.log(error)
  }
}

async function unLike(Posts, postId, obj) {
  try {
    return new Promise(async (resolve, reject) => {
      Posts.findByIdAndUpdate(
        postId,
        {
          $pull: { likes: obj },
        },
        {
          new: true,
        }
      ).exec((err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  } catch (error) {
    console.log(error)
  }
}

async function comment(Posts, postId, obj) {
  try {
    return new Promise(async (resolve, reject) => {
      Posts.findByIdAndUpdate(
        postId,
        {
          $push: { comment: obj },
        },
        {
          new: true,
        }
      ).exec((err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  } catch (error) {
    console.log(error)
  }
}

async function report(Posts, postId, obj) {
  try {
    return new Promise(async (resolve, reject) => {
      Posts.findByIdAndUpdate(
        postId,
        {
          $push: { reports: obj },
        },
        {
          new: true,
        }
      ).exec((err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  signup,
  suspended,
  fetch,
  fetchAt,
  fetchByCategory,
  create,
  like,
  unLike,
  comment,
  update,
  report,
}
