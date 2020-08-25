import Express from 'express';
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './router';
import globalErrorHandler from './config/globalErrorHandler';

let morgan = require('morgan');
const App = Express();
App.use(compression());
App.use(cors());
App.use(morgan('combined'));
const db = require('./models');
// db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
//   .then(function(){
//     return db.sequelize.sync({ force: true });
//   })
//   .then(function(){
//     return db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
//   })
//   .then(function(){
//     console.log('Database synchronised.');
//   }, function(err){
//     console.log(err);
//   });
db.sequelize.sync();

App.use(bodyParser.json());
App.use(bodyParser.urlencoded( { extended: true } ));
App.use('/api', router);
App.use(globalErrorHandler);

module.exports = App;
