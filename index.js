require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override'); // Add this line
const app = express();
const port = 3000;

const connectDB = require('./db');
const authController = require('./controllers/authController');
const withdrawalController = require('./controllers/withdrawalController');

const earningController = require('./controllers/earningController');
const appOfferController = require('./controllers/appOfferController');
const taskOfferController = require('./controllers/taskOfferController');
const reviewOfferController = require('./controllers/reviewOfferController');
const checkinController = require('./controllers/checkinController');

const router = express.Router();
// Check-in routes
router.post('/adscheckin', checkinController.adsCheckin);

app.use(express.json());
app.use(router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(methodOverride('_method')); // Add this line

async function startServer() {
  try {
    await connectDB();

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.post('/register', authController.register);
    app.post('/login', authController.login);

    const { updateSettings, getSettingsByPhone } = require('./controllers/settingsController');
    app.post('/settings', updateSettings);

    app.post('/earning', earningController.getEarning);

    app.get('/appOffers', appOfferController.getAppOffer);
    app.post('/appOffers', appOfferController.addAppOffer);
    app.post('/appOffersDetails', appOfferController.getAppOfferDetails);
    app.post('/appOffers/delete', appOfferController.deleteAppOffer);
    app.post('/appOffers/reviewComplete', appOfferController.reviewCompleteOffer);
    app.post('/appOffers/approveComplete', appOfferController.approveCompleteOffer);
    app.post('/appOffers/complete', appOfferController.completeAppOffer);

    app.get('/taskOffers', taskOfferController.getTaskOffer);
    app.post('/taskOffers', taskOfferController.addTaskOffer);
    app.post('/taskOffersDetails', taskOfferController.getTaskOfferDetails);
    app.post('/taskOffers/delete', taskOfferController.deleteTaskOffer);
    app.post('/taskOffers/reviewComplete', taskOfferController.reviewCompleteOffer);
    app.post('/taskOffers/approveComplete', taskOfferController.approveCompleteOffer);
    app.post('/taskOffers/complete', taskOfferController.completeTaskOffer);
    app.get('/reviewOffers', reviewOfferController.getReview);


    app.post('/reviewOffers', reviewOfferController.addReview);
    app.post('/reviewOffersDetails', reviewOfferController.getReviewDetails);
    app.post('/reviewOffers/delete', reviewOfferController.deleteReviewOffer);
    app.post('/reviewOffers/reviewComplete', reviewOfferController.reviewCompleteOffer);
    app.post('/reviewOffers/approveComplete', reviewOfferController.approveCompleteOffer);
    app.post('/reviewOffers/complete', reviewOfferController.completeReviewOffer);



    app.post('/checkin', checkinController.dailyCheckin);

    app.post('/withdraw', withdrawalController.createWithdrawal);
    app.put('/withdraw/:id', withdrawalController.updateWithdrawalState);
    app.post('/getWithdrawals', withdrawalController.getWithdrawalStatus);

    app.post('/getSettings', getSettingsByPhone);

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();
