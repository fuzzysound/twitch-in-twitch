import {
    createSlice
} from '@reduxjs/toolkit'
import {
    initStreamPosition,
    initStreamSize,
    initChatFramePosition,
    initChatFrameSize
} from '../common/utils'

const RU_ARRAY_MAX_SIZE = 20

const initialState = {
    addedStreamsByTabId: {},
    addedChatsByTabId: {},
    currentChatIdxByTabId: {},
    activeUrlsByTabId: {},
    streamLastPositions: {},
    streamLastSizes: {},
    chatFrameLastPosition: {},
    chatFrameLastSize: {},
    recentlyUsedStreamerIds: [],
    mainBroadcastDelayByTabId: {},
    currentTabId: -1
}

const contentSlice = createSlice({
    name: 'content',
    initialState,
    reducers: {
        addStream: {
            reducer(state, action) {
                const {
                    tabId,
                    streamerId,
                    url
                } = action.payload
                state.currentTabId = tabId
                // initialize array of streamer IDs for the tab if not exists
                if (!(tabId in state.addedStreamsByTabId)) {
                    state.addedStreamsByTabId[tabId] = []
                };
                // add streamer Id to the array
                if (!(state.addedStreamsByTabId[tabId].includes(streamerId))) {
                    state.addedStreamsByTabId[tabId].push(streamerId)
                };
                // set active url for the tab
                if (!(tabId in state.activeUrlsByTabId) || state.activeUrlsByTabId[tabId] !== url) {
                    state.activeUrlsByTabId[tabId] = url
                }
                // remove streamer Id from RU array if exists
                if (streamerId in state.recentlyUsedStreamerIds) {
                    const idx = state.recentlyUsedStreamerIds.indexOf(streamerId)
                    state.recentlyUsedStreamerIds.splice(idx, 1)
                }
                // push streamer Id to RU array
                if (!state.recentlyUsedStreamerIds.includes(streamerId)) {
                    state.recentlyUsedStreamerIds.push(streamerId)
                }
                while (state.recentlyUsedStreamerIds.length > RU_ARRAY_MAX_SIZE) {
                    // remove position and size of least recently used streamer Id
                    const spliced = state.recentlyUsedStreamerIds.splice(0, 1)
                    const LRUStreamerId = spliced[0]
                    delete state.streamLastPositions[LRUStreamerId]
                    delete state.streamLastSizes[LRUStreamerId]
                }
                // initialize stream last position if saved position not exists
                if (!(streamerId in state.streamLastPositions)) {
                    state.streamLastPositions[streamerId] = initStreamPosition()
                }
                // initialize stream last size if saved size not exists
                if (!(streamerId in state.streamLastSizes)) {
                    state.streamLastSizes[streamerId] = initStreamSize()
                }
            },
            prepare(tabId, streamerId, url) {
                return {
                    payload: {
                        tabId,
                        streamerId,
                        url
                    }
                }
            }
        },
        addChat: {
            reducer(state, action) {
                const {
                    tabId,
                    streamerId,
                    url
                } = action.payload
                state.currentTabId = tabId
                // initialize array of streamer IDs for the tab if not exists
                if (!(tabId in state.addedChatsByTabId)) {
                    state.addedChatsByTabId[tabId] = []
                };
                // add streamer Id to the array
                if (!(state.addedChatsByTabId[tabId].includes(streamerId))) {
                    state.addedChatsByTabId[tabId].push(streamerId)
                };
                // set active url for the tab
                if (!(tabId in state.activeUrlsByTabId) || state.activeUrlsByTabId[tabId] !== url) {
                    state.activeUrlsByTabId[tabId] = url
                }
                // initialize chat frame position if saved position not exists
                if (Object.keys(state.chatFrameLastPosition).length === 0) {
                    state.chatFrameLastPosition = initChatFramePosition()
                }
                // initialize chat frame size if saved size not exists
                if (Object.keys(state.chatFrameLastSize).length === 0) {
                    state.chatFrameLastSize = initChatFrameSize()
                }
                // set current chat idx
                if (tabId in state.addedChatsByTabId) {
                    state.currentChatIdxByTabId[tabId] = state.addedChatsByTabId[tabId].length - 1
                }
            },
            prepare(tabId, streamerId, url) {
                return {
                    payload: {
                        tabId,
                        streamerId,
                        url
                    }
                }
            }
        },
        removeStream: {
            reducer(state, action) {
                const {
                    tabId,
                    streamerId
                } = action.payload
                if (tabId in state.addedStreamsByTabId && state.addedStreamsByTabId[tabId].includes(streamerId)) {
                    const idx = state.addedStreamsByTabId[tabId].indexOf(streamerId)
                    state.addedStreamsByTabId[tabId].splice(idx, 1)
                }
            },
            prepare(tabId, streamerId) {
                return {
                    payload: {
                        tabId,
                        streamerId
                    }
                }
            }
        },
        removeChat: {
            reducer(state, action) {
                const {
                    tabId,
                    streamerId
                } = action.payload
                if (tabId in state.addedChatsByTabId && state.addedChatsByTabId[tabId].includes(streamerId)) {
                    const idx = state.addedChatsByTabId[tabId].indexOf(streamerId)
                    state.addedChatsByTabId[tabId].splice(idx, 1)
                }
                if (tabId in state.currentChatIdxByTabId) {
                    if (tabId in state.addedChatsByTabId && state.addedChatsByTabId[tabId].length > 0) {
                        state.currentChatIdxByTabId[tabId] = state.addedChatsByTabId[tabId].length - 1
                    } else {
                        delete state.currentChatIdxByTabId[tabId]
                    }
                }
            },
            prepare(tabId, streamerId) {
                return {
                    payload: {
                        tabId,
                        streamerId
                    }
                }
            }
        },
        selectChat: {
            reducer(state, action) {
                const {
                    tabId,
                    idx
                } = action.payload
                state.currentChatIdxByTabId[tabId] = idx
            },
            prepare(tabId, idx) {
                return {
                    payload: {
                        tabId,
                        idx
                    }
                }
            }
        },
        removeChatFrame(state, action) {
            delete state.addedChatsByTabId[action.payload]
            delete state.chatFrameLastPosition[action.payload]
            delete state.chatFrameLastSize[action.payload]
            delete state.currentChatIdxByTabId[action.payload]
        },
        removeTabRelatedState(state, action) {
            delete state.addedStreamsByTabId[action.payload]
            delete state.addedChatsByTabId[action.payload]
            delete state.chatFrameLastPosition[action.payload]
            delete state.chatFrameLastSize[action.payload]
            delete state.currentChatIdxByTabId[action.payload]
            delete state.activeUrlsByTabId[action.payload]
            delete state.mainBroadcastDelayByTabId[action.payload]
        },
        changeCurrentTab(state, action) {
            state.currentTabId = action.payload
        },
        updateStreamLastPosition: {
            reducer(state, action) {
                const { streamerId, newPos } = action.payload
                state.streamLastPositions[streamerId] = newPos
            },
            prepare(streamerId, newPos) {
                return { payload: { streamerId, newPos }}
            } 
        },
        updateStreamLastSize: {
            reducer(state, action) {
                const { streamerId, newSize } = action.payload
                state.streamLastSizes[streamerId] = newSize
            },
            prepare(streamerId, newSize) {
                return { payload: { streamerId, newSize }}
            }
        },
        updateChatFrameLastPosition(state, action) {
            state.chatFrameLastPosition = action.payload
        },
        updateChatFrameLastSize(state, action) {
            state.chatFrameLastSize = action.payload
        },
        updateMainBroadcastDelay: {
            reducer(state, action) {
                const { tabId, delaySec } = action.payload
                state.mainBroadcastDelayByTabId[tabId] = delaySec
            },
            prepare(tabId, delaySec) {
                return { payload: { tabId, delaySec }}
            }
        }
    }
})

const selectCurrentStreamsInfo = state => {
    if (state.content.currentTabId in state.content.addedStreamsByTabId) {
        const currentStreamsInfo = {}
        const streamerIds = state.content.addedStreamsByTabId[state.content.currentTabId]
        for (const streamerId of streamerIds) {
            const initPos = streamerId in state.content.streamLastPositions ?
                state.content.streamLastPositions[streamerId] :
                initStreamPosition()
            const initSize = streamerId in state.content.streamLastSizes ?
                state.content.streamLastSizes[streamerId] :
                initStreamSize()
            currentStreamsInfo[streamerId] = {
                initPos: initPos,
                initSize: initSize
            }
        }
        return currentStreamsInfo
    } else {
        return {}
    }
}

const selectCurrentChatFrameInfo = state => {
    const tabId = state.content.currentTabId
    if (tabId in state.content.addedChatsByTabId) {
        const streamerIds = state.content.addedChatsByTabId[tabId]
        const initPos = state.content.chatFrameLastPosition
        const initSize = state.content.chatFrameLastSize
        return {
            streamerIds: streamerIds,
            initPos: initPos,
            initSize: initSize
        }
    } else {
        return {
            streamerIds: [],
            initPos: initChatFramePosition(),
            initSize: initChatFrameSize()
        }
    }
}

const selectCurrentChatIdx = state => {
    const tabId = state.content.currentTabId
    if (tabId in state.content.currentChatIdxByTabId) {
        return state.content.currentChatIdxByTabId[tabId]
    } else {
        return -1
    }
}

const selectShowChatFrame = state => {
    if (state.content.currentTabId in state.content.addedChatsByTabId &&
        state.content.addedChatsByTabId[state.content.currentTabId].length > 0) {
        return true
    } else {
        return false
    }
}

const selectCurrentTabId = state => state.content.currentTabId

const selectCurrentHost = state => {
    const currentTabId = state.content.currentTabId
    const activeUrlsByTabId = state.content.activeUrlsByTabId
    if (currentTabId in activeUrlsByTabId) {
        const currentUrl = activeUrlsByTabId[currentTabId]
        if (currentUrl.match("twitch.tv")) {
            return "twitch.tv"
        } else {
            return ""
        }
    } else {
        return ""
    }
}

const selectCurrentMainBroadcastDelay = state => {
    const currentTabId = state.content.currentTabId
    const mainBroadcastDelayByTabId = state.content.mainBroadcastDelayByTabId
    if (currentTabId in mainBroadcastDelayByTabId) {
        return mainBroadcastDelayByTabId[currentTabId]
    } else {
        return 0
    }
}

export const {
    addStream,
    addChat,
    removeStream,
    removeChat,
    selectChat,
    removeChatFrame,
    removeTabRelatedState,
    changeCurrentTab,
    updateStreamLastPosition,
    updateStreamLastSize,
    updateChatFrameLastPosition,
    updateChatFrameLastSize,
    updateMainBroadcastDelay
} = contentSlice.actions

export {
    selectCurrentStreamsInfo,
    selectCurrentChatFrameInfo,
    selectCurrentChatIdx,
    selectShowChatFrame,
    selectCurrentTabId,
    selectCurrentHost,
    selectCurrentMainBroadcastDelay
}

export default contentSlice.reducer