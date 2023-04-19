const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const cors = require('cors');
const app = express();
const PORT = 3001;
const mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Create MySQL connection pool
const pool = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: 'root',
	password: 'Starboylover@1',
	database: 'survey_results',
});

// Endpoint to receive survey answers
app.post('/survey', (req, res) => {
	const surveyResponse = req.body;
	surveyResponse.id = uuid.v4();
	// Insert answers into MySQL database
	pool.getConnection((error, connection) => {
		if (error) {
			console.error('Error getting database connection:', error);
			res.status(500).send('Error getting database connection');
		} else {
			const values = [surveyResponse.id, JSON.stringify(surveyResponse)];
			const sql = 'INSERT INTO survey_responses (id, response) VALUES (?, ?)';
			pool.query(sql, values, (error) => {
				if (error) {
					console.error('Error saving survey response to database', error);
					res
						.status(500)
						.json({ message: 'Error saving survey response to database' });
				} else {
					console.log('Survey response saved successfully!');
					res
						.status(200)
						.json({ message: 'Survey response saved successfully!' });
				}
				connection.release();
			});
		}
	});
});

// Start server
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
