const { Category } = require("../schema/category")

//@desc     Create a new category
//@method   CREATE
async function createCategory(req, res) {
  try {
    const body = await postData(req)
    const obj = JSON.parse(body)

    const category = {
      name: obj.name,
    }

    const newCategory = await new Category(category).save()
    if (!newCategory) {
      res.status(422).json({ error: error })
    } else {
      res.status(200).json(newCategory)
    }
  } catch (error) {
    console.log(error)
  }
}

//@desc     Get all categories
//@method   READ
async function fetchAllCategories(res) {
  try {
    const categories = await Category.find({}).sort({
      date: -1,
    })
    if (!categories) {
      res.status(404).json("No category Found")
    } else {
      res.status(200).json(categories)
    }
  } catch (error) {
    console.log(error)
  }
}

//@desc     Get a category
//@method   READ
async function fetchCategory(id, res) {
  try {
    const category = await Category.findById({ _id: id }).select("name -_id")
    if (!category) {
      res.status(404).json("Not Found")
    } else {
      res.status(200).json(category)
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  createCategory,
  fetchAllCategories,
  fetchCategory,
}
