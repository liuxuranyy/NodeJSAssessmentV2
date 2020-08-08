module.exports = (sequelize, Sequelize) => {
  const  SubjectTeacherClass= sequelize.define('subject_TeacherClass', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  });
  SubjectTeacherClass.associate = (models) => {
    SubjectTeacherClass.belongsTo(models.subjects);
    SubjectTeacherClass.belongsTo(models.teacherClasses);
  }
  return SubjectTeacherClass;
};
