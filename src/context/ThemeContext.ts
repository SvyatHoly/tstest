import React from 'react';

export type Theme = React.CSSProperties;

type Themes = {
    dark: Theme;
    light: Theme;
};

export const themes: Themes = {
    light: {
        color: '#3c3f41',
        backgroundColor: '#eeeeee',
    },
    dark: {
        color: '#eeeeee',
        backgroundColor: '#3c3f41',
    },
};

export type ThemeContextProps = { theme: Theme; toggleTheme?: () => void };
export const ThemeContext = React.createContext<ThemeContextProps>({theme: themes.light});

export default ThemeContext;