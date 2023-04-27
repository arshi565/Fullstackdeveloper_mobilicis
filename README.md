# Fullstackdeveloper_mobilicis
Node.js Application using Express Framework and MongoDB Database
This is a Node.js application built using the Express framework and MongoDB database. It provides API endpoints to fetch and filter user data from the database.

Requirements
Node.js
MongoDB
Installation
Clone the repository:
bash
Copy code
git clone https://github.com/example/nodejs-express-mongodb.git
Install dependencies:
bash
Copy code
cd nodejs-express-mongodb
npm install
Create a .env file in the project root directory with the following content:
bash
Copy code
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sample_data
Note: You can change the PORT and MONGODB_URI values according to your preferences.

Seed the database with sample data:
bash
Copy code
npm run seed
Start the server:
bash
Copy code
npm start
API Endpoints
GET /users/income-car
Fetches users which have income lower than $5 USD and have a car of brand "BMW" or "Mercedes".

GET /users/male-phone
Fetches male users which have phone price greater than 10,000.

GET /users/last-name-quote
Fetches users whose last name starts with "M" and has a quote character length greater than 15 and email includes his/her last name.

GET /users/car-brand-email
Fetches users which have a car of brand "BMW", "Mercedes" or "Audi" and whose email does not include any digit.

GET /cities/top-users
Fetches the data of top 10 cities which have the highest number of users and their average income.

License
This project is licensed under the MIT License.
