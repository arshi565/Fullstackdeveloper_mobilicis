/**
 * This function fetches data from the backend and displays it on the frontend in a table format
 * based on the given criteria.
 * 
 * @param {Object} req - The request object containing the necessary data to fetch from the backend.
 * @param {Object} res - The response object to send the fetched data to the frontend.
 * @returns {Object} - The fetched data in a table format.
 */
async function fetchData(req, res) {
  try {
    // Fetch the data from the backend based on the given criteria
    const data = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        criteria: [
          { income: { $lt: 5 }, carBrand: { $in: ['BMW', 'Mercedes'] } },
          { gender: 'male', phonePrice: { $gt: 10000 } },
          { lastName: { $regex: '^M' }, quoteLength: { $gt: 15 }, email: { $regex: '.*M.*' } },
          { carBrand: { $in: ['BMW', 'Mercedes', 'Audi'] }, email: { $regex: '^[^0-9]*$' } },
          { $group: { _id: '$city', avgIncome: { $avg: '$income' } }, $sort: { avgIncome: -1 }, $limit: 10 }
        ]
      })
    });

    // Convert the fetched data to a table format
    const tableData = convertToTable(data);

    // Send the table data to the frontend
    res.send(tableData);
  } catch (error) {
    // Log any errors that occur
    console.error(error);
    res.status(500).send('Error fetching data');
  }
}

/**
 * This function converts the fetched data to a table format.
 * 
 * @param {Object} data - The fetched data to be converted to a table format.
 * @returns {Object} - The converted data in a table format.
 */
function convertToTable(data) {
  // Convert the data to a table format
  const tableData = {
    headers: ['First Name', 'Last Name', 'Gender', 'Email', 'Phone', 'Car Brand', 'Income'],
    rows: []
  };

  data.forEach(user => {
    tableData.rows.push([
      user.firstName,
      user.lastName,
      user.gender,
      user.email,
      user.phone,
      user.carBrand,
      user.income
    ]);
  });

  return tableData;
}
