const connectTomongo = require('./mongo');
require('dotenv').config();
const express = require('express')
const cors = require('cors');
// Now we are using Express Framework of Node.Js
connectTomongo();

const app = express()
const port = process.env.PORT;


const allowedOrigins = [
  'http://localhost:3000',
  'https://67564946d8f04f4373e76ea3--deft-semifreddo-592c5a.netlify.app' // Local development
   // Deployed frontend
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // If you use cookies/authentication
}));



app.use(express.json());

app.use('/api/authentication',require('./Routes/authentication'));
app.use('/api/ques',require('./Routes/QuesAns'));
app.use('/api/Answer',require('./Routes/Answer'));
app.use('/api/emailotp', require('./Routes/emailotp'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
