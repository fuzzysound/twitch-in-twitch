import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import styles from './Content.module.css'
import { ReactComponent as Hbar } from '../../assets/hbar.svg'
import { ReactComponent as Refresh } from '../../assets/refresh.svg'
import { ReactComponent as X } from '../../assets/x.svg'

function Header ({ id, title, onClickHbarButton, onClickRefreshButton, onClickXButton }) {
    const useStyles = makeStyles((theme) => ({
        headerGrid: {
            'flex-grow': 0,
            padding: '3px 1% 3px 5%',
            'border-radius': '8px 8px 0px 0px',
            'flex-wrap': 'nowrap',
            'height': '25px',
            'background': 'rgb(239, 239, 241)'
        },
        titleGrid: {
            'color': 'rgb(14, 14, 16)',
            'text-align': 'left',
            'cursor': 'move'
        },
        buttonGrid: {
            'flex-grow': 0,
            margin: '0 8px 0 8px'
        }
    }))

    const classes = useStyles();

    return (
        <Grid className={classes.headerGrid} container spacing={0} item xs>
            <Grid item xs className={classes.titleGrid}>
                <header className='handle'>{title}</header>
            </Grid>
            <Grid className={classes.buttonGrid} item xs>
                <button className={styles.Button} onClick={onClickHbarButton}>
                    <Hbar />
                </button>
            </Grid>
            <Grid className={classes.buttonGrid} item xs>
                <button className={styles.Button} onClick={onClickRefreshButton}>
                    <Refresh />
                </button>
            </Grid>
            <Grid className={classes.buttonGrid} item xs>
                <button className={styles.Button} onClick={onClickXButton}>
                    <X />
                </button>
            </Grid>
        </Grid>
    )
}

export default Header