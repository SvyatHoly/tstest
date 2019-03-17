import React, {Component} from 'react'
import axios from '../../../axios'
import * as classes from "./FullPost.module.css";

interface IProps {
    match: any;
}

interface IState {
    post: {
        title: string;
        body: string;
        id: number;
        handleClick: any;
    } | null;
}


export default class FullPost extends Component<IProps, IState> {

    constructor(props: any) {
        super(props);

        this.state = {
            post: null,
        };
    }

    componentDidMount(): void {
        axios.get('/' + this.props.match.params.id)
            .then(response => this.setState({post: response.data}))
            .catch(error => console.log(error))
    }

    render() {
        const post: any = this.state.post;

        return post ? (
            <div className={classes.container}>
                <div className={classes.post}>
                    <h3>Id</h3>
                    <div>{post.id}</div>
                    <hr/>
                    <h3>Title</h3>
                    <div className={classes.text}>{post.title}</div>
                    <hr/>
                    <div className={classes.text}>{post.body}</div>
                </div>
            </div>
        ) : null;
    }
}