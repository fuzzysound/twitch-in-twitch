import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'
import { makeStyles } from '@material-ui/core/styles'
import { selectIsDarkMode } from '../../../store/contentSlice'
import { BackgroundSignals } from '../../../common/signals'

function DarkModeControllerContainer(props) {
    const useStyles = makeStyles((theme) => ({
        darkModeControllerContainerGrid: {
            height: '40px',
            'flex-wrap': 'nowrap'
        },
        descriptionField: {
            'font-size': '15px',
            'text-align': 'left',
            'flex-basis': '10ch',
            'flex-grow': 1
        }
    }))
    const classes = useStyles()

    const isDarkMode = useSelector(selectIsDarkMode)

    const toggleDarkMode = useCallback(() => {
        chrome.runtime.sendMessage({ signal: BackgroundSignals.TOGGLE_DARK_MODE })
    }, [])
    
    return (
        <Grid className={classes.darkModeControllerContainerGrid} container spacing={1} item xs>
            <Grid item xs={4}>
                <div className={classes.descriptionField}>
                    다크 모드
                </div>
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={4}>
                <Switch
                checked={isDarkMode}
                onChange={toggleDarkMode}
                color='default'
                />
            </Grid>
            <Grid item xs={2}></Grid>
        </Grid>
    )
}

export default DarkModeControllerContainer