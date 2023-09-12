const express = require('express');
const app = express();
require('dotenv').config({ path: '.dotenv' });

const PORT = process.env.PORT || 5001;

app.use(express.json());

const userRoute = require('./v1/routes/user.route');
const friendRoute = require('./v1/routes/friend.route');

app.use('/users', userRoute);
app.use('/friend', friendRoute);

app.listen(PORT, () => console.log('Server running on port ', PORT));