const Product = require('../models/Product');
const mapProduct = require('../mappers/product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const { subcategory } = ctx.query;

  if (!subcategory) return next();
  const products = await Product.find({ subcategory: subcategory })
  ctx.body = { products: products.map(mapProduct) };
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});
  if (!products.length) ctx.throw(404, 'Not Found');

  ctx.body = { products: products.map(mapProduct) };
};

module.exports.productById = async function productById(ctx, next) {

  if (!mongoose.isValidObjectId(ctx.params.id)) ctx.throw(400, 'invalid ID');

  const product = await Product.findById(ctx.params.id);
  if (!product) {
    ctx.throw(404, 'not found');
  }

  ctx.body = { product: mapProduct(product) };
};

