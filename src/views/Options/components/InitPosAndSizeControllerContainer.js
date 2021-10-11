import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { BackgroundSignals } from '../../../common/signals'
import IntegerTextField from '../../TextFields/IntegerTextField'
import { selectStreamInitPosition, selectStreamInitSize,
selectChatFrameInitPosition, selectChatFrameInitSize } from '../../../store/contentSlice'

function InitPosAndSizeControllerContainer(props) {
    const useStyles = makeStyles((theme) => ({
        titleLineGrid: {
            height: '30px',
            'font-size': '18px'
        },
        inputLineGrid: {
            height: '40px',
            'flex-wrap': 'nowrap',
            'line-height': '180%',
            'font-size': '15px',
            margin: '5px 0 10px 0'
        }
    }))
    const classes = useStyles()

    const streamInitPosition = useSelector(selectStreamInitPosition)

    const streamInitSize = useSelector(selectStreamInitSize)

    const chatFrameInitPosition = useSelector(selectChatFrameInitPosition)

    const chatFrameInitSize = useSelector(selectChatFrameInitSize)

    const updateStreamInitPositionX = useCallback(event => {
        const x = parseInt(event.target.value)
        chrome.runtime.sendMessage({ 
            signal: BackgroundSignals.UPDATE_STREAM_INIT_POS, 
            newPos: {x: x} })
    }, [])

    const updateStreamInitPositionY = useCallback(event => {
        const y = parseInt(event.target.value)
        chrome.runtime.sendMessage({ 
            signal: BackgroundSignals.UPDATE_STREAM_INIT_POS, 
            newPos: {y: y} 
        })
    }, [])

    const updateStreamInitSizeWidth = useCallback(event => {
        const width = parseInt(event.target.value)
        chrome.runtime.sendMessage({  
            signal: BackgroundSignals.UPDATE_STREAM_INIT_SIZE, 
            newSize: {width: width} })
    }, [])
    
    const updateStreamInitSizeHeight = useCallback(event => {
        const height = parseInt(event.target.value)
        chrome.runtime.sendMessage({ 
            signal: BackgroundSignals.UPDATE_STREAM_INIT_SIZE, 
            newSize: {height: height} })
    }, [])
    
    const updateChatFrameInitPositionX = useCallback(event => {
        const x = parseInt(event.target.value)
        chrome.runtime.sendMessage({  
            signal: BackgroundSignals.UPDATE_CHAT_FRAME_INIT_POS, 
            newPos: {x: x} })
    }, [])

    const updateChatFrameInitPositionY = useCallback(event => {
        const y = parseInt(event.target.value)
        chrome.runtime.sendMessage({ 
            signal: BackgroundSignals.UPDATE_CHAT_FRAME_INIT_POS, 
            newPos: {y: y} })
    }, [])

    const updateChatFrameInitSizeWidth = useCallback(event => {
        const width = parseInt(event.target.value)
        chrome.runtime.sendMessage({ 
            signal: BackgroundSignals.UPDATE_CHAT_FRAME_INIT_SIZE, 
            newSize: {width: width} })
    }, [])
    
    const updateChatFrameInitSizeHeight = useCallback(event => {
        const height = parseInt(event.target.value)
        chrome.runtime.sendMessage({ 
            signal: BackgroundSignals.UPDATE_CHAT_FRAME_INIT_SIZE, 
            newSize: {height: height} })
    }, [])

    return (
        <Grid container direction='column' spacing={1} item xs>
            <Grid className={classes.titleLineGrid} item xs>
                Stream Initial Position
            </Grid>
            <Grid className={classes.inputLineGrid} container spacing={0} item xs>
                <Grid item xs={2}>
                    x: 
                </Grid>
                <Grid item xs={3}>
                    <IntegerTextField
                    suffix='px'
                    defaultValue={streamInitPosition.x}
                    onChange={updateStreamInitPositionX}
                    />
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={2}>
                    y:
                </Grid>
                <Grid item xs={3}>
                    <IntegerTextField
                    suffix='px'
                    defaultValue={streamInitPosition.y}
                    onChange={updateStreamInitPositionY}
                    />
                </Grid>
            </Grid>
            <Grid className={classes.titleLineGrid} item xs>
                Stream Initial Size
            </Grid>
            <Grid className={classes.inputLineGrid} container spacing={0} item xs>
                <Grid item xs={2}>
                    width: 
                </Grid>
                <Grid item xs={3}>
                    <IntegerTextField
                    suffix='px'
                    defaultValue={streamInitSize.width}
                    onChange={updateStreamInitSizeWidth}
                    />
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={2}>
                    height:
                </Grid>
                <Grid item xs={3}>
                    <IntegerTextField
                    suffix='px'
                    defaultValue={streamInitSize.height}
                    onChange={updateStreamInitSizeHeight}
                    />
                </Grid>
            </Grid>
            <Grid className={classes.titleLineGrid} item xs>
                Chat Initial Position
            </Grid>
            <Grid className={classes.inputLineGrid} container spacing={0} item xs>
                <Grid item xs={2}>
                    x: 
                </Grid>
                <Grid item xs={3}>
                    <IntegerTextField
                    suffix='px'
                    defaultValue={chatFrameInitPosition.x}
                    onChange={updateChatFrameInitPositionX}
                    />
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={2}>
                    y:
                </Grid>
                <Grid item xs={3}>
                    <IntegerTextField
                    suffix='px'
                    defaultValue={chatFrameInitPosition.y}
                    onChange={updateChatFrameInitPositionY}
                    />
                </Grid>
            </Grid>
            <Grid className={classes.titleLineGrid} item xs>
                Chat Initial Size
            </Grid>
            <Grid className={classes.inputLineGrid} container spacing={0} item xs>
                <Grid item xs={2}>
                    width: 
                </Grid>
                <Grid item xs={3}>
                    <IntegerTextField
                    suffix='px'
                    defaultValue={chatFrameInitSize.width}
                    onChange={updateChatFrameInitSizeWidth}
                    />
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={2}>
                    height:
                </Grid>
                <Grid item xs={3}>
                    <IntegerTextField
                    suffix='px'
                    defaultValue={chatFrameInitSize.height}
                    onChange={updateChatFrameInitSizeHeight}
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}

export default InitPosAndSizeControllerContainer