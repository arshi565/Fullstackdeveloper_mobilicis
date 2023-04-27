/**
 * This function defines the routes for fetching and displaying data from the backend.
 * It fetches data based on certain conditions and displays it in a table format on the frontend.
 * 
 * @param {object} app - The Express app object
 * @param {object} db - The database object
 */
function defineRoutes(app, db) {
  // Route for fetching users with income lower than $5 USD and have a car of brand “BMW” or “Mercedes”
  app.get('/users/bmw_mercedes_income', (req, res) => {
    db.collection('users').find({
      $and: [
        { income: { $lt: 5 } },
        { $or: [{ car: 'BMW' }, { car: 'Mercedes' }] }
      ]
    }).toArray((err, result) => {
      if (err) throw err;
      res.render('users_table', { data: result });
    });
  });

  // Route for fetching male users with phone price greater than 10,000
  app.get('/users/male_phone_price', (req, res) => {
    db.collection('users').find({
      $and: [
        { gender: 'male' },
        { phone_price: { $gt: 10000 } }
      ]
    }).toArray((err, result) => {
      if (err) throw err;
      res.render('users_table', { data: result });
    });
  });

  // Route for fetching users whose last name starts with “M” and has a quote character length greater than 15 and email includes his/her last name
  app.get('/users/last_name_quote_email', (req, res) => {
    db.collection('users').find({
      $and: [
        { last_name: { $regex: /^M/ } },
        { $where: 'this.email.includes(this.last_name)' },
        { $expr: { $gt: [{ $strLenCP: '$quote' }, 15] } }
      ]
    }).toArray((err, result) => {
      if (err) throw err;
      res.render('users_table', { data: result });
    });
  });

  // Route for fetching users with a car of brand “BMW”, “Mercedes” or “Audi” and whose email does not include any digit
  app.get('/users/bmw_mercedes_audi_email', (req, res) => {
    db.collection('users').find({
      $and: [
        { $or: [{ car: 'BMW' }, { car: 'Mercedes' }, { car: 'Audi' }] },
        { email: { $not: { $regex: /\d/ } } }
      ]
    }).toArray((err, result) => {
      if (err) throw err;
      res.render('users_table', { data: result });
    });
  });

  // Route for fetching top 10 cities with the highest number of users and their average income
  app.get('/users/top_cities', (req, res) => {
    db.collection('users').aggregate([
      { $group: { _id: '$city', count: { $sum: 1 }, avg_income: { $avg: '$income' } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray((err, result) => {
      if (err) throw err;
      res.render('cities_table', { data: result });
    });
  });
}
