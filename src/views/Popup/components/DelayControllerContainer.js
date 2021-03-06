import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { selectCurrentMainBroadcastDelay } from '../../../store/contentSlice'
import { ForegroundSignals, BackgroundSignals } from '../../../common/signals'
import FloatTextField from '../../TextFields/FloatTextField'

function DelayControllerContainer(props) {
    const [delaySec, setDelaySec] = useState(0);

    const useStyles = makeStyles((theme) => ({
        delayControllerContainerGrid: {
            height: '40px',
            'flex-wrap': 'nowrap'
        },
        descriptionField: {
            'font-size': '15px',
            'text-align': 'left',
            'flex-basis': '10ch',
            'flex-grow': 1
        },
        textField: {
            'flex-basis': '10ch',
            'flex-grow': 0
        },
        buttonGrid: {
            'flex-basis': '35px',
            'flex-grow': 0
        }
    }))
    const classes = useStyles()

    const handleChange = event => setDelaySec(event.target.value)

    const currentMainBroadcastDelay = useSelector(selectCurrentMainBroadcastDelay)

    const applyDelay = useCallback(() => {
        const parsedDelaySec = parseFloat(delaySec)
        const interval = parsedDelaySec - currentMainBroadcastDelay
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, {signal: ForegroundSignals.DELAY, interval: interval})
            chrome.runtime.sendMessage({ signal: BackgroundSignals.UPDATE_DELAY, tabId: tabs[0].id, delaySec: parsedDelaySec })
        })
    }, [delaySec, currentMainBroadcastDelay])

    return (
        <Grid className={classes.delayControllerContainerGrid} container spacing={1} item xs>
            <Grid item xs={4}>
                <div className={classes.descriptionField}>
                    {chrome.i18n.getMessage("delay")}
                </div>
            </Grid>
            <Grid item xs={4}>
                <form onSubmit={applyDelay}>
                    <FloatTextField
                    className={classes.textField}
                    suffix={chrome.i18n.getMessage("sec")}
                    onChange={handleChange}
                    />
                </form>
            </Grid>
            <Grid container spacing={0} item xs={4}>
                <Grid item xs={1} />
                <Grid item xs={2}>
                    <Button variant='contained' onClick={applyDelay}>
                        {chrome.i18n.getMessage("apply")}
                    </Button>
                </Grid>
                <Grid item xs={1} />
            </Grid>
        </Grid>
    )
}

export default DelayControllerContainer