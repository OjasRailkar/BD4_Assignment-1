const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './BD4_Assignment_1/database.sqlite',
    driver: sqlite3.Database,
  });
})();

//Exercise 1: Get All Restaurants

async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants ';

  let response = await db.all(query, []);

  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let results = await fetchAllRestaurants();

    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found.' });
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Exercise 2: Get Restaurant by ID

async function fetchRestaurantById(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';

  let response = await db.get(query, [id]);

  return { restaurant: response };
}

app.get('/restaurants/details/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);

    let results = await fetchRestaurantById(id);

    if (results.restaurant === undefined) {
      return res.status(404).json({ message: 'No restaurant found.' });
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Exercise 3: Get Restaurants by Cuisine
async function fetchRestaurantByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ? ';

  let response = await db.all(query, [cuisine]);

  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    let cuisine = req.params.cuisine;

    let results = await fetchRestaurantByCuisine(cuisine);

    if (results.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No restaurants found by cuisine, ' + cuisine });
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Exercise 4: Get Restaurants by Filter.Fetch restaurants based on filters such as veg/non-veg, outdoor seating, luxury, etc.

async function fetchRestaurantsByFilters(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    ' SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury =?';

  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);

  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let hasOutdoorSeating = req.query.hasOutdoorSeating;
    let isLuxury = req.query.isLuxury;

    let results = await fetchRestaurantsByFilters(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );

    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found.' });
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Exercise 5: Get Restaurants Sorted by Rating ( highest to lowest ).
async function sortRestaurnatsByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';

  let sortedRestaurants = await db.all(query, []);

  return { restaurants: sortedRestaurants };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let results = await sortRestaurnatsByRating();

    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found.' });
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// **************************************  DISHES APIs *********************************************

//Exercise 6: Get All Dishes
async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes';

  let response = await db.all(query);

  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  try {
    let results = await fetchAllDishes();

    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found' });
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Exercise 7: Get Dish by ID
async function getDishById(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';

  let response = await db.get(query, [id]);

  return { dish: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);

    let results = await getDishById(id);

    if (results.dish === undefined) {
      return res.status(404).json({ message: 'No dish found' });
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Exercise 8: Get Dishes by Filter
async function getDishByFilter(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';

  let response = await db.all(query, [isVeg]);

  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;

    let results = await getDishByFilter(isVeg);

    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found' });
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Exercise 9: Get Dishes Sorted by Price ( lowest to highest ).
async function sortDishesByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price';

  let sortedDishes = await db.all(query);

  return { dishes: sortedDishes };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let results = await sortDishesByPrice();

    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found' });
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
