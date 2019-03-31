import React from "react";
import {Component, Suspense} from "react";
import {Route, Switch} from 'react-router-dom';
import Layout from './hoc/Layout/Layout';
import Posts from "./components/posts/Posts"
import FullPost from "./components/posts/fullPost/FullPost"
import ThemeContext, {Theme, themes} from './context/ThemeContext'
import './App.css'
import GraphPage from "./components/graphPage/graphPage";

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

        this.changeTheme();

        this.toggleTheme = () => {
            this.changeTheme();
            this.setState(state => ({
                theme:
                    state.theme === themes.dark
                        ? themes.light
                        : themes.dark,
            }));
        };
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<State>, snapshot?: any): void {
        if (prevState.theme !== this.state.theme) {
            this.changeTheme()
        }
    }

    changeTheme = () => {
        const bodyClasses = document.body.classList;
        const curTheme = this.state.theme === themes.dark ?
            'dark' : 'light';

        while (bodyClasses.length > 0) {
            bodyClasses.remove(bodyClasses[bodyClasses.length - 1])
        }
        bodyClasses.toggle(curTheme);
    };

    render() {
        const {theme} = this.state;
        const {toggleTheme} = this;

        const routes = (
            <Switch>
                <Route path={'/posts'} exact component={Posts}/>}/>
                <Route path={'/posts/:id'} component={FullPost}/>
                <Route path={'/graph'} component={GraphPage}/>
            </Switch>
        );
        return (
            <div>
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