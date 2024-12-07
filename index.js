const connectTomongo = require('./mongo');
require('dotenv').config();
const express = require('express')
const cors = require('cors');
// Now we are using Express Framework of Node.Js
connectTomongo();

const app = express()
const port = process.env.PORT;

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow cookies and other credentials
}));



app.use(express.json());

app.use('/api/authentication',require('./Routes/authentication'));
app.use('/api/ques',require('./Routes/QuesAns'));
app.use('/api/Answer',require('./Routes/Answer'));
app.use('/api/emailotp', require('./Routes/emailotp'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})