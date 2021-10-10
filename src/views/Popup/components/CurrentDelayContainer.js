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
        }
    }))
    const classes = useStyles()

    const currentMainBroadcastDelay = useSelector(selectCurrentMainBroadcastDelay)

    return (
        <Grid className={classes.currentDelayContainerGrid} item xs>
            현재 딜레이: {currentMainBroadcastDelay.toString()}초
        </Grid>
    )
}

export default CurrentDelayContainer