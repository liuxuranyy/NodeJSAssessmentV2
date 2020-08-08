import Express from 'express';
import {NO_CONTENT} from 'http-status-codes';
import Logger from '../config/logger';

const db = require('../models');
const Class = db.classes;

const ClassController = Express.Router();
const LOG = new Logger('ClassController.js');

const classHandler = async (req, res, next) => {
  try {
    let _class = await Class.findOne({where: {code: req.params.classCode}});
    if (_class !== null) {
      _class.name = req.body.className;
      await _class.save();
    }
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
  return res.sendStatus(NO_CONTENT);
}

ClassController.put('/class/:classCode', classHandler);

export default ClassController;
