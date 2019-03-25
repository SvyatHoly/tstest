import React, {Component} from 'react'
import * as classes from "./FullPost.module.css"
import {getCommentsById, getPostById} from "../../../api"
import Comment from './comment/Comment'

interface IProps {
    match: any;
}

interface IState {
    post: {
        title: string;
        body: string;
        id: number;
    } | null;

    comments: Array<{
        name: string;
        email: string;
        body: string;
    }> | null;
}

/**
 * Компонент получает ID из path и рендерит отдельный пост
 */
export default class FullPost extends Component<IProps, IState> {

    constructor(props: any) {
        super(props);

        this.state = {
            post: null,
            comments: null
        };
    }

    async componentDidMount(): Promise<void> {
        const id = this.props.match.params.id;
        this.setState({post: await getPostById(id), comments: await getCommentsById(id)});
    }

    renderComments = () => {
        const {comments} = this.state;

        if (comments) {
            return comments.map((el, i) => {
                return <Comment key={i} count={i + 1} name={el.name} body={el.body} email={el.email}/>
            })
        }
    };

    render() {
        const {post, comments} = this.state;

        if (!post) {
            return null;
        }

        return (
            <div className={classes.container}>
                <div className={classes.post}>
                    <h3>Post #{post.id}</h3>
                    <div className={classes.text}>{post.title}</div>
                    <hr/>
                    <div className={classes.text}>{post.body}</div>
                    <hr/>
                </div>
                {this.renderComments()}
            </div>

        );
    }
}