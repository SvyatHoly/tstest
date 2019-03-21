import React from 'react'
import * as classes from './Comment.module.css'


interface IProps {
    count: number;
    name: string;
    email: string;
    body: string;
}

const comment = (props: IProps) => {
    return (
        <div className={classes.body}>
            <h4>Comment #{props.count}</h4>
            <hr/>
            <h5>Name:</h5>
            <h6>{props.name}</h6>
            <hr/>
            <h5>Email:</h5>
            <h6>{props.email}</h6>
            <hr/>
            <h5>Body:</h5>
            <h6>{props.body}</h6>
            <hr/>
        </div>
    )
};

export default comment;