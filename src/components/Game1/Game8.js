import React from 'react';
import Console from '../Console'
import './Game1.css';
import Menu from './Menu';
import Screen from './Screen';
import ExecutorGA8 from '../../algorithms/Game8/ExecutorGA';
import ExecutorES8 from '../../algorithms/Game8/ExecutorES';
import ExecutorBF8 from '../../algorithms/Game8/ExecutorBF';
import CandidateFactory8 from '../../algorithms/Game8/CandidateFactory';

class Game1 extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        log: [], // { gen: 1, type: 'status', msg: 'Bester Kandidat ...'}
        gameState: [],
        runnig: false,
        gameCounter: 0,
        executor: {},
        fitnessType: 'NE',
        generationCount: 10,
      }

      this.gameCounter = this.state.gameCounter;
      this.newMessage = this.newMessage.bind(this);
      this.triggerStart = this.triggerStart.bind(this);
      this.newGameState = this.newGameState.bind(this);
      this.clearGame = this.clearGame.bind(this);
      this.changeStartToResetButton = this.changeStartToResetButton.bind(this);
    }

    newMessage(gen, type, msg) {
      const newLog = this.state.log;
      const running = type === 'fin' ? false : this.state.running
      newLog.push({
        gen,
        type,
        msg
      });
      this.setState({ log: newLog, running} );

    }

    newGameState(data) {
      const gameState = this.state.gameState;
      gameState.push({ data: { x: data.x, y: data.y } , gameCounter: data.playerNumber+1 });
      this.setState({ gameState });
    }

    triggerStart(data) {
      if (this.state.gameCounter < data.playerCount) {
        const factory = new CandidateFactory8(data.seedValue);
        let executor;
        switch (data.gameType) {
          case 'GA': executor = new ExecutorGA8(data.generationCount,data.seedValue,data.populationSize,data.timeout, data.mutationRate, factory,this.newGameState,this.newMessage); break;
          case 'ES': executor = new ExecutorES8(data.generationCount,data.seedValue,data.populationSize,data.timeout, data.mutationRate, factory,this.newGameState,this.newMessage); break;
          default: executor = new ExecutorBF8(data.generationCount,data.seedValue,data.populationSize,data.timeout, data.mutationRate, factory,this.newGameState,this.newMessage);
        }
        this.gameCounter += 3; // !!
        this.setState({ executor, running: true, gameCounter: this.gameCounter, fitnessType: data.fitnessType, generationCount: data.generationCount });
        executor.start();
      }
    }

    clearGame() {
      if (this.state.executor && this.state.executor.stop) {
        this.state.executor.stop();
      }
      this.setState({ log: [], gameState: [], running: false, gameCounter: 0 });
      this.gameCounter = 0;
    }

    changeStartToResetButton() {
      this.setState({ running: !this.state.runnig });
    }
  
    // TODO: add readonly
    render() {
      return (
        <div className="game1-body">
          <Menu triggerStart={this.triggerStart} clearGame={this.clearGame} type={this.state.running ? 'Reset' : 'Start'} fitnessType={this.state.fitnessType} generationCount={this.state.generationCount} changeStartResetButton={this.changeStartToResetButton}/>
          <Screen gameState={this.state.gameState} gameCounter={this.gameCounter} fitnessType={this.state.fitnessType} generationCount={this.state.generationCount}/>
          <Console log={this.state.log} />
        </div>

      );
    }
}

export default Game1;