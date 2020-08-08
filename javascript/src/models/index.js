import Sequelize from 'sequelize';
import sequelize from '../config/database';

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.students = require('./student.model.js')(sequelize, Sequelize);
db.teachers = require('./teacher.model.js')(sequelize, Sequelize);
db.subjects = require('./subject.model.js')(sequelize, Sequelize);
db.classes = require('./class.model.js')(sequelize, Sequelize);
db.studentClasses = require('./studentClass.model.js')(sequelize, Sequelize);
db.teacherClasses = require('./teacherClass.model.js')(sequelize, Sequelize);
db.subjectTeacherClass = require('./subjectTeacherClass.model.js')(sequelize, Sequelize);

// db.registrations = require('./registration.model.js')(sequelize, Sequelize);
Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
