import React, { useState, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Rnd } from 'react-rnd'
import Grid from '@material-ui/core/Grid'
import { Animate } from 'react-simple-animate'
import { makeStyles } from '@material-ui/core/styles'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import './content.css'
import styles from './Content.module.css'
import { selectCurrentChatIdx, selectShowChatFrame, selectIsDarkMode } from '../../store/contentSlice'
import { onDragStartHandler, onDragStopHandler, onResizeStartHandler,
onResizeStopHandler } from '../../common/utils'
import { BackgroundSignals } from '../../common/signals'
import { CHAT_ID_PREFIX } from '../../common/constants'
import Header from './Header'
import ChatEmbed from './ChatEmbed'
import { ReactComponent as X } from '../../assets/x.svg'
import { ReactComponent as XDark} from '../../assets/x_dark.svg'

function ChatFrame({ host, streamerIds, tabId, initPos, initSize }) {
    const [isHeaderVisible, setIsHeaderVisible] = useState(false)
    
    const [isChatFrameVisible, setIsChatFrameVisible] = useState(true)

    const [pos, setPos] = useState(initPos)

    const [size, setSize] = useState(initSize)

    const useStyles = makeStyles((theme) => ({
        rootGrid: {
            width: '100%',
            height: '100%',
            'flex-wrap': 'nowrap'
        },
        tabsGrid: {
            width: '100%',
            'flex-grow': 1,
            visibility: isChatFrameVisible ? 'visible' : 'hidden'
        },
        innerTabsGrid: {
            width: '100%',
            height: '100%'
        },
        tabListGrid: {
            'flex-grow': 0
        },
        tabGrid: {
            display: 'flex',
            'flex-wrap': 'nowrap'
        },
        tabTitleGrid: {
            'text-align': 'left'
        },
        tabPanelGrid: {
        },
        tabXButtonGrid: {
            'flex-grow': 0
        },
        lightMode: {
            background: 'rgb(247, 247, 248)',
            color: 'rgb(14, 14, 16)'
        },
        darkMode: {
            background: 'rgb(66, 66, 66)',
            color: 'rgb(255, 255, 255)'
        }
    }))
    const classes = useStyles();

    const revealHeader = useCallback(() => setIsHeaderVisible(true), [])

    const hideHeader = useCallback(() => setIsHeaderVisible(false), [])

    const toggleChatFrameVisibility = useCallback(() => setIsChatFrameVisible(!isChatFrameVisible), [isChatFrameVisible])

    const removeChat = useCallback(streamerId => () => {
        chrome.runtime.sendMessage({ signal: BackgroundSignals.REMOVE_CHAT, streamerId: streamerId })
    }, [])

    const selectChat = useCallback(idx => {
        chrome.runtime.sendMessage({ signal: BackgroundSignals.SELECT_CHAT, idx: idx })
    }, [])

    const refreshChat = useCallback((streamerIds, currentChatIdx) => () => {
        const streamerId = streamerIds[currentChatIdx]
        const iframeToRefresh = document.getElementById(CHAT_ID_PREFIX + streamerId)
        if (iframeToRefresh !== null && iframeToRefresh.tagName === "IFRAME") {
            iframeToRefresh.contentWindow.location.reload(true)
        }
    }, [])

    const removeChatFrame = useCallback(tabId => () => {
        chrome.runtime.sendMessage({ signal: BackgroundSignals.REMOVE_CHAT_FRAME, tabId: tabId })
    }, [])

    const updateChatFrameLastPos = useCallback(pos => () => {
        chrome.runtime.sendMessage({ signal: BackgroundSignals.UPDATE_CHAT_FRAME_LAST_POS, pos: pos })
    }, [])

    const updateChatFrameLastPosAndSize = useCallback((pos, size) => () => {
        chrome.runtime.sendMessage({ signal: BackgroundSignals.UPDATE_CHAT_FRAME_LAST_POS, pos: pos })
        chrome.runtime.sendMessage({ signal: BackgroundSignals.UPDATE_CHAT_FRAME_LAST_SIZE, size: size })
    }, [])

    const tabElementStyle = useMemo(() => ({
        width: '100%',
        height: '100%'
    }), [])

    const currentChatIdx = useSelector(selectCurrentChatIdx)

    const showChatFrame = useSelector(selectShowChatFrame)

    const isDarkMode = useSelector(selectIsDarkMode)

    const tabs = streamerIds.map((streamerId, idx) => (
        <Tab 
        className="tab"
        selectedClassName={isDarkMode ? "selected-tab-dark-mode" : "selected-tab-light-mode"}
        key={streamerId}>
            <Grid className={classes.tabGrid} container spacing={1} item xs>
                <Grid className={classes.tabTitleGrid} item xs>
                    {streamerId}
                </Grid>
                {currentChatIdx === idx &&
                <Grid className={classes.tabXButtonGrid} item xs>
                    <button className={styles.Button} onClick={removeChat(streamerId)}>
                        {isDarkMode
                        ? <XDark />
                        : <X />
                        }
                    </button>
                </Grid>
                }
            </Grid>
        </Tab>
    ))

    const tabPanels = streamerIds.map(streamerId => (
        <TabPanel key={streamerId} style={tabElementStyle}>
            <ChatEmbed
            channel={streamerId}
            parent={host}
            isDarkMode={isDarkMode}
            width='100%'
            height='100%'
            />
        </TabPanel>
    ))

    return (
        <div>
            {showChatFrame && 
            <Rnd
            className={styles['rnd-chat']}
            size={{ width: size.width, height: size.height }}
            position={{ x: pos.x, y: pos.y }}
            dragHandleClassName='handle'
            onDragStart={onDragStartHandler}
            onDragStop={(event, data) => {
                const newPos = { x: data.x, y: data.y }
                onDragStopHandler(newPos, setPos, updateChatFrameLastPos(newPos))
            }}
            onResizeStart={onResizeStartHandler}
            onResizeStop={(e, dir, ref, delta, newPos) => {
                const newSize = { width: ref.offsetWidth, height: ref.offsetHeight }
                onResizeStopHandler(newPos, setPos, newSize, setSize, 
                    updateChatFrameLastPosAndSize(newPos, newSize))
            }}
            onMouseEnter={revealHeader}
            onMouseLeave={hideHeader}
            >
                <Grid className={classes.rootGrid} container spacing={0} direction='column'>
                    <Animate
                    play={isHeaderVisible}
                    start={{ opacity: 0 }}
                    end={{ opacity: 1 }}
                    duration={0.1}
                    >
                        <Header 
                        title={chrome.i18n.getMessage("chat")} 
                        onClickHbarButton={toggleChatFrameVisibility} 
                        onClickRefreshButton={refreshChat(streamerIds, currentChatIdx)}
                        onClickXButton={removeChatFrame(tabId)}
                        />
                    </Animate>

                    <Grid className={classes.tabsGrid + " " + (isDarkMode ? classes.darkMode : classes.lightMode)} container item xs>
                        <Tabs 
                        className="chat-tab"
                        forceRenderTabPanel={true} 
                        selectedIndex={currentChatIdx} 
                        onSelect={(idx, lastIdx, e) => selectChat(idx)}>
                            <Grid className={classes.innerTabsGrid} container direction='column'>
                                <Grid className={classes.tabListGrid} item xs>
                                    <TabList
                                    className={isDarkMode ? "tab-list-dark-mode" : "tab-list-light-mode"}>
                                        {tabs}
                                    </TabList>
                                </Grid>
                                <Grid item xs>
                                    {tabPanels}
                                </Grid>
                            </Grid>
                        </Tabs>
                    </Grid>
                </Grid>
            </Rnd>
            }
        </div>
    )
}

export default ChatFrame