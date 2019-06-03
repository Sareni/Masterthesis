import React from 'react';
import './Screen.css';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, LineMarkSeries} from 'react-vis';
import '../../../node_modules/react-vis/dist/style.css';

const colorTable = [
    '131, 208, 242',
    '255,0,0',
    '255,255,255',
    '0,0,0'
];

const yDomainTable = {
    'NE': [-5, 0],
    'MAX': [-50, 100], //null
}

class Screen extends React.Component {

    constructor(props) {
        super(props);

        this.createLines = this.createLines.bind(this);
    }

    createLines() {
        let result = [];
        for (let i = 0; i < this.props.gameCounter; i++) {
            result.push(
                <LineMarkSeries key={'Line'+i}
                style={{
                strokeWidth: 'px',
                }}
                size='3'
                lineStyle={{stroke: 'black'}}
                markStyle={{fill: `rgba(${colorTable[i]},0.5)`, strokeWidth: '1px'}}
                data={this.props.gameState.filter(state => state.gameCounter === (i+1)).map(state => state.data)}
                />
            );
        }
        return result;
    }
  
    render() {
        return (
            <div className="game1-screen">
                <XYPlot width={960} height={600} xDomain={[0,this.props.generationCount-1]} margin={{left: 60}} >
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis />
                    <YAxis />
                    { this.createLines() }
                </XYPlot>
            </div>
        );
    }
}

export default Screen;
