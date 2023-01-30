module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define(
        'Comments',
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            user_id: DataTypes.INTEGER,
            parent_id: DataTypes.INTEGER,
            votes: DataTypes.INTEGER,
            text: DataTypes.STRING,
        },
        {
            tableName: 'comments',
            freezeTableName: true,
        }
    );

    return Comments;
};
