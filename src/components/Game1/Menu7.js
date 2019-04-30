import React from 'react';
import './Menu.css';

class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gameRounds: 2,
            generationCount: props.generationCount,
            seedValue: Math.floor(Math.random() * 100000),
            populationSize: 10,
            timeout: 1,
            mutationRate: 0.2,
            gameType: 'GA',
        }

        this.startOrReset = this.startOrReset.bind(this);
        this.onGenerationCountChange = this.onGenerationCountChange.bind(this);
        this.onSeedValueChange = this.onSeedValueChange.bind(this);
        this.onPopulationSizeChange = this.onPopulationSizeChange.bind(this);
        this.onTimeoutChange = this.onTimeoutChange.bind(this);
        this.onMutationRateChange = this.onMutationRateChange.bind(this);
        this.onGameRoundsChange = this.onGameRoundsChange.bind(this);
        this.setES = this.setES.bind(this);
        this.setGA = this.setGA.bind(this);
        this.setBF = this.setBF.bind(this);
    }

    startOrReset() {
        if (this.props.type === 'Start') {
            this.props.changeStartResetButton();
            const data = {
                gameRounds: this.state.gameRounds,
                generationCount: this.state.generationCount,
                seedValue: this.state.seedValue,
                populationSize: this.state.populationSize,
                timeout: this.state.timeout,
                mutationRate: this.state.mutationRate,
                gameType: this.state.gameType,
            }

            this.props.triggerStart(data);
        } else {
            this.props.clearGame();
        }
    }

    onGenerationCountChange(event) {
        this.setState({
            generationCount: event.target.value,
        });
    }

    onSeedValueChange(event) {
        this.setState({
            seedValue: event.target.value,
        });
    }

    onPopulationSizeChange(event) {
        this.setState({
            populationSize: event.target.value,
        });
    }

    onTimeoutChange(event) {
        this.setState({
            timeout: event.target.value,
        });
    }

    onMutationRateChange(event) {
        this.setState({
            mutationRate: event.target.value,
        });
    }

    onGameRoundsChange(event) {
        this.setState({
            gameRounds: event.target.value,
        });
    }

    setGA () {
        this.setState({ gameType: 'GA' });
    }

    setES () {
        this.setState({ gameType: 'ES' });
    }
    
    setBF () {
        this.setState({ gameType: 'BF' });
    }

    render() {
        return (
            <div className="game1-menu">
                <div className="inputBox">
                    <div className="inputLabel">Spieler Anzahl</div>
                    <div className="inputSwitch">
                        <button onClick={this.setGA} className={this.state.gameType === 'GA' ? 'buttonActive' : 'button'}>GA</button>
                        <button onClick={this.setES} className={this.state.gameType === 'ES' ? 'buttonActive' : 'button'}>ES</button>
                        <button onClick={this.setBF} className={this.state.gameType === 'BF' ? 'buttonActive' : 'button'}>BF</button>
                    </div>
                </div>
                <div className="inputBox">
                    <div className="inputLabel">Anzahl der Subspiele</div>
                    <input type="text" onChange={ this.onGameRoundsChange } value={this.state.gameRounds}/>
                </div>
                <div className="inputBox">
                    <div className="inputLabel">Generationen</div>
                    <input type="text" onChange={ this.onGenerationCountChange } value={this.state.generationCount}/>
                </div>
                <div className="inputBox">
                    <div className="inputLabel">Seed Value</div>
                    <input type="text" onChange={ this.onSeedValueChange } value={this.state.seedValue}/>
                </div>
                <div className="inputBox">
                    <div className="inputLabel">Populationsgröße</div>
                    <input type="text" onChange={ this.onPopulationSizeChange } value={this.state.populationSize}/>
                </div>
                <div className="inputBox">
                    <div className="inputLabel">Verzögerung</div>
                    <input type="text" onChange={ this.onTimeoutChange } value={this.state.timeout}/>
                </div>
                <div className="inputBox">
                    <div className="inputLabel">Mutationsrate</div>
                    <input type="text" onChange={ this.onMutationRateChange } value={this.state.mutationRate}/>
                </div>
                
                <button className="start-button" onClick={this.startOrReset}>{this.props.type}</button>
            </div>
        );
    }
}

export default Menu;