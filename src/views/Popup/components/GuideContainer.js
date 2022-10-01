import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

function GuideContainer(props) {
    const useStyles = makeStyles((theme) => ({
        guideTextGrid: {
            'font-size': '13px',
            'flex-wrap': 'nowrap'
        },
    }))
    const classes = useStyles()

    return (
        <Grid className={classes.guideTextGrid} container direction='column' item xs>
            <Grid item xs>
                {chrome.i18n.getMessage("guide1")}
            </Grid>
            <Grid item xs>
                {chrome.i18n.getMessage("guide2")}
            </Grid>
        </Grid>
    )
}

export default GuideContainer