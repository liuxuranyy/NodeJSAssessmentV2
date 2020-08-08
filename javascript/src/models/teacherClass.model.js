module.exports = (sequelize, Sequelize) => {
  const TeacherClass = sequelize.define('teacher_class', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  });
  TeacherClass.associate = function (models) {
    TeacherClass.belongsToMany(models.subjects, { as:'teacher_class',through:models.subjectTeacherClass});
    TeacherClass.belongsTo(models.teachers);
    TeacherClass.belongsTo(models.classes);
  };
  return TeacherClass;
};
