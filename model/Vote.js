module.exports = (sequelize, DataTypes) => {
    const Vote = sequelize.define(
        'Vote',
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            user_id: DataTypes.INTEGER,
            comment_id: DataTypes.INTEGER,
            vote: DataTypes.INTEGER,
        },
        {
            tableName: 'vote',
            freezeTableName: true,
            timestamps: false,
        }
    );
    return Vote;
};
