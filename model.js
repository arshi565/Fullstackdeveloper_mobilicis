/**
 * This function fetches data from the backend and displays it on the frontend in a table format based on certain conditions.
 * 
 * @param {string} url - The URL of the backend API endpoint.
 * @returns {Promise} - A promise that resolves with the data to be displayed in the table.
 */
async function fetchDataAndDisplayTable(url) {
  try {
    // Fetch data from the backend API endpoint
    const response = await fetch(url);
    const data = await response.json();

    // Filter the data based on the given conditions
    const filteredData = data.filter(user => {
      // Problem 1: Users which have income lower than $5 USD and have a car of brand “BMW” or “Mercedes”.
      if (user.income < 5 && (user.carBrand === "BMW" || user.carBrand === "Mercedes")) {
        return true;
      }

      // Problem 2: Male Users which have phone price greater than 10,000.
      if (user.gender === "male" && user.phonePrice > 10000) {
        return true;
      }

      // Problem 3: Users whose last name starts with “M” and has a quote character length greater than 15 and email includes his/her last name.
      if (user.lastName.startsWith("M") && user.quote.length > 15 && user.email.includes(user.lastName)) {
        return true;
      }

      // Problem 4: Users which have a car of brand “BMW”, “Mercedes” or “Audi” and whose email does not include any digit.
      if ((user.carBrand === "BMW" || user.carBrand === "Mercedes" || user.carBrand === "Audi") && !/\d/.test(user.email)) {
        return true;
      }

      return false;
    });

    // Sort the filtered data by city and count the number of users in each city
    const cityCounts = {};
    filteredData.forEach(user => {
      if (cityCounts[user.city]) {
        cityCounts[user.city]++;
      } else {
        cityCounts[user.city] = 1;
      }
    });

    // Get the top 10 cities with the highest number of users
    const topCities = Object.keys(cityCounts).sort((a, b) => cityCounts[b] - cityCounts[a]).slice(0, 10);

    // Calculate the average income for each of the top 10 cities
    const cityAverages = topCities.map(city => {
      const cityUsers = filteredData.filter(user => user.city === city);
      const totalIncome = cityUsers.reduce((acc, user) => acc + user.income, 0);
      const averageIncome = totalIncome / cityUsers.length;
      return { city, averageIncome };
    });

    // Display the data in a table format
    const table = document.createElement("table");
    const headerRow = document.createElement("tr");
    const headers = ["First Name", "Last Name", "Email", "City", "Income", "Car Brand", "Phone Price", "Quote"];
    headers.forEach(header => {
      const th = document.createElement("th");
      th.textContent = header;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    filteredData.forEach(user => {
      const row = document.createElement("tr");
      const cells = [user.firstName, user.lastName, user.email, user.city, user.income, user.carBrand, user.phonePrice, user.quote];
      cells.forEach(cell => {
        const td = document.createElement("td");
        td.textContent = cell;
        row.appendChild(td);
      });
      table.appendChild(row);
    });

    document.body.appendChild(table);

    return filteredData;
  } catch (error) {
    console.error(error);
  }
}

// Sample usage
fetchDataAndDisplayTable("https://example.com/api/users")
  .then(data => console.log(data))
  .catch(error => console.error(error));
