module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define('student', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
      unique: true
    },
    name: {
      type: Sequelize.STRING,
      defaultValue: ''
    }
  });
  Student.associate = function (models) {
    Student.belongsToMany(models.classes, { as:'student',through:models.studentClasses});
  };

  return Student;
};
