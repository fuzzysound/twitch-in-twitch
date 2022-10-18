import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { selectCurrentStreamsInfo, selectCurrentChatFrameInfo, selectCurrentChatIdx } from '../../../store/contentSlice'
import { BackgroundSignals } from '../../../common/signals'

function ContentFinderContainer(props) {
    const useStyles = makeStyles((theme) => ({
        contentFinderContainerGrid: {
            height: '40px',
            'flex-wrap': 'nowrap',
            margin: 'auto'
        }
    }))
    const classes = useStyles()

    const currentStreamsInfo = useSelector(selectCurrentStreamsInfo)

    const currentChatFrameInfo = useSelector(selectCurrentChatFrameInfo)

    const currentChatIdx = useSelector(selectCurrentChatIdx)

    const findContent = useCallback(() => {
        const addedStreams = Object.keys(currentStreamsInfo)
        const addedChats = currentChatFrameInfo.streamerIds.length === 0 ? [] : [currentChatFrameInfo.streamerIds[currentChatIdx]]
        chrome.runtime.sendMessage({ signal: BackgroundSignals.SHOW_CONTENT_OVERLAY, addedStreams: addedStreams, addedChats: addedChats })
    }, [currentChatFrameInfo.streamerIds, currentChatIdx, currentStreamsInfo])

    const resetPositionAndSize = useCallback(() => {
        chrome.runtime.sendMessage({ signal: BackgroundSignals.RESET_POSITION_AND_SIZE })
    }, [])

    return (
        <Grid className={classes.contentFinderContainerGrid} container spacing={1} item xs>
            <Grid item xs={6}>
                <Button variant='contained' onClick={findContent}>
                    {chrome.i18n.getMessage("find_content")}
                </Button>
            </Grid>
            <Grid item xs={6}>
                <Button variant='contained' onClick={resetPositionAndSize}>
                    {chrome.i18n.getMessage("reset_pos_and_size")}
                </Button>
            </Grid>
        </Grid>
    )
}

export default ContentFinderContainer