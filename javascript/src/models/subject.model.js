module.exports = (sequelize, Sequelize) => {
  const Subject = sequelize.define('subject', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    code: {
      type: Sequelize.STRING,
      unique: true
    },
    name: {
      type: Sequelize.STRING,
      defaultValue: ''
    }
  });
  Subject.associate = function (models) {
    Subject.belongsToMany(models.teacherClasses, { as:'subject',through:models.subjectTeacherClass});
  };
  return Subject;
};
