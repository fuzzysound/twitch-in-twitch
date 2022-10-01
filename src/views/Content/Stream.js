import React, { useState, useCallback } from 'react'
import { Rnd } from 'react-rnd'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { Animate } from 'react-simple-animate'
import styles from './Content.module.css'
import { onDragStartHandler, onDragStopHandler, onResizeStartHandler,
onResizeStopHandler } from '../../common/utils'
import Header from './Header'
import StreamEmbed from './StreamEmbed'
import { BackgroundSignals, ForegroundSignals } from '../../common/signals'
import { STREAM_ID_PREFIX } from '../../common/constants'

function Stream ({ key, streamerId, host, initPos, initSize }) {
    const [isHeaderVisible, setIsHeaderVisible] = useState(false)
    
    const [isStreamVisible, setIsStreamVisible] = useState(true)

    const [pos, setPos] = useState(initPos)

    const [size, setSize] = useState(initSize)

    const useStyles = makeStyles((theme) => ({
        rootGrid: {
            width: '100%',
            height: '100%',
            'flex-wrap': 'nowrap'
        },
        streamGrid: {
            visibility: isStreamVisible ? 'visible': 'hidden'
        }
    }))

    const classes = useStyles()

    const revealHeader = useCallback(() => setIsHeaderVisible(true), [])

    const hideHeader = useCallback(() => setIsHeaderVisible(false), [])

    const toggleStreamVisibility = useCallback(() => setIsStreamVisible(!isStreamVisible), [isStreamVisible])

    const updateStreamLastPos = useCallback((streamerId, pos) => () => {
        chrome.runtime.sendMessage({ signal: BackgroundSignals.UPDATE_STREAM_LAST_POS, streamerId: streamerId, pos: pos })
    }, [])

    const updateStreamLastPosAndSize = useCallback((streamerId, pos, size) => () => {
        chrome.runtime.sendMessage({ signal: BackgroundSignals.UPDATE_STREAM_LAST_POS, streamerId: streamerId, pos: pos })
        chrome.runtime.sendMessage({ signal: BackgroundSignals.UPDATE_STREAM_LAST_SIZE, streamerId: streamerId, size: size })
    }, [])

    const refreshStream = useCallback(streamerId => () => {
        const iframeId = STREAM_ID_PREFIX + streamerId
        const iframeToRefresh = document.getElementById(iframeId)
        if (iframeToRefresh !== null && iframeToRefresh.tagName === "IFRAME") {
            iframeToRefresh.contentWindow.postMessage(ForegroundSignals.REFRESH, "*")
        }
    }, [])

    const removeStream = useCallback(streamerId => () => {
        chrome.runtime.sendMessage({ signal: BackgroundSignals.REMOVE_STREAM, streamerId: streamerId })
    }, [])


    return (
        <Rnd
        className={styles['rnd-stream']}
        size={{ width: size.width, height: size.height }}
        position={{ x: pos.x, y: pos.y }}
        lockAspectRatio={true}
        dragHandleClassName='handle'
        onDragStart={onDragStartHandler}
        onDragStop={(event, data) => {
            const newPos = { x: data.x, y: data.y }
            onDragStopHandler(newPos, setPos, updateStreamLastPos(streamerId, newPos))
        }}
        onResizeStart={onResizeStartHandler}
        onResizeStop={(event, dir, ref, delta, newPos) => {
            const newSize = { width: ref.offsetWidth, height: ref.offsetHeight }
            onResizeStopHandler(newPos, setPos, newSize, setSize, 
                updateStreamLastPosAndSize(streamerId, newPos, newSize))
        }}
        onMouseEnter={revealHeader}
        onMouseLeave={hideHeader}
        >
            <Grid container 
            className={classes.rootGrid}
            direction='column' 
            spacing={0} 
            >
                <Animate
                play={isHeaderVisible}
                start={{ opacity: 0 }}
                end={{ opacity: 1 }}
                duration={0.1}
                >
                    <Header 
                    title={streamerId} 
                    id={streamerId}
                    onClickHbarButton={toggleStreamVisibility}
                    onClickRefreshButton={refreshStream(streamerId)}
                    onClickXButton={removeStream(streamerId)}
                    />
                </Animate>
                <Grid className={classes.streamGrid} item xs>
                    <StreamEmbed
                    id={streamerId}
                    parent={host}
                    />
                </Grid>
            </Grid>
        </Rnd>
    )
}

export default Stream