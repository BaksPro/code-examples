import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Group from '../pages/group/index';
import Downloads from '../pages/downloads/index';
import Computer from '../pages/computer/index';
import ComputerSettings from '../pages/computer-settings/index';
import MainPage from '../pages/main-page/MainPage';
import Reports from '../pages/reports/index';
import Upload from '../pages/softUpload/index';
import Policy from '../pages/policy/index';
import FAQ from '../pages/FAQ';

import Subscription from '../pages/subscription/index';
import UserSettings from '../pages/user-settings/index';
import { userIsAdminRedir, userIsAuthenticatedRedir } from '../../auth';

const protectedDashboard = userIsAuthenticatedRedir(userIsAdminRedir(FAQ));
const AppRouter = () => (
    <Switch>
        <Route component={MainPage} exact path="/" />
        <Route component={Group} path="/group/:id" />
        <Route component={Computer} path="/computer/:id" />
        <Route component={ComputerSettings} path="/computer-settings/:id" />
        <Route component={MainPage} path="/groups/:id" />
        <Route component={Downloads} path="/downloads" />
        <Route component={Reports} path="/reports" />
        <Route component={Upload} path="/upload" />
        <Route component={Subscription} path="/subscription" />
        <Route component={UserSettings} path="/user-settings" />
        <Route component={Policy} path="/policy" />
        <Route component={FAQ} path="/faq" />
        <Route component={protectedDashboard} path="/dashboard" />
    </Switch>
);

export default AppRouter;