const crypto = require("crypto");
const S = require("sequelize");
const db = require("../config/db");

class User extends S.Model {}

User.init(
  {
    username: {
      type: S.STRING,
      allowNull: false
    },
    password: {
      type: S.STRING,
      allowNull: false
    },
    email: {
      type: S.STRING,
      validate: {
        isEmail: true,
        allowNull: false
      }
    },
    salt: {
      type: S.TEXT
    }
  },
  { sequelize: db, modelName: "user" }
);

User.prototype.hashPassword = function(password) {
  return crypto
    .createHmac("sha1", this.salt)
    .update(password)
    .digest("hex");
};
User.prototype.randomSalt = function() {
  return crypto.randomBytes(20).toString("hex");
};
User.prototype.validatePassword = function(password) {
  let newPassword = this.hashPassword(password);
  return newPassword === this.password;
};
User.beforeCreate(user => {
  user.salt = user.randomSalt();
  user.password = user.hashPassword(user.password);
});

module.exports = User;
