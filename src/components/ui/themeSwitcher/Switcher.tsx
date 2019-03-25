import React from 'react'
import * as classes from './Switcher.module.css'
import './Switcher.module.css'
import ThemeContext from '../../../context/ThemeContext'

type Props = {};

const switcher = (props: Props) => {
    return (
        <ThemeContext.Consumer>{({theme, toggleTheme}) => (
            <div className={classes.body}>
                <div className={classes.check_label}>
                    <div className={classes.toggle}>
                        <input type="checkbox"
                               name="toggle"
                               className="check-checkbox"
                               id="mytoggle"
                        onChange={toggleTheme}
                        />
                        <label className={classes.check_label} htmlFor="mytoggle">
                            <div className={classes.background}/>
                            <span className={classes.face}>
        <span className={classes.face_container}>
          <span className={[classes.eye, classes.left].join(' ')}/>
          <span className={[classes.eye, classes.right].join(' ')}/>
          <span className={classes.mouth}/>
        </span>
      </span>
                        </label>
                    </div>
                </div>
            </div>
        )}

        </ThemeContext.Consumer>
    )
};

export default switcher;