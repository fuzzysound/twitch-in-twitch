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

    return (
        <Grid className={classes.contentFinderContainerGrid} container spacing={1} item xs>
            <Button variant='contained' onClick={findContent}>
                I can't find streams or chat!
            </Button>
        </Grid>
    )
}

export default ContentFinderContainer