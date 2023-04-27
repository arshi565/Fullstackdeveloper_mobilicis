// Import necessary libraries
const express = require('express');
const bodyParser = require('body-parser');
const data = require('./data.json');

// Create an instance of express
const app = express();

// Use body-parser middleware
app.use(bodyParser.json());

// Define routes
app.get('/problem1', (req, res) => {
  // Filter users with income lower than $5 USD and have a car of brand “BMW” or “Mercedes”
  const filteredUsers = data.filter(user => user.income < 5 && (user.car.brand === 'BMW' || user.car.brand === 'Mercedes'));
  
  // Return the filtered users in a table format
  res.send(`<table><thead><tr><th>Name</th><th>Income</th><th>Car Brand</th></tr></thead><tbody>${filteredUsers.map(user => `<tr><td>${user.name}</td><td>${user.income}</td><td>${user.car.brand}</td></tr>`).join('')}</tbody></table>`);
});

app.get('/problem2', (req, res) => {
  // Filter male users with phone price greater than 10,000
  const filteredUsers = data.filter(user => user.gender === 'male' && user.phone.price > 10000);
  
  // Return the filtered users in a table format
  res.send(`<table><thead><tr><th>Name</th><th>Phone Price</th></tr></thead><tbody>${filteredUsers.map(user => `<tr><td>${user.name}</td><td>${user.phone.price}</td></tr>`).join('')}</tbody></table>`);
});

app.get('/problem3', (req, res) => {
  // Filter users whose last name starts with “M” and has a quote character length greater than 15 and email includes his/her last name
  const filteredUsers = data.filter(user => user.name.split(' ')[1].startsWith('M') && user.quote.length > 15 && user.email.includes(user.name.split(' ')[1]));
  
  // Return the filtered users in a table format
  res.send(`<table><thead><tr><th>Name</th><th>Quote</th><th>Email</th></tr></thead><tbody>${filteredUsers.map(user => `<tr><td>${user.name}</td><td>${user.quote}</td><td>${user.email}</td></tr>`).join('')}</tbody></table>`);
});

app.get('/problem4', (req, res) => {
  // Filter users which have a car of brand “BMW”, “Mercedes” or “Audi” and whose email does not include any digit
  const filteredUsers = data.filter(user => (user.car.brand === 'BMW' || user.car.brand === 'Mercedes' || user.car.brand === 'Audi') && !/\d/.test(user.email));
  
  // Return the filtered users in a table format
  res.send(`<table><thead><tr><th>Name</th><th>Car Brand</th><th>Email</th></tr></thead><tbody>${filteredUsers.map(user => `<tr><td>${user.name}</td><td>${user.car.brand}</td><td>${user.email}</td></tr>`).join('')}</tbody></table>`);
});

app.get('/problem5', (req, res) => {
  // Group users by city and calculate the average income for each city
  const groupedData = data.reduce((acc, user) => {
    if (!acc[user.address.city]) {
      acc[user.address.city] = { count: 0, totalIncome: 0 };
    }
    acc[user.address.city].count++;
    acc[user.address.city].totalIncome += user.income;
    return acc;
  }, {});
  
  // Sort the cities by number of users in descending order and get the top 10
  const sortedCities = Object.keys(groupedData).sort((a, b) => groupedData[b].count - groupedData[a].count).slice(0, 10);
  
  // Return the top 10 cities and their average income in a table format
  res.send(`<table><thead><tr><th>City</th><th>Average Income</th></tr></thead><tbody>${sortedCities.map(city => `<tr><td>${city}</td><td>${(groupedData[city].totalIncome / groupedData[city].count).toFixed(2)}</td></tr>`).join('')}</tbody></table>`);
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
