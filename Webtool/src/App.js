import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import MenuBar from './components/MenuBar';
import AppBody from './components/AppBody';
import { AppStates } from './helper/enum';
import Menu from './components/Menu';
import Game1 from './components/Game1/Game1';
import Game2 from './components/Game1/Game2';
import Game3 from './components/Game1/Game3';
import Game6 from './components/Game1/Game6';
import Game7 from './components/Game1/Game7';
import Game8 from './components/Game1/Game8';
import Game9 from './components/Game1/Game9';
import Info from './components/Info';

class App extends Component {

  constructor() {
    super();
    this.state = {appState: AppStates.MainMenu };
  }

  render() {
    return (
      <div>
        <HashRouter>
          <div>
            <MenuBar />
            <Route exact={true} path="/" component={Menu}/>
            {this.generateGameRoutes()}
            <Route path="/info" component={Info}/>
          </div>
        </HashRouter>
      </div>
    );
  }

  generateGameRoutes() {
    return ([
      <Route path="/game1" component={Game1}/>,
      <Route path="/game2" component={Game2}/>,
      <Route path="/game3" component={Game3}/>,
      <Route path="/game4" component={Game3}/>,
      <Route path="/game5" component={Game3}/>,
      <Route path="/game6" component={Game6}/>,
      <Route path="/game7" component={Game7}/>,
      <Route path="/game8" component={Game8}/>,
      <Route path="/game9" component={Game9}/> ]
    );
  }
}

/*
<div className="App">
          <AppBody selection={this.state.appState}></AppBody>
        </div>*/

export default App;
