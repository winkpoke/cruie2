import React from 'react';
import {  HashRouter as Router, Route, Switch, Link,browserHistory  } from "react-router-dom";
import { Provider } from "react-redux"
import dLayout from '@/components/dLayout'
import dLayout1 from '@/components/dLayout1'
import asyncComponent from '@/utils/asyncComponent'
import PrivateRoute from '@/components/PrivateRoute'
import Layout from './layout'

import CRouter from './routes/index'

//按需加载组件
const Login = asyncComponent(()=>import('./pages/login/index'));
const Cat = asyncComponent(()=>import('./pages/aa-auto/cat'));
const PageC = asyncComponent(()=>import('./pages/aa-auto/pageC'));
const PageCDetail = asyncComponent(()=>import('./pages/aa-auto/pageC/detail'));

//404页面
import notFound from './pages/notFound'

const App = (props) => {
    return (
            <Router>
                <Switch>
                        <Route path="/login" exact component={Login} />
                       {/* <Route path="/cat" exact component={Cat} />
                        <Route path="/pageConfigList" exact component={PageC} />
                        <Route path="/pageC/add" exact component={PageCDetail} />
                        <Route path="/pageC/:id" exact component={PageCDetail} />*/}
                        <PrivateRoute path="/admin" component={CRouter} />
                        <Route component={notFound} />
                </Switch>
            </Router>
    );
};

export default App;
