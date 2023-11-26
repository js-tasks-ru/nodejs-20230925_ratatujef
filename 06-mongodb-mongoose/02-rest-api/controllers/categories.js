const Category = require('../models/Category');
const mapCategory = require('../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find({})

  if (categories.length) {
    ctx.body = { categories: categories.map(mapCategory) };
    ctx.status = 200
  } else {
    ctx.status = 404
  }
};
