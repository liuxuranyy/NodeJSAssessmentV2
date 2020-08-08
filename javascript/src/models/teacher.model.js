module.exports = (sequelize, Sequelize) => {
  const Teacher = sequelize.define('teacher', {
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
  Teacher.associate = function (models) {
    Teacher.belongsToMany(models.classes, { as:'teacher',through:models.teacherClasses});
  };
  return Teacher;
};
