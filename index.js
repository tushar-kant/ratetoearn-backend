require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

const connectDB = require('./db');
const mongoose = require('mongoose');
const User = require('./models/User');
const authController = require('./controllers/authController');
const withdrawalController = require('./controllers/withdrawalController');
const Earning = require('./models/Earning');
const Withdrawal = require('./models/Withdrawal');
const earningController = require('./controllers/earningController');
const appOfferController = require('./controllers/appOfferController');
const taskOfferController = require('./controllers/taskOfferController');
const reviewOfferController = require('./controllers/reviewOfferController');
const checkinController = require('./controllers/checkinController');
const { authMiddleware } = require('./controllers/authController');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

async function startServer() {
  try {
    await connectDB();

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.post('/register', authController.register);
    app.post('/login', authController.login);

    app.post('/earning', earningController.getEarning);

    app.get('/appOffers', appOfferController.getAppOffer);
    app.post('/appOffers', appOfferController.addAppOffer);
    app.post('/appOffersDetails', appOfferController.getAppOfferDetails);

    app.get('/taskOffers', taskOfferController.getTaskOffer);
    app.post('/taskOffers', taskOfferController.addTaskOffer);
    app.post('/taskOffersDetails', taskOfferController.getTaskOfferDetails);

    app.get('/reviewOffers', reviewOfferController.getReview);
    app.post('/reviewOffers', reviewOfferController.addReview);
    app.post('/reviewOffersDetails', reviewOfferController.getReviewDetails);

    app.post('/checkin',  checkinController.dailyCheckin);

    app.post('/withdraw', withdrawalController.createWithdrawal);
    app.put('/withdraw/:id', withdrawalController.updateWithdrawalState);

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();
