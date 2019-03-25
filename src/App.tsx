import * as React from "react";
import {Component} from "react";
import {Route, Switch} from 'react-router-dom';
import Layout from './hoc/Layout/Layout'
import SimplePage from './components/simplePage/SimplePage'
import Posts from "./components/posts/Posts";
import FullPost from "./components/posts/fullPost/FullPost";

export default class App extends Component<any, any> {
    render() {
        return (
            <Layout>
                <Switch>
                    <Route path={'/'} exact render={() => <SimplePage children={1}/>}/>
                    <Route path={'/2'} exact render={() => <SimplePage children={2}/>}/>
                    <Route path={'/3'} exact render={() => <SimplePage children={3}/>}/>
                    <Route path={'/posts'} exact component={Posts}/>}/>
                    <Route path={'/posts/:id'} component={FullPost}/>
                </Switch>
            </Layout>
        )
    }
}