import Express from 'express';
import {NO_CONTENT} from 'http-status-codes';
import Logger from '../config/logger';
import upload from '../config/multer';
import {convertCsvToJson} from '../utils';

const db = require('../models');
const Teacher = db.teachers;
const Student = db.students;
const Class = db.classes;
const Subject = db.subjects;
const StudentClass = db.studentClasses;
const TeacherClass = db.teacherClasses;
const SubjectTeacherClass = db.subjectTeacherClass;

const DataImportController = Express.Router();
const LOG = new Logger('DataImportController.js');

// TODO: Please implement Question 1 requirement here
const dataImportHandler = async (req, res, next) => {
  const {file} = req;
  try {
    const data = await convertCsvToJson(file.path);
    LOG.info(JSON.stringify(data, null, 2));
    for (const record of data) {
      if (record.teacherEmail !== '' && record.teacherName !== '' && record.studentEmail !== '' && record.studentName !== '' && record.classCode !== '' && record.className !== '' && record.subjectCode !== '' && record.subjectName !== '') {
        let teacher = await saveTeacher(record.teacherEmail,record.teacherName);
        let student = await saveStudent(record.studentEmail,record.studentName);
        let _class = await saveClass(record.classCode,record.className);
        let subject = await saveSubject(record.subjectCode,record.subjectName);

        let studentClass = await saveStudentClass(student.id,_class.id);
        let teacherClass = await saveTeacherClass(teacher.id,_class.id);
        await saveSubjectTeacherClass(subject.id,teacherClass.id);
        if(record.toDelete ==='1'){
          await studentClass.destroy();
        }
      }
    }
  } catch (err) {
    LOG.error(err);
    return next(err);
  }

  return res.sendStatus(NO_CONTENT);
}
const saveTeacher = async (email,name)=>{
  let teacher = await Teacher.findOne({where: {email: email}});
  if (teacher == null) {
    teacher =await Teacher.create({
      email: email,
      name: name
    });
  } else {
    teacher.name = name;
    await teacher.save();
  }
  return teacher;
};

const saveStudent = async (email,name)=>{
  let student = await Student.findOne({where: {email: email}});
  if (student == null) {
    student =await Student.create({
      email: email,
      name: name
    });
  } else {
    student.name = name;
    await student.save();
  }
  return student;
};
const saveClass = async (code,name)=>{
  let _class = await Class.findOne({where: {code: code}});
  if (_class == null) {
    _class =await Class.create({
      code: code,
      name: name
    });
  } else {
    _class.name = name;
    await _class.save();
  }
  return _class;
};
const saveSubject = async (code,name)=>{
  let subject = await Subject.findOne({where: {code: code}});
  if (subject == null) {
    subject =await Subject.create({
      code: code,
      name: name
    });
  } else {
    subject.name = name;
    await subject.save();
  }
  return subject;
};
const saveStudentClass = async (studentId,classId)=>{
  let studentClass = await StudentClass.findOne({where: {studentId: studentId, classId: classId}});
  if (studentClass == null) {
    studentClass =await StudentClass.create({studentId: studentId, classId: classId});
  }
  return studentClass;
};
const saveTeacherClass = async (teacherId,classId)=>{
  let teacherClass = await TeacherClass.findOne({where: {teacherId: teacherId, classId: classId}});
  if (teacherClass == null) {
    teacherClass =await TeacherClass.create({teacherId: teacherId, classId: classId});
  }
  return teacherClass;
};
const saveSubjectTeacherClass = async (subjectId,teacherClassId)=>{
  let subjectTeacherClass = await SubjectTeacherClass.findOne({where: {subjectId: subjectId, teacherClassId: teacherClassId}});
  if (subjectTeacherClass == null) {
    subjectTeacherClass =await SubjectTeacherClass.create({subjectId: subjectId, teacherClassId: teacherClassId});
  }
  return subjectTeacherClass;
};
DataImportController.post('/upload', upload.single('data'), dataImportHandler);

export default DataImportController;
