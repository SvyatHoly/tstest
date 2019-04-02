import React, {Component} from 'react'
import SinglePost from './singlePost/SinglePost'
import * as classes from './Posts.module.css'
import {getPosts} from '../../api'
import {findSubString} from '../../util/stringSearchUtil'
import {ThemeContext} from '../../App';

interface IProps {
    history: any;
    match: any;
}

interface IPost {
    /** Заголовок поста */
    title: string;
    /** Тело поста */
    body: string;
    /** Id поста */
    id: number;
}

interface IFoundPost {
    'postId': number;
    'index': number;
    'strLength': number;
}

interface IState {
    data: Array<IPost> | null;
    posts: Array<IPost> | null;
    input: string;
    foundPosts: Array<IFoundPost> | null;
}

/**
 * Компонент рендерит страницу с карточками постов.
 */
class Posts extends Component<IProps, IState> {

    constructor(props: any) {
        super(props);

        this.state = {
            data: null,
            posts: null,
            input: '',
            foundPosts: null
        }
    };

    /**
     * Запрос постов с сервера
     */
    async componentDidMount(): Promise<void> {
        const posts = await getPosts();
        this.setState({data: posts, posts: posts});
    };

    /**
     * Если строка поиска не пустая запускает поиск постов
     */
    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        const {input} = this.state;
        if (prevState.input !== input) {
            this.searchPosts();
        }
    };

    /**
     * При клике на карточку добавляет номер поста в history path
     * @param id - ID
     */
    handleClick = (id: number): void => {
        const {history, match} = this.props;
        history.push(match.url + '/' + id);
    };

    /**
     * Сохраняет данные из строки ввода в стейт
     */
    inputHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        this.setState({input: value});
    };

    /**
     * Находит посты в которых встречаются соответствия со строкой ввода
     * и сохраняет номера найденных постов в стейт
     */
    searchPosts = () => {
        const {input, data} = this.state;
        if (input) {
            const found: Array<IFoundPost> = [];
            data.forEach((el, i) => {
                const isFound = findSubString(input, el.body);
                if (isFound !== -1) found.push({
                    'postId': i,
                    'index': isFound,
                    'strLength': input.length
                });
            });
            this.setState({foundPosts: found})
        } else this.setState({foundPosts: null})
    };

    /** Рендеринг всех постов */
    renderPosts = () => {

        const {posts, foundPosts} = this.state;

        if (!posts) return null;

        else if (foundPosts) {
            return foundPosts.map(node => {
                return this.dataMapper(posts[node.postId], node.index, node.strLength);
            });
        } else {
            return posts.map((item) => this.dataMapper(item));
        }

    };

    /** Вывод карточек с постами */
    dataMapper = (item: IPost, marker?: number, strLength?: number) => {
        return (
            <SinglePost
                handleClick={() => this.handleClick(item.id)}
                key={item.id}
                title={item.title}
                body={item.body}
                marker={marker}
                strLength={strLength}
            />
        )
    };

    render() {
        const {input} = this.state;

        return (
            <ThemeContext.Consumer>
                {(theme)=>
                    <div className={[classes.container, theme].join(' ')}>
                        <div className={classes.inputBox}>
                            <label className={classes.label}>SEARCH
                            <input
                                className={classes.input}
                                onChange={this.inputHandler}
                                value={input}
                            />
                            </label>
                        </div>
                        {this.renderPosts()}
                    </div>
                }
            </ThemeContext.Consumer>
                );
    };
}

export default Posts;