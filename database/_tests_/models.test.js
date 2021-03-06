// mysql2 doing dynamic lazy require of encodings ,but Jest not being able to handle this.
// So we need to add the following code. (reference: https://stackoverflow.com/questions/46227783/encoding-not-recognized-in-jest-js)
const iconv = require('iconv-lite');
const encodings = require('iconv-lite/encodings');

iconv.encodings = encodings;
//

const CategoriesData = require('../data/categories');
const GlassesData = require('../data/glasses');
const IngredientsData = require('../data/ingredients');
const { sequelize, Drink, Category, Glass, Ingredient } = require('../associate');
const { migrateCategories, migrateGlasses, migrateIngredients } = require('../migrate');
const { truncateTables, endConnection } = require('./util');

beforeAll(() => truncateTables());
afterAll(() => endConnection());

describe('check the environment', () => {
  test('should be running on test environment', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});

describe.each([
  [migrateCategories, Category, CategoriesData, 'category_name', 'strCategory'],
  [migrateGlasses, Glass, GlassesData, 'glass_name', 'strGlass'],
  [migrateIngredients, Ingredient, IngredientsData, 'ingredient_name', 'strIngredient1'],
])('test %p', (migrate, model, rawData, modelField, rawDataField) => {
  beforeAll(() => migrate());

  test('should have same amount of records as raw data(json)', () =>
    model.findAll().then(records => expect(records.length).toEqual(rawData.length)));

  test('should have the same first record as raw data(json)', () =>
    model.findAll().then(records => expect(records[0][modelField]).toEqual(rawData[0][rawDataField])));

  test('should have the same last record as raw data(json)', () => {
    const lastIndex = rawData.length - 1;
    return model
      .findAll()
      .then(records => expect(records[lastIndex][modelField]).toEqual(rawData[lastIndex][rawDataField]));
  });
});

test('should insert a drink with ingredients', () =>
  Drink.create({
    drink_name: 'awesome drink',
    instructions: 'Just mix them together.',
  })
    .then(drink => drink.addIngredients([1, 2, 3]))
    .then(drinkIngredients => expect(drinkIngredients[0].length).toBe(3)));
