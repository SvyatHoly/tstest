import * as React from 'react'
import NavBarItem from './navBarItem/NavBarItem'
import * as classes from './NavBar.module.css'
import Switcher from '../../ui/themeSwitcher/Switcher'

const navBar = () => {
    return (
        <div className={classes.navbar}>
            <NavBarItem link={'/posts'} exact={true}>Posts</NavBarItem>
            <NavBarItem link={'/graph'} exact={true}>Data Visualisation</NavBarItem>
            <NavBarItem link={'/refactor'} exact={true}>Third</NavBarItem>
            <Switcher/>
        </div>
    )
};

export default navBar;