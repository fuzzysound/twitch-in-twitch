import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'
import { makeStyles } from '@material-ui/core/styles'
import { BackgroundSignals } from '../../../common/signals'
import { selectIsVodMoveTimeTogether, selectIsVodSpoilerFree } from '../../../store/contentSlice'

function VodFeatureControllerContainer(props) {
    const useStyles = makeStyles((theme) => ({
        vodFeatureControllerContainerGrid: {
            'flex-wrap': 'nowrap'
        },
        descriptionField: {
            'font-size': '15px',
            'text-align': 'left',
            'flex-grow': 1
        },
        itemField: {
            'font-size': '16px',
            'text-align': 'left',
            'line-height': '250%',
            'flex-grow': 1
        },
    }))
    const classes = useStyles()

    const isVodMoveTimeTogether = useSelector(selectIsVodMoveTimeTogether)

    const isVodSpoilerFree = useSelector(selectIsVodSpoilerFree)

    const toggleVodMoveTimeTogether = useCallback(() => {
        chrome.runtime.sendMessage({ signal: BackgroundSignals.TOGGLE_VOD_MOVE_TIME_TOGETHER })
    }, [])

    const toggleVodSpoilerFree = useCallback(() => {
        chrome.runtime.sendMessage({ signal: BackgroundSignals.TOGGLE_VOD_SPOILER_FREE })
    }, [])

    return (
        <Grid className={classes.vodFeatureControllerContainerGrid} direction='column' container spacing={0} item xs>
            <div className={classes.descriptionField}>
                {chrome.i18n.getMessage("vod_feature")}
            </div>
            <Grid className={classes.itemField} container spacing={0} item xs>
                <Grid item xs={1}></Grid>
                <Grid item xs={5}>
                    {chrome.i18n.getMessage("vod_move_time_together")}
                </Grid>
                <Grid item xs={4}>
                    <Switch
                    checked={isVodMoveTimeTogether}
                    onChange={toggleVodMoveTimeTogether}
                    color='default'
                    />
                </Grid>
                <Grid item xs={2}></Grid>
            </Grid>
            <Grid className={classes.itemField} container spacing={0} item xs>
                <Grid item xs={1}></Grid>
                <Grid item xs={5}>
                    {chrome.i18n.getMessage("vod_spoiler_free")}
                </Grid>
                <Grid item xs={4}>
                    <Switch
                    checked={isVodSpoilerFree}
                    onChange={toggleVodSpoilerFree}
                    color='default'
                    />
                </Grid>
                <Grid item xs={2}></Grid>
            </Grid>
        </Grid>
    )
}

export default VodFeatureControllerContainer