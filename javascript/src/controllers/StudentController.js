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

const reportHandler = async (req, res, next) => {
  let result = {count: 0, students: []};
  try {
    if (req.query.hasOwnProperty('offset') && req.query.hasOwnProperty('limit')) {
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
      const externalRes = await axios.get('http://localhost:5000/students?class=' + req.params.classCode + '&offset=' + offset + '&limit=' + limit);
      if (externalRes.status === 200) {
        const externalStudents = externalRes.data;
        result.count += externalStudents.count;
        result.students = result.students.concat(externalStudents.students)
      }
      return res.send(result);
    } else {
      return res.status(BAD_REQUEST).send(result);
    }
  } catch (err) {
    LOG.error(err);
    return next(err);
  }

};

StudentController.get('/class/:classCode/students', reportHandler);

export default StudentController;
