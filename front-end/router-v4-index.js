import React from 'react';
import { Route, Switch } from 'react-router-dom';
import App from '../index';
import Login from '../pages/auth/index';

import { userIsAuthenticatedRedir, userIsNotAuthenticatedRedir } from '../../auth';

const protectedApp = userIsAuthenticatedRedir(App);
const protectedLoginList = userIsNotAuthenticatedRedir(Login);

const IndexRouter = () => (
    <Switch>
        <Route component={protectedLoginList} exact path="/login" />
        <Route component={protectedLoginList} exact path="/login/:hash" />
        <Route component={protectedApp} path="/" />
    </Switch>
);

export default IndexRouter;
