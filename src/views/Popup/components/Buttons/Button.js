import React from 'react'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'

function Button ({ buttonClass, tooltipText, onClick }) {
    const usestyles = makeStyles((theme) => ({
        buttongrid: {
            'flex-grow': 0
        },
        tooltip: {
            margin: "5 5 5px"
        }
    }))
    const classes = usestyles()

    return (
        <Tooltip className={classes.tooltip} title={tooltipText} placement='top'>
            <Grid className={classes.buttongrid} item xs>
                <button className={buttonClass} onClick={onClick} />
            </Grid>
        </Tooltip>
    )
}

export default Button