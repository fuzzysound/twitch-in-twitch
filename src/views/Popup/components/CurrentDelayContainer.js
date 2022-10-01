import React from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { selectCurrentMainBroadcastDelay } from '../../../store/contentSlice'

function CurrentDelayContainer(props) {
    const useStyles = makeStyles((theme) => ({
        currentDelayContainerGrid: {
            height: '15px',
            'font-size': '12px',
            'flex-wrap': 'nowrap'
        },
        tipTextGrid: {
            height: '15px',
            'font-size': '12px',
            'flex-wrap': 'nowrap'
        }
    }))
    const classes = useStyles()

    const currentMainBroadcastDelay = useSelector(selectCurrentMainBroadcastDelay)

    return (
        <Grid container direction='column' spacing={1} item xs>
            <Grid className={classes.currentDelayContainerGrid} item xs>
                {chrome.i18n.getMessage("current_delay", currentMainBroadcastDelay.toString())}
            </Grid>
            <Grid className={classes.tipTextGrid} item xs>
                {chrome.i18n.getMessage("delay_tip")}
            </Grid>
        </Grid>
    )
}

export default CurrentDelayContainer