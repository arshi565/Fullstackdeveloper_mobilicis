/**
 * This function fetches data from the backend and displays it on the frontend in a table format
 * based on the given conditions.
 * 
 * @param {Object} req - The request object containing the conditions to filter the data
 * @param {Object} res - The response object to send the filtered data to the frontend
 * @param {Function} next - The next middleware function to be called
 * 
 * @returns {Object} - The filtered data in a table format
 */
function fetchData(req, res, next) {
  try {
    // Problem 1: Users which have income lower than $5 USD and have a car of brand “BMW” or “Mercedes”
    const problem1Data = backendData.filter(user => user.income < 5 && (user.car === "BMW" || user.car === "Mercedes"));

    // Problem 2: Male Users which have phone price greater than 10,000
    const problem2Data = backendData.filter(user => user.gender === "Male" && user.phonePrice > 10000);

    // Problem 3: Users whose last name starts with “M” and has a quote character length greater than 15 and email includes his/her last name
    const problem3Data = backendData.filter(user => user.lastName.startsWith("M") && user.quote.length > 15 && user.email.includes(user.lastName));

    // Problem 4: Users which have a car of brand “BMW”, “Mercedes” or “Audi” and whose email does not include any digit
    const problem4Data = backendData.filter(user => (user.car === "BMW" || user.car === "Mercedes" || user.car === "Audi") && !/\d/.test(user.email));

    // Problem 5: Show the data of top 10 cities which have the highest number of users and their average income
    const cityData = {};
    backendData.forEach(user => {
      if (cityData[user.city]) {
        cityData[user.city].count++;
        cityData[user.city].totalIncome += user.income;
      } else {
        cityData[user.city] = {
          count: 1,
          totalIncome: user.income
        };
      }
    });
    const problem5Data = Object.entries(cityData)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(city => {
        return {
          city: city[0],
          averageIncome: city[1].totalIncome / city[1].count
        };
      });

    // Combine all the filtered data
    const filteredData = {
      problem1: problem1Data,
      problem2: problem2Data,
      problem3: problem3Data,
      problem4: problem4Data,
      problem5: problem5Data
    };

    // Send the filtered data to the frontend in a table format
    res.send(`<table>
                <thead>
                  <tr>
                    <th>Problem</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.entries(filteredData).map(entry => {
                    return `<tr>
                              <td>${entry[0]}</td>
                              <td>${JSON.stringify(entry[1])}</td>
                            </tr>`;
                  }).join("")}
                </tbody>
              </table>`);
  } catch (error) {
    // Call the next middleware function with the error
    next(error);
  }
}

/**
 * This middleware function logs any errors that occur during the fetchData function.
 * 
 * @param {Object} err - The error object
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function to be called
 */
function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

module.exports = {
  fetchData,
  logErrors
};
