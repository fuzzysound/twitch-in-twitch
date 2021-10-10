import React from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import styles from './Content.module.css'
import { selectIsDarkMode } from '../../store/contentSlice'
import { ReactComponent as Hbar } from '../../assets/hbar.svg'
import { ReactComponent as HbarDark } from '../../assets/hbar_dark.svg'
import { ReactComponent as Refresh } from '../../assets/refresh.svg'
import { ReactComponent as RefreshDark } from '../../assets/refresh_dark.svg'
import { ReactComponent as X } from '../../assets/x.svg'
import { ReactComponent as XDark } from '../../assets/x_dark.svg'

function Header ({ id, title, onClickHbarButton, onClickRefreshButton, onClickXButton }) {
    const useStyles = makeStyles((theme) => ({
        headerGrid: {
            'flex-grow': 0,
            padding: '3px 1% 3px 5%',
            'border-radius': '8px 8px 0px 0px',
            'flex-wrap': 'nowrap',
            'height': '25px'
        },
        titleGrid: {
            'text-align': 'left',
            'cursor': 'move'
        },
        buttonGrid: {
            'flex-grow': 0,
            margin: '0 8px 0 8px'
        },
        lightMode: {
            background: 'rgb(239, 239, 241)',
            color: 'rgb(14, 14, 16)'
        },
        darkMode: {
            background: 'rgb(97, 97, 97)',
            color: 'rgb(255, 255, 255)'
        }
    }))

    const classes = useStyles();

    const isDarkMode = useSelector(selectIsDarkMode)

    return (
        <Grid className={classes.headerGrid + " " + (isDarkMode ? classes.darkMode : classes.lightMode)} container spacing={0} item xs>
            <Grid item xs className={classes.titleGrid}>
                <header className='handle'>{title}</header>
            </Grid>
            <Grid className={classes.buttonGrid} item xs>
                <button className={styles.Button} onClick={onClickHbarButton}>
                    {isDarkMode
                    ? <HbarDark />
                    : <Hbar />
                    }
                </button>
            </Grid>
            <Grid className={classes.buttonGrid} item xs>
                <button className={styles.Button} onClick={onClickRefreshButton}>
                    {isDarkMode
                    ? <RefreshDark />
                    : <Refresh />
                    }
                </button>
            </Grid>
            <Grid className={classes.buttonGrid} item xs>
                <button className={styles.Button} onClick={onClickXButton}>
                    {isDarkMode
                    ? <XDark />
                    : <X />
                    }
                </button>
            </Grid>
        </Grid>
    )
}

export default Header