const Products = require('../models/Product');
const Mapper = require('../mappers/product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const products = await Products.find({ $text: { $search: ctx.query.query } });

  if (products.length) {
    ctx.body = { products: products.map(Mapper) };
  } else ctx.body = { products: [] };
};
