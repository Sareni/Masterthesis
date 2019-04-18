import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import MenuBar from './components/MenuBar';
import AppBody from './components/AppBody';
import { AppStates } from './helper/enum';
import Menu from './components/Menu';
import Game1 from './components/Game1/Game1';
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
      <Route path="/game2" component={Game1}/>,
      <Route path="/game3" component={Game1}/>,
      <Route path="/game4" component={Game1}/>,
      <Route path="/game5" component={Game1}/>,
      <Route path="/game6" component={Game1}/>,
      <Route path="/game7" component={Game1}/>,
      <Route path="/game8" component={Game1}/>,
    <Route path="/game9" component={Game1}/> ]
    );
  }
}

/*
<div className="App">
          <AppBody selection={this.state.appState}></AppBody>
        </div>*/

export default App;
