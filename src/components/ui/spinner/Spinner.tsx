import React from 'react'
import * as classes from './Spinner.module.scss'

const spinner = () => {
    return (
        <div className={classes.main}>
            <span className={classes.spinner}></span>
        </div>
    )
};

export default spinner;