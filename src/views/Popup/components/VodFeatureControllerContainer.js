import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'
import { makeStyles } from '@material-ui/core/styles'
import { BackgroundSignals } from '../../../common/signals'
import { selectIsVodMoveTimeTogether, selectIsVodSpoilerFree, selectTimeMoveUnit } from '../../../store/contentSlice'
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core'

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
        radioGrid: {
            'display': 'flex',
            'flex-direction': 'row',
        },
    }))
    const classes = useStyles()

    const isVodMoveTimeTogether = useSelector(selectIsVodMoveTimeTogether)

    const isVodSpoilerFree = useSelector(selectIsVodSpoilerFree)

    const timeMoveUnit = useSelector(selectTimeMoveUnit)

    const toggleVodMoveTimeTogether = useCallback(() => {
        chrome.runtime.sendMessage({ signal: BackgroundSignals.TOGGLE_VOD_MOVE_TIME_TOGETHER })
    }, [])

    const toggleVodSpoilerFree = useCallback(() => {
        chrome.runtime.sendMessage({ signal: BackgroundSignals.TOGGLE_VOD_SPOILER_FREE })
    }, [])

    const changeTimeMoveUnit = useCallback(event => {
        chrome.runtime.sendMessage({ signal: BackgroundSignals.CHANGE_TIME_MOVE_UNIT, timeMoveUnit: event.target.value })
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
            <Grid className={classes.itemField} container spacing={0} item xs>
                <Grid item xs={1}></Grid>
                <Grid item xs={5}>
                    {chrome.i18n.getMessage("vod_time_move_unit")}
                </Grid>
                <Grid item xs={6}></Grid>
            </Grid>
            <Grid className={classes.itemField} spacing={0} item xs>
                <FormControl component="fieldset">
                    <RadioGroup 
                    aria-label='layer' 
                    name='layer' 
                    className={classes.radioGrid} 
                    defaultValue={String(timeMoveUnit)} 
                    onChange={changeTimeMoveUnit}
                    >
                        <FormControlLabel value='5' control={<Radio color='primary' />} label={'5' + chrome.i18n.getMessage("sec")} />
                        <FormControlLabel value='10' control={<Radio color='primary' />} label={'10' + chrome.i18n.getMessage("sec")} />
                        <FormControlLabel value='30' control={<Radio color='primary' />} label={'30' + chrome.i18n.getMessage("sec")} />
                        <FormControlLabel value='60' control={<Radio color='primary' />} label={'60' + chrome.i18n.getMessage("sec")} />
                        <FormControlLabel value='300' control={<Radio color='primary' />} label={'300' + chrome.i18n.getMessage("sec")} />
                    </RadioGroup>
                </FormControl>
            </Grid>
        </Grid>
    )
}

export default VodFeatureControllerContainer