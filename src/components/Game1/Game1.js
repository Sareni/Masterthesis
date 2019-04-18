import React from 'react';
import Console from '../Console'
import './Game1.css';
import Menu from './Menu';
import Screen from './Screen';
import ExecutorGame1 from '../../algorithms/Game1/Executor1'
import CandidateFactory1 from '../../algorithms/Game1/CandidateFactory1';

class Game1 extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        log: [], // { gen: 1, type: 'status', msg: 'Bester Kandidat ...'}
        gameState: [],
        test: 0,
        executor: {},
      }
      this.newMessage = this.newMessage.bind(this);
      this.triggerStart = this.triggerStart.bind(this);
      this.newGameState = this.newGameState.bind(this);
      this.clearGame = this.clearGame.bind(this);
    }

    newMessage(gen, type, msg) {
      const newLog = this.state.log;
      newLog.push({
        gen,
        type,
        msg
      });
      this.setState({ log: newLog });
    }

    newGameState(gameState) {
      const newGameState = this.state.gameState;
      newGameState.push(gameState);
      this.setState({ gameState: newGameState });
    }

    triggerStart() {
      const factory = new CandidateFactory1(5,25);
      const executor = new ExecutorGame1(100,1,100,50,factory,this.newGameState,this.newMessage);
      this.setState({ executor });
      executor.start();
    }

    clearGame() {
      this.state.executor.stop();
      this.setState({ log: [], gameState: [] });
    }
  
    render() {
      return (
        <div className="game1-body">
          <Menu triggerStart={this.triggerStart} clearGame={this.clearGame}/>
          <Screen gameState={this.state.gameState}/>
          <Console log={this.state.log} />
        </div>

      );
    }
}

export default Game1;