import React from 'react'
import * as classes from './SinglePost.module.css'

interface ISinglePost {
    title: string
    body: string
    handleClick: any
}

const singlePost = (props: ISinglePost) => {
    return (
        <div className={classes.card} onClick={props.handleClick}>
            <h2>Title</h2>
            <div>{props.title}</div>
            <h4>Body</h4>
            <div>{props.body}</div>
        </div>
    )
};

export default singlePost;