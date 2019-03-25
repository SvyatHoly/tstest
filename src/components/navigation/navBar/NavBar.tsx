import * as React from 'react'
import NavBarItem from './navBarItem/NavBarItem'
import * as classes from './NavBar.module.css'

const navBar = () => {
    return (
        <div className={classes.navbar}>
            <NavBarItem link={'/posts'} exact={true}>Posts</NavBarItem>
            <NavBarItem link={'/2'} exact={true}>Second</NavBarItem>
            <NavBarItem link={'/3'} exact={true}>Third</NavBarItem>
        </div>
    )
};

export default navBar;