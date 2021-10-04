import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import HomePage from './HomePage/HomePage'

import './App.css';

function App() {

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
              <HomePage />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
