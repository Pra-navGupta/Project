const express = require('express');
const axios = require('axios');
const { Client } = require('pg');

const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// PostgreSQL configuration
const pgClient = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'WazirAPI',
  password: 'Rajan@123',
  port: 5432,
});

pgClient.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Error connecting to PostgreSQL', err));

  pgClient.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error executing query:', err);
    } else {
      console.log('PostgreSQL is working:', res.rows[0].now);
    }
  });
  
// Fetch data from WazirX API
const fetchWazirXData = async () => {
    try {
      const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
      const data = response.data;
      console.log('Type of data:', typeof data); // Log the type of data
    //   console.log('Data from WazirX API:' + data.nulsinr.name); // Log the data
      return data;
    } catch (error) {
      console.error('Error fetching data from WazirX API:', error);
      return [];
    }
  };
  
  

// Store data in PostgreSQL

// const storeDataInDatabase = async () => {
// console.log('storeDataInDatabase function is called');
//   const data = await fetchWazirXData();

// //   fetchWazirXData()
// //   .then(data => {
// //     console.log('Data from WazirX API:', data);
// //   })
// //   .catch(error => {
// //     console.error('Error fetching data from WazirX API:', error);
// //   });

// console.log(typeof(data))
  
//     const values = data.slice(0, 10).map(item => [
//       item.symbol,
//       item.last,
//       item.buy,
//       item.sell,
//       item.volume,
//       item.base_unit,
//     ]);

//     const query = `
//       INSERT INTO wazirx_data (name, last, buy, sell, volume, base_unit)
//       VALUES ${values.map((_, index) => `($${index * 6 + 1}, $${index * 6 + 2}, $${index * 6 + 3}, $${index * 6 + 4}, $${index * 6 + 5}, $${index * 6 + 6})`).join(', ')}
//     `;

//     try {
//       await pgClient.query(query, values.flat());
//       console.log('Data stored in PostgreSQL');
//     } catch (error) {
//       console.error('Error storing data in PostgreSQL:', error);
//     }
//   }
// Store data in PostgreSQL

const storeDataInDatabase = async () => {
    console.log('storeDataInDatabase function is called');
    const data = await fetchWazirXData();
  
    // Ensure that data is an object
    if (typeof data === 'object' && data !== null) {
      const tradingPairs = Object.keys(data).slice(0, 10); // Get the keys of the first 10 trading pairs
      const values = tradingPairs.map(pair => {
        const item = data[pair];
        // Check if "name" is null and provide a default value if needed
        const name = item.name || 'Unknown'; // Replace 'Unknown' with your preferred default value
        return [
          name,
          item.last,
          item.buy,
          item.sell,
          item.volume,
          item.base_unit,
        ];
      });
      
  
      const query = `
        INSERT INTO wazirx_data (name, last, buy, sell, volume, base_unit)
        VALUES ${values.map((_, index) => `($${index * 6 + 1}, $${index * 6 + 2}, $${index * 6 + 3}, $${index * 6 + 4}, $${index * 6 + 5}, $${index * 6 + 6})`).join(', ')}
      `;
  
      try {
        await pgClient.query(query, values.flat());
        console.log('Data stored in PostgreSQL');
      } catch (error) {
        console.error('Error storing data in PostgreSQL:', error);
      }
    } else {
      console.error('Invalid data format received from WazirX API');
    }
  };


// Create a route to retrieve data from the database
app.get('/getWazirXData', async (req, res) => {
  try {
    const query = 'SELECT * FROM wazirx_data LIMIT 10';
    const result = await pgClient.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving data from PostgreSQL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Call the function to fetch and store data when the server starts
storeDataInDatabase();
