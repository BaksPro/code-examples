import bCrypt from 'bcrypt-nodejs';
import LocalStrategy from 'passport-local';

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('test/back-end/passport');
const User = require('../models').user,
    jwtSecret = require('./index').jwtSecret;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
};

passport.use(
    'local-signin',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            session: false,
        },
        (email, password, done) => {
            User.findOne({
                where: {
                    email,
                },
            })
                .then(user => {
                    if (!user) {
                        return done(null, false, {
                            message: "User with current credentials wasn't found",
                        });
                    }

                    if (!bCrypt.compareSync(password, user.password)) {
                        return done(null, false, { message: 'Password is incorrect' });
                    }
                    return done(null, user);
                })
                .catch(err => done(err));
        }
    )
);

export const JWT = passport.use(
    new JwtStrategy(jwtOptions, (payload, done, err) => {
        if (!payload) {
            done(err);
        }
        User.findOne({ where: { id: payload } })
            .then(user => {
                if (!user) {
                    done(null, false, { message: 'User does not exist' });
                } else {
                    done(null, user);
                }
            })
            .catch(err => {
                done(err);
            });
    })
);
