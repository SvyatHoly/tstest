import React from 'react'
import * as classes from './SimplePage.module.css'

interface Props {
    children: number
}

const simplePage = (props: Props) => {
    return (
        <div className={classes.container}>
            <h5 className={classes.pageBody}>{props.children}</h5>
        </div>
    )
};

export default simplePage;
