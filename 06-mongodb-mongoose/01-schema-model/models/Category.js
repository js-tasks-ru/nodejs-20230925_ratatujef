const mongoose = require('mongoose');
const connection = require('../libs/connection');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  }
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema]

  //Почему не работает как в примере ниже? 
  // пример из урока. пробовал даже добавлять строчку
  // const SubCategory = mongoose.model('SubCategory',subCategorySchema ) и указывать ref: SubCategory, но все равно тест ругается на остутствие поля title 30 строке

  // subcategories: [
  //   {
  //     type: mongoose.Types.ObjectId,
  //     ref: subCategorySchema
  //   }
  // ]
});



module.exports = connection.model('Category', categorySchema);