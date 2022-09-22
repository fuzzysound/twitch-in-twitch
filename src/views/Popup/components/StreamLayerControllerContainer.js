import React from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import styles from '../Popup.module.css'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { useCallback } from 'react'
import { BackgroundSignals } from '../../../common/signals'
import { selectStreamLayer } from '../../../store/contentSlice';

function StreamLayerControllerContainer({ onSelectInnerLayer, onSelectOuterLayer }) {
    const useStyles = makeStyles((theme) => ({
        descriptionField: {
            'font-size': '15px',
            'text-align': 'left',
            'flex-grow': 1,
        },
        radioGrid: {
            'display': 'flex',
            'flex-direction': 'row',
        },
    }))
    const classes = useStyles()

    const streamLayer = useSelector(selectStreamLayer)

    const handleChange = useCallback(event => {
        if (event.target.value === "inner") {
            chrome.runtime.sendMessage({ signal: BackgroundSignals.CHANGE_STREAM_LAYER_TO_INNER })
        } else {
            chrome.runtime.sendMessage({ signal: BackgroundSignals.CHANGE_STREAM_LAYER_TO_OUTER })
        }
    }, [])

    return (
        <Grid container direction='column' spacing={0} item xs>
            <div className={classes.descriptionField}>
                {chrome.i18n.getMessage("stream_layer")}
            </div>
            <FormControl component="fieldset">
                <RadioGroup aria-label="layer" name="layer" className={classes.radioGrid} defaultValue={streamLayer} onChange={handleChange}>
                    <FormControlLabel value="inner" control={<Radio color="primary" />} label={chrome.i18n.getMessage("stream_layer_inner")} />
                    <FormControlLabel value="outer" control={<Radio color="primary" />} label={chrome.i18n.getMessage("stream_layer_outer")} />
                </RadioGroup>
            </FormControl>
        </Grid>
    )
}

export default StreamLayerControllerContainer