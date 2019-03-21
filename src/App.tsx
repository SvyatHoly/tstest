import * as React from "react"
import {Component, Suspense} from "react"
import {Route, Switch} from 'react-router-dom'
import Layout from './hoc/Layout/Layout'
import Posts from "./components/posts/Posts"
import FullPost from "./components/posts/fullPost/FullPost"
import ThemeContext, {Theme, themes} from './context/ThemeContext'
import './App.css'

interface State {
    theme: Theme;
}

export default class App extends Component<{}, State> {
    toggleTheme: () => void;

    constructor(props: any) {
        super(props);

        this.state = {
            theme: themes.dark,
        };

        this.toggleTheme = () => {

            this.setState(state => ({
                theme:
                    state.theme === themes.dark
                        ? themes.light
                        : themes.dark,
            }));
        };
    }


    render() {
        const {theme} = this.state;
        const {toggleTheme} = this;

        const routes = (
            <Switch>
                <Route path={'/posts'} exact component={Posts}/>}/>
                <Route path={'/posts/:id'} component={FullPost}/>
            </Switch>
        );
        return (
            <div style={theme}>
                <ThemeContext.Provider value={{theme, toggleTheme}}>
                    <Layout changeTheme={this.toggleTheme}>
                        <Suspense fallback={<div>...Loading</div>}>
                            {routes}
                        </Suspense>
                    </Layout>
                </ThemeContext.Provider>
            </div>
        )
    }
}