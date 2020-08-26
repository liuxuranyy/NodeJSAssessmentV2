import Express from 'express';
import {BAD_REQUEST, NO_CONTENT} from 'http-status-codes';
import Logger from '../config/logger';

const db = require('../models');
const Class = db.classes;

const ClassController = Express.Router();
const LOG = new Logger('ClassController.js');

const classHandler = async (req, res, next) => {
  try {
    //class name is mandatory and cannot be empty string
    if (req.body.className !==undefined && req.body.className !=='') {
      let _class = await Class.findOne({where: {code: req.params.classCode}});
      if (_class !== null) {
        _class.name = req.body.className;
        await _class.save();
      }
      return res.sendStatus(NO_CONTENT);
    } else {
      LOG.warn(BAD_REQUEST);
      return res.sendStatus(BAD_REQUEST);
    }
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
}

ClassController.put('/class/:classCode', classHandler);

export default ClassController;
