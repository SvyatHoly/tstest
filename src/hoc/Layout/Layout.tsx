import React from 'react'
import Aux from '../Aux/Aux'
import NavBar from '../../components/navigation/navBar/NavBar'


const layout = (props: any) => {
    return (
        <Aux>
            <NavBar/>
            {props.children}
        </Aux>
    )
};

export default layout;