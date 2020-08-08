import Express from 'express';
import Logger from '../config/logger';

const db = require('../models');
const Subject = db.subjects;
const Teacher = db.teachers;
const TeacherClass = db.teacherClasses;
const SubjectTeacherClass = db.subjectTeacherClass;

const ReportController = Express.Router();
const LOG = new Logger('ReportController.js');

const reportHandler = async (req, res, next) => {
  let result = {};
  try {
    let subjectTeacherClasses = await SubjectTeacherClass.findAll({
      include: [{
        model: Subject,
        required: true
      }, {
        model: TeacherClass,
        required: true,
        include: [{model: Teacher}]
      }]
    });
    let teachers = [...new Set(subjectTeacherClasses.map(item => item.teacher_class.teacher.name))];
    for(const teacher of teachers){
      let workloads = [];
      let subjectClasses = subjectTeacherClasses.filter(x=> x.teacher_class.teacher.name ===teacher);
      for(let subjectClass of subjectClasses){
        let idx = workloads.findIndex(x=>x.subjectCode ===subjectClass.subject.code);
        if(idx===-1){
          let workload={};
          workload.subjectCode = subjectClass.subject.code;
          workload.subjectName = subjectClass.subject.name;
          workload.numberOfClasses =1;
          workloads.push(workload);
        }else{
          workloads[idx].numberOfClasses++;
        }
      }
      result[teacher]=workloads;
    }
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
  return res.send(result);
};

ReportController.get('/reports/workload', reportHandler);

export default ReportController;
