import React from 'react'
import * as classes from './SinglePost.module.css'

interface ISinglePost {
    title: string;
    body: string;
    marker?: number;
    strLength?: number;
    handleClick: (e: React.MouseEvent) => void;
}

const singlePost = (props: ISinglePost) => {
    const {title, body, marker, strLength, handleClick} = props;
    let bodyOut = (<div>{body}</div>);

    if (marker) {
        bodyOut = (
            <div>
                <div className={classes.marked}>{body.slice(0, marker - strLength + 1)}</div>
                <mark className={classes.mark}>{body.slice(marker - strLength + 1, marker + 1)}</mark>
                <div className={classes.marked}>{body.slice(marker + 1, body.length)}</div>
            </div>
        );
    }

    return (
        <div className={classes.card} onClick={handleClick}>
            <h2>Title</h2>
            <div>{title}</div>
            <h4>Body</h4>
            {bodyOut}
        </div>
    )
};

export default singlePost;