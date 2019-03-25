import * as React from 'react'
import { NavLink } from 'react-router-dom'
import Button from '../../../ui/button/Button'
import * as classes from './NavBarItem.module.css'

interface NavBarItemProps {
    link: string
    exact: boolean
    children: string
}

const navBarItem = (props: NavBarItemProps) => {
    const name = props.children;
    return (
        <div className={classes.barItem}>
        <NavLink
            activeClassName={classes.active}
            to={props.link}
            exact={props.exact}
        >
            <Button name={name}/>
        </NavLink>
        </div>
    )
};

export default navBarItem;