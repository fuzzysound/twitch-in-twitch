import { createStore } from 'redux'
import storeCreatorFactory from 'reduxed-chrome-storage'
import rootReducer from './store/rootReducer'
import { addStream, addChat, removeStream, removeChat, selectChat,
removeChatFrame, removeTabRelatedState, changeCurrentTab, updateStreamLastPosition,
updateStreamLastSize, updateChatFrameLastPosition, updateChatFrameLastSize,
updateMainBroadcastDelay, toggleDarkMode, updateStreamInitPosition,
updateStreamInitSize, updateChatFrameInitPosition, updateChatFrameInitSize,
resetContentState, changeStreamLayer, toggleVodMoveTimeTogether, toggleVodSpoilerFree, render, changeTimeMoveUnit, resetPositionAndSize } from './store/contentSlice'
import { addToFavorites, removeFromFavorites, resetFavoriteState } from './store/favoriteSlice'
import { BackgroundSignals } from './common/signals'
import { STREAM_ID_PREFIX, CHAT_ID_PREFIX } from './common/constants'
import { ALLOWED_HOSTS } from './common/allowedHosts'

const OVERLAY_COLOR = { r: 155, g: 11, b: 239, a: 0.7 }
const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay))

// extension only active in Twitch
chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
        {
            conditions: ALLOWED_HOSTS.map(host => {
                return new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { urlMatches: `${host}/.*` },
                })
            }),
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }
        ])
    })
});

// promifisy chrome.debugger.attach
function attach(target, requiredVersion) {
    return new Promise(resolve => {
        chrome.debugger.attach(target, requiredVersion, () => resolve())
    })
}

// promifisy chrome.debugger.detach
function detach(target) {
    return new Promise(resolve => {
        chrome.debugger.detach(target, () => resolve())
    })
}

// promifisy chrome.debugger.sendCommand
function sendCommand(target, method, commandParams) {
    return new Promise(resolve => {
        chrome.debugger.sendCommand(target, method, commandParams, result => resolve(result))
    })
}

// show overlays of added contents using Chrome devtools protocol
async function showContentOverlay(tabId, addedStreams, addedChats) {
    if (!tabId) {
        alert(chrome.i18n.getMessage("please_refresh"))
        return
    }
    if (addedStreams.length === 0 && addedChats.length === 0) {
        alert(chrome.i18n.getMessage("no_content"))
        return
    }
    const debugee = { tabId: tabId }
    await attach(debugee, "1.3")
    try {
        await sendCommand(debugee, "DOM.enable")
        await sendCommand(debugee, "DOM.getDocument")
        await sendCommand(debugee, "Overlay.enable")

        const elementIds = []
        for (let streamerId of addedStreams) {
            elementIds.push(STREAM_ID_PREFIX + streamerId)
        }
        for (let streamerId of addedChats) {
            elementIds.push(CHAT_ID_PREFIX + streamerId)
        }

        const nodeIds = []
        for (let elementId of elementIds) {
            const expression = "document.getElementById('" + elementId + "')"
            const evalResult = await sendCommand(debugee, "Runtime.evaluate", { expression: expression })
            if (evalResult === null) {
                alert(chrome.i18n.getMessage("still_loading"))
                return
            }
            const remoteObject = evalResult.result
            const node = await sendCommand(debugee, "DOM.requestNode", { objectId: remoteObject.objectId })
            nodeIds.push(node.nodeId)
        }

        for (let nodeId of nodeIds) {
            const params = {
                highlightConfig: { contentColor: OVERLAY_COLOR },
                nodeId: nodeId
            }
            await sendCommand(debugee, "DOM.highlightNode", params)
            await wait(500)
        }
        await sendCommand(debugee, "DOM.hideHighlight")
    }
    finally {
        await detach(debugee)
    }
}

(async () => {
    const store = await storeCreatorFactory({ createStore })(rootReducer)

    // remove tab related state when removed
    chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
        await store.dispatch(removeTabRelatedState(tabId))
    })

    // remove tab related state when updated
    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        const activeUrlsByTabId = store.getState().content.activeUrlsByTabId
        if (changeInfo.url && tabId in activeUrlsByTabId && activeUrlsByTabId[tabId] !== changeInfo.url) {
            await store.dispatch(removeTabRelatedState(tabId))    
        }
    })

    // change current tab state when changed
    chrome.tabs.onActivated.addListener(async (activeInfo) => {
        await store.dispatch(changeCurrentTab(activeInfo.tabId))
    })

    // re-render widgets when mainframe change is just refresh, otherwise 
    // remove remove tab related state and renew active url
    chrome.webNavigation.onCompleted.addListener(async ({ parentFrameId, tabId, url }) => {
        if (parentFrameId === -1) {
            const activeUrlsByTabId = store.getState().content.activeUrlsByTabId
            if (tabId in activeUrlsByTabId) {
                if (activeUrlsByTabId[tabId] === url) {
                    // refresh doesn't change the state, thus not caught by store subscription
                    // therefore we have to manually re-render the content
                    await store.dispatch(render())
                    // reset main broadcast delay
                    await store.dispatch(updateMainBroadcastDelay(tabId, 0))
                } else {
                    await store.dispatch(removeTabRelatedState(tabId))
                }
            } else {
                await store.dispatch(removeTabRelatedState(tabId))
            }
        }
    })

    // clear tab related state when window closed
    chrome.windows.onRemoved.addListener(async (windowId) => {
        const tabs = await chrome.tabs.query({ windowId: windowId })
        for (let tab of tabs) {
            await store.dispatch(removeTabRelatedState(tab.id))
        }
    })

    // on runtime message
    chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
        if (request.signal === BackgroundSignals.ADD_STREAM) {
            await store.dispatch(addStream(tabs[0].id, request.streamerId, tabs[0].url))
        } else if (request.signal === BackgroundSignals.REMOVE_STREAM) {
            await store.dispatch(removeStream(tabs[0].id, request.streamerId))
        } else if (request.signal === BackgroundSignals.ADD_CHAT) {
            await store.dispatch(addChat(tabs[0].id, request.streamerId, tabs[0].url))
        } else if (request.signal === BackgroundSignals.REMOVE_CHAT) {
            await store.dispatch(removeChat(tabs[0].id, request.streamerId))
        } else if (request.signal === BackgroundSignals.SELECT_CHAT) {
            await store.dispatch(selectChat(tabs[0].id, request.idx))
        } else if (request.signal === BackgroundSignals.REMOVE_CHAT_FRAME) {
            await store.dispatch(removeChatFrame(tabs[0].id))
        } else if (request.signal === BackgroundSignals.ADD_TO_FAVORITES) {
            await store.dispatch(addToFavorites(request.streamerId))
        } else if (request.signal === BackgroundSignals.REMOVE_FROM_FAVORITES) {
            await store.dispatch(removeFromFavorites(request.streamerId))
        } else if (request.signal === BackgroundSignals.UPDATE_STREAM_LAST_POS) {
            await store.dispatch(updateStreamLastPosition(request.streamerId, request.pos))
        } else if (request.signal === BackgroundSignals.UPDATE_STREAM_LAST_SIZE) {
            await store.dispatch(updateStreamLastSize(request.streamerId, request.size))
        } else if (request.signal === BackgroundSignals.UPDATE_CHAT_FRAME_LAST_POS) {
            await store.dispatch(updateChatFrameLastPosition(request.pos))
        } else if (request.signal === BackgroundSignals.UPDATE_CHAT_FRAME_LAST_SIZE) {
            await store.dispatch(updateChatFrameLastSize(request.size))
        } else if (request.signal === BackgroundSignals.UPDATE_DELAY) {
            await store.dispatch(updateMainBroadcastDelay(request.tabId, request.delaySec))
        } else if (request.signal === BackgroundSignals.TOGGLE_DARK_MODE) {
            await store.dispatch(toggleDarkMode())
        } else if (request.signal === BackgroundSignals.TOGGLE_VOD_MOVE_TIME_TOGETHER) {
            await store.dispatch(toggleVodMoveTimeTogether())
        } else if (request.signal === BackgroundSignals.TOGGLE_VOD_SPOILER_FREE) {
            await store.dispatch(toggleVodSpoilerFree())
        } else if (request.signal === BackgroundSignals.SHOW_CONTENT_OVERLAY) {
            showContentOverlay(tabs[0]?.id, request.addedStreams, request.addedChats)
        } else if (request.signal === BackgroundSignals.UPDATE_STREAM_INIT_POS) {
            await store.dispatch(updateStreamInitPosition(request.newPos))
        } else if (request.signal === BackgroundSignals.UPDATE_STREAM_INIT_SIZE) {
            await store.dispatch(updateStreamInitSize(request.newSize))
        } else if (request.signal === BackgroundSignals.UPDATE_CHAT_FRAME_INIT_POS) {
            await store.dispatch(updateChatFrameInitPosition(request.newPos))
        } else if (request.signal === BackgroundSignals.UPDATE_CHAT_FRAME_INIT_SIZE) {
            await store.dispatch(updateChatFrameInitSize(request.newSize))
        } else if (request.signal === BackgroundSignals.RESET_CONTENT_STATE) {
            await store.dispatch(resetContentState())
        } else if (request.signal === BackgroundSignals.RESET_FAVORITE_STATE) {
            await store.dispatch(resetFavoriteState())
        } else if (request.signal === BackgroundSignals.CHANGE_STREAM_LAYER_TO_INNER) {
            await store.dispatch(changeStreamLayer("inner"))
        } else if (request.signal === BackgroundSignals.CHANGE_STREAM_LAYER_TO_OUTER) {
            await store.dispatch(changeStreamLayer("outer"))
        } else if (request.signal === BackgroundSignals.CHANGE_TIME_MOVE_UNIT) {
            await store.dispatch(changeTimeMoveUnit(request.timeMoveUnit))
        } else if (request.signal === BackgroundSignals.RESET_POSITION_AND_SIZE) {
            await store.dispatch(resetPositionAndSize())
        }
        await store.dispatch(render())
    })
})()