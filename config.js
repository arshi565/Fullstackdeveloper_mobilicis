/**
 * This function fetches data from the backend and displays it on the frontend in a table format based on certain criteria.
 * 
 * @param {string} url - The URL of the backend API endpoint.
 * @param {object} config - The configuration object containing the criteria for filtering and displaying the data.
 * @param {string[]} config.cars - An array of car brands to filter by.
 * @param {number} config.minIncome - The minimum income threshold to filter by.
 * @param {number} config.phonePrice - The phone price threshold to filter by.
 * @param {string} config.lastNameStartsWith - The starting letter of the last name to filter by.
 * @param {number} config.quoteLength - The quote character length threshold to filter by.
 * @param {number} config.topCities - The number of top cities to display.
 * 
 * @returns {Promise} A promise that resolves with the fetched data in a table format.
 */
function fetchDataAndDisplay(url, config) {
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      // Filter the data based on the given criteria
      const filteredData = data.filter(user => {
        const hasCar = config.cars.includes(user.carBrand);
        const hasLowIncome = user.income < config.minIncome;
        const hasHighPhonePrice = user.phonePrice > config.phonePrice;
        const hasLastNameStartingWith = user.lastName.startsWith(config.lastNameStartsWith);
        const hasQuoteLengthGreaterThan = user.quote.length > config.quoteLength;
        const hasEmailMatchingLastName = user.email.includes(user.lastName);

        return (hasCar && hasLowIncome) || (user.gender === 'male' && hasHighPhonePrice) || (hasLastNameStartingWith && hasQuoteLengthGreaterThan && hasEmailMatchingLastName) || (config.cars.includes(user.carBrand) && !/\d/.test(user.email));
      });

      // Group the data by city and calculate the average income
      const groupedData = filteredData.reduce((acc, user) => {
        if (!acc[user.city]) {
          acc[user.city] = {
            count: 0,
            totalIncome: 0
          };
        }

        acc[user.city].count++;
        acc[user.city].totalIncome += user.income;

        return acc;
      }, {});

      // Sort the cities by the number of users and get the top N cities
      const topCities = Object.keys(groupedData)
        .sort((a, b) => groupedData[b].count - groupedData[a].count)
        .slice(0, config.topCities);

      // Create the table HTML
      let tableHtml = '<table><thead><tr><th>Name</th><th>Email</th><th>City</th><th>Income</th></tr></thead><tbody>';

      filteredData.forEach(user => {
        if (topCities.includes(user.city)) {
          tableHtml += `<tr><td>${user.firstName} ${user.lastName}</td><td>${user.email}</td><td>${user.city}</td><td>${user.income}</td></tr>`;
        }
      });

      tableHtml += '</tbody></table>';

      return tableHtml;
    })
    .catch(error => {
      console.error(error);
      return 'Error fetching data';
    });
}

// Sample config object
const config = {
  cars: ['BMW', 'Mercedes', 'Audi'],
  minIncome: 5,
  phonePrice: 10000,
  lastNameStartsWith: 'M',
  quoteLength: 15,
  topCities: 10
};

// Sample usage
fetchDataAndDisplay('https://example.com/api/users', config)
  .then(tableHtml => {
    document.getElementById('table-container').innerHTML = tableHtml;
  })
  .catch(error => {
    console.error(error);
  });
