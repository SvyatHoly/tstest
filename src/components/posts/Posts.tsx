import React, {Component} from 'react'
import axios from '../../axios'
import SinglePost from './singlePost/SinglePost'
import * as classes from './Posts.module.css'


interface IProps {
    history: any;
    match: any;
}

interface IState {
    posts: Array<{
        title: string;
        body: string;
        id: number;
        handleClick: any;
    }> | null;
}

class Posts extends Component<IProps, IState> {

    constructor(props: any) {
        super(props);

        this.state = {
            posts: null
        }
    }

    nextPath(id: number) {
        this.props.history.push(this.props.match.url + '/' + id);
    }


    componentDidMount(): void {
        axios.get('/')
            .then(resp => {this.setState({posts: resp.data})})
            .catch(error => console.log(error))
    }

    handleClick = (id: number) => {
        axios.get('/' + id)
            .then(resp => {this.nextPath(id)})
            .catch(error => console.log(error))
    };

    render() {

        const renderPosts = this.state.posts ?
            this.state.posts.map((item: { title: string, body: string, id: number }) =>
                <SinglePost handleClick={() => this.handleClick(item.id)}
                            key={item.id}
                            title={item.title}
                            body={item.body}
                />) : null;

        return (
            <div className={classes.container}>
                {renderPosts}
            </div>
        )
    }
}

export default Posts;