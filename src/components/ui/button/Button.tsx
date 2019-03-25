import React from 'react'
import * as classes from './Button.module.css'

interface Props {
    name: string
}

const button = (props: Props) => {
    return <div className={classes.button}>{props.name}</div>
};

export default button;