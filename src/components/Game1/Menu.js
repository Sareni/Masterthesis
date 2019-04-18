import React from 'react';
import './Menu.css';

class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.startOrReset = this.startOrReset.bind(this);
        this.state = {
            type: 'Start',
        }
    }

    startOrReset() {
        if(this.state.type === 'Start') {
            this.setState({ type: 'Reset' });
            this.props.triggerStart();
        } else {
            this.props.clearGame();
            this.setState({ type: 'Start' });
        }
    }

    render() {
        return (
            <div className="game1-menu">
                <button onClick={this.startOrReset}>{this.state.type}</button>
            </div>
        );
    }
}

export default Menu;