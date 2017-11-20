import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {render} from 'react-dom';
import './css/style.css';
import StorePicker from './components/StorePicker';
import App from './components/App';
import notFound from './components/NotFound';

const repo = `/${window.location.pathname.split('/')[1]}`;

const Root = () => {
    return (
        <BrowserRouter basename={repo}>
        <Switch>
            <Route exact path="/" component={StorePicker} />
            <Route path="/store/:storeId" component={App} />
            <Route component={notFound} />            
        </Switch>
        </BrowserRouter>
    )
}

render(<Root/>, document.querySelector('#main'));