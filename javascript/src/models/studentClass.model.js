module.exports = (sequelize, Sequelize) => {
  const StudentClass = sequelize.define('student_class', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  });
  StudentClass.associate = (models) => {
    StudentClass.belongsTo(models.students);
    StudentClass.belongsTo(models.classes);
  }
  return StudentClass;
};
