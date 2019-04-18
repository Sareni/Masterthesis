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
            <Link className="menu-link" to='/Game1'><img src={logoGame1} /></Link>,
            <Link className="menu-link" to='/Game2'><img src={logoGame1} /></Link>,
            <Link className="menu-link" to='/Game3'><img src={logoGame1} /></Link>,
            <Link className="menu-link" to='/Game4'><img src={logoGame1} /></Link>,
            <Link className="menu-link" to='/Game5'><img src={logoGame1} /></Link>,
            <Link className="menu-link" to='/Game6'><img src={logoGame1} /></Link>,
            <Link className="menu-link" to='/Game7'><img src={logoGame1} /></Link>,
            <Link className="menu-link" to='/Game8'><img src={logoGame1} /></Link>,
            <Link className="menu-link" to='/Game9'><img src={logoGame1} /></Link>
        ])
    }
}

export default Menu;