import React from "react";
import {Component, Suspense} from "react";
import {Route, Switch} from 'react-router-dom';
import Layout from './hoc/Layout/Layout';
import Posts from "./components/posts/Posts"
import FullPost from "./components/posts/fullPost/FullPost"
import './App.css'
import GraphPage from "./components/graphPage/graphPage";
import Table from './components/table/table';

export interface ThemeContextI { theme: string; toggleTheme: () => void }
export const ThemeContext = React.createContext<ThemeContextI>({
    theme: 'light',
    toggleTheme: () => null
});

type State = { theme: string; }

export default class App extends Component<{}, State> {
    toggleTheme: () => void;

    constructor(props: any) {
        super(props);

        this.state = {
            theme: 'dark',
        };

        this.changeTheme();

        this.toggleTheme = ():void => {
            this.changeTheme();
            this.setState(state => ({
                theme:
                    state.theme === 'dark'
                        ? 'light'
                        : 'dark',
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
        const curTheme = this.state.theme === 'dark' ?
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
                <Route path={'/table'} component={Table}/>
            </Switch>
        );
        return (
            <div>
                <ThemeContext.Provider
                value={{
                    theme,
                    toggleTheme: toggleTheme}}>
                    <Layout changeTheme={toggleTheme}>
                        <Suspense fallback={<div>...Loading</div>}>
                            {routes}
                        </Suspense>
                    </Layout>
                </ThemeContext.Provider>
            </div>
        )
    }
}