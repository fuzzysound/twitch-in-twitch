import React, { useCallback } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { BackgroundSignals } from '../../../common/signals'

function StateResetControllerContainer(props) {
    const useStyles = makeStyles((theme) => ({
        buttonLineGrid: {
            height: '40px',
            'line-height': '180%',
            margin: '5px 0 5px 0'
        }
    }))
    const classes = useStyles()

    const resetContentState = useCallback(() => {
        chrome.runtime.sendMessage({ signal: BackgroundSignals.RESET_CONTENT_STATE })
        props.onResetState()
    }, [props])

    const resetAllState = useCallback(() => {
        chrome.runtime.sendMessage({ signal: BackgroundSignals.RESET_CONTENT_STATE })
        chrome.runtime.sendMessage({ signal: BackgroundSignals.RESET_FAVORITE_STATE })
        props.onResetState()
    }, [props])

    return (
        <Grid container direction='column' spacing={1} item xs>
            <Grid className={classes.buttonLineGrid} item xs>
                <Button variant='contained' onClick={resetContentState}>
                    {chrome.i18n.getMessage("option_state_reset_content_only")}
                </Button>
            </Grid>
            <Grid className={classes.buttonLineGrid} item xs>
                <Button variant='contained' onClick={resetAllState}>
                    {chrome.i18n.getMessage("option_state_reset_all")}
                </Button>
            </Grid>
        </Grid>
    )
}

export default StateResetControllerContainer