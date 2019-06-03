import React from 'react';
import { Link } from 'react-router-dom';
import logoGame1 from './Game1/logo.png';
import './Menu.css';


class Menu extends React.Component {
  
    render() {
      return (
        <div className="menu">
            {this.generateGameLinks()}
        </div>
      );
    }

    generateGameLinks() {
        return ([
            <Link className="menu-link" to='/Game1'><img src={logoGame1} /><p>Pure Strategien</p></Link>,
            <Link className="menu-link" to='/Game2'><img src={logoGame1} /><p>Entscheidungsbäume</p></Link>,
            <Link className="menu-link" to='/Game3'><img src={logoGame1} /><p>Gemischte Strategien I</p></Link>,
            <Link className="menu-link" to='/Game4'><img src={logoGame1} /><p>Gemischte Strategien II</p></Link>,
            <Link className="menu-link" to='/Game5'><img src={logoGame1} /><p>Pure und gemischte Strategien</p></Link>,
            <Link className="menu-link" to='/Game6'><img src={logoGame1} /><p>Tankstellen Spiel</p></Link>,
            <Link className="menu-link" to='/Game7'><img src={logoGame1} /><p>Wiederholte Spiele</p></Link>,
            <Link className="menu-link" to='/Game8'><img src={logoGame1} /><p>Bayes Spiele</p></Link>,
            <Link className="menu-link" to='/Game9'><img src={logoGame1} /><p>Produktions Spiel</p></Link>
        ])
    }
}

export default Menu;