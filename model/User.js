// const Promise = require('bluebird')
// const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

var crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            email: DataTypes.STRING,
            name: DataTypes.STRING,
            hash: DataTypes.STRING,
            salt: DataTypes.STRING,
            token: DataTypes.STRING,
            expires: DataTypes.STRING,
            refresh_token: DataTypes.STRING,
        },
        {
            tableName: 'users',
        }
    );

    return User;
};
