module.exports = (sequelize, Sequelize) => {
  const Class = sequelize.define('class', {
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
  Class.associate = function (models) {
    Class.belongsToMany(models.students, { as:'clas',through:'student_class'});
    Class.belongsToMany(models.teachers, { as:'class',through:'teacher_class'});
  };
  return Class;
};
