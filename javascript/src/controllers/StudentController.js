import Express from 'express';
import Logger from '../config/logger';
import {BAD_REQUEST} from 'http-status-codes';

const db = require('../models');
const Class = db.classes;
const Student = db.students;
const StudentClass = db.studentClasses;
const axios = require('axios');

const StudentController = Express.Router();
const LOG = new Logger('StudentController.js');

const studentHandler = async (req, res, next) => {
  let result = {count: 0, students: []};
  try {
    if (Object.prototype.hasOwnProperty.call(req.query, 'offset') && !isNaN(req.query.offset) && Object.prototype.hasOwnProperty.call(req.query, 'limit')&& !isNaN(req.query.limit)) {
      const offset = parseInt(req.query.offset);
      const limit = parseInt(req.query.limit);
      let _class = await Class.findOne({where: {code: req.params.classCode}});
      if (_class !== null) {
        const count = await StudentClass.count({where: {classId: _class.id}});
        let studentClasses = await StudentClass.findAll({
          where: {classId: _class.id},
          include: Student,
          order: [[{model: Student, as: 'student'}, 'name', 'ASC'],],
          offset: offset,
          limit: limit
        });
        result.count = count;
        result.students = studentClasses.map(s => {
          return {id: s.student.id, name: s.student.name, email: s.student.email}
        });
      }
      //retrieve external student list
      const externalRes = await axios.get('http://localhost:5000/students?class=' + req.params.classCode + '&offset=' + offset + '&limit=' + limit).catch((err) => {
        LOG.error(err);
        LOG.warn('External student retrieving failed');
      });
      //if API call success, concat external student list with internal list
      if (externalRes!==undefined && externalRes.status === 200) {
        const externalStudents = externalRes.data;
        result.count += externalStudents.count;
        result.students = result.students.concat(externalStudents.students)
      }
      result.students = result.students.sort((a,b)=>{ return a.name>b.name?1:-1});
      return res.send(result);
    } else {
      LOG.warn(BAD_REQUEST);
      return res.sendStatus(BAD_REQUEST);
    }
  } catch (err) {
    console.log(err);
    LOG.error(err);
    return next(err);
  }

};

StudentController.get('/class/:classCode/students', studentHandler);

export default StudentController;
