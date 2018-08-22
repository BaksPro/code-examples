import Boom from 'boom';

const status = require('../constants/enums/user');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },

        firstName: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'First name field cannot be blank',
                },
            },
        },

        lastName: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'Last name field cannot be blank',
                },
            },
        },

        token: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        userName: {
            type: Sequelize.TEXT,
        },

        stripeId: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        subscriptionId: {
            type: Sequelize.STRING,
        },

        subscriptionPlan: {
            type: Sequelize.STRING,
        },

        email: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'Email field cannot be blank',
                },
                isEmail: {
                    args: true,
                    msg: 'Invalid Email',
                },
                isUnique(value, next) {
                    User.find({ where: { email: value } })
                        .then(email => {
                            if (email && this.id !== email.id) {
                                const error = Boom.badData(
                                    `User with current email : ${email.email} already exists`
                                );
                                return next(error);
                            }
                            return next();
                        })
                        .catch(err => next(err));
                },
            },
        },

        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [8],
                    msg: 'Must be greater than 8 characters',
                },
                notEmpty: {
                    args: true,
                    msg: 'Password field cannot be blank',
                },
            },
        },

        keepUpdated: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },

        subscriptionExpires: {
            type: Sequelize.DATE,
            defaultValue: new Date(),
            allowNull: false,
        },

        status: {
            type: Sequelize.ENUM(status.STATUS_PENDING, status.STATUS_APPROVED),
            defaultValue: status.STATUS_PENDING,
        },
    });

    User.associate = models => {
        User.hasMany(models.Group, { onDelete: 'CASCADE' });
        User.hasMany(models.Action, { onDelete: 'CASCADE' });
        User.hasMany(models.Agent, { onDelete: 'CASCADE' });
        User.hasMany(models.Computer, { onDelete: 'CASCADE' });
        User.hasMany(models.Event, { onDelete: 'CASCADE' });
        User.hasMany(models.Installer, { onDelete: 'CASCADE' });
        User.hasMany(models.Policy, { onDelete: 'CASCADE' });
        User.hasMany(models.Setting, { onDelete: 'CASCADE' });
    };

    return User;
};
