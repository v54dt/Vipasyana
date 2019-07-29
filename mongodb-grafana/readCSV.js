const csv = require('csv-parser');
const fs = require('fs');

fs.createReadStream('ecg_data_0.csv')
  .pipe(csv())
  .on('data', (row) => {
    console.log(row.data);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });