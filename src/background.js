import { createStore } from 'redux'
import storeCreatorFactory from 'reduxed-chrome-storage'
import rootReducer from './store/rootReducer'
import { addStream, addChat, removeStream, removeChat, selectChat,
removeChatFrame, removeTabRelatedState, changeCurrentTab, updateStreamLastPosition,
updateStreamLastSize, updateChatFrameLastPosition, updateChatFrameLastSize,
updateMainBroadcastDelay, toggleDarkMode, updateStreamInitPosition,
updateStreamInitSize, updateChatFrameInitPosition, updateChatFrameInitSize,
resetContentState, changeStreamLayer } from './store/contentSlice'
import { addToFavorites, removeFromFavorites, resetFavoriteState } from './store/favoriteSlice'
import { ForegroundSignals, BackgroundSignals } from './common/signals'
import { STREAM_ID_PREFIX, CHAT_ID_PREFIX } from './common/constants'

const OVERLAY_COLOR = { r: 155, g: 11, b: 239, a: 0.7 }
const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay))

// extension only active in Twitch
chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
        {
            conditions: [
            new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { urlMatches: 'twitch.tv/.+' },
            })
            ],
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
    chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
        store.dispatch(removeTabRelatedState(tabId))
    })

    // remove tab related state when updated
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        const activeUrlsByTabId = store.getState().content.activeUrlsByTabId
        if (changeInfo.url && tabId in activeUrlsByTabId && activeUrlsByTabId[tabId] !== changeInfo.url) {
            store.dispatch(removeTabRelatedState(tabId))    
        }
    })

    // change current tab state when changed
    chrome.tabs.onActivated.addListener(activeInfo => {
        store.dispatch(changeCurrentTab(activeInfo.tabId))
    })

    // re-render widgets when mainframe change is just refresh, otherwise 
    // remove remove tab related state and renew active url
    chrome.webNavigation.onCompleted.addListener(({ parentFrameId, tabId, url }) => {
        if (parentFrameId === -1) {
            const activeUrlsByTabId = store.getState().content.activeUrlsByTabId
            if (tabId in activeUrlsByTabId) {
                if (activeUrlsByTabId[tabId] === url) {
                    // refresh doesn't change the state, thus not caught by store subscription
                    // therefore we have to manually re-render the content
                    chrome.tabs.sendMessage(tabId, {signal: ForegroundSignals.RENDER})
                    // reset main broadcast delay
                    store.dispatch(updateMainBroadcastDelay(tabId, 0))
                } else {
                    store.dispatch(removeTabRelatedState(tabId))
                }
            } else {
                store.dispatch(removeTabRelatedState(tabId))
            }
        }
    })

    // clear tab related state when window closed
    chrome.windows.onRemoved.addListener(windowId => {
        chrome.tabs.query({ windowId: windowId }, tabs => {
            for (let tab of tabs) {
                store.dispatch(removeTabRelatedState(tab.id))
            }
        })
    })

    // on runtime message
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.signal === BackgroundSignals.ADD_STREAM) {
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                store.dispatch(addStream(tabs[0].id, request.streamerId, tabs[0].url))
            })
        } else if (request.signal === BackgroundSignals.REMOVE_STREAM) {
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                store.dispatch(removeStream(tabs[0].id, request.streamerId))
            })
        } else if (request.signal === BackgroundSignals.ADD_CHAT) {
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                store.dispatch(addChat(tabs[0].id, request.streamerId, tabs[0].url))
            })
        } else if (request.signal === BackgroundSignals.REMOVE_CHAT) {
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                store.dispatch(removeChat(tabs[0].id, request.streamerId))
            })
        } else if (request.signal === BackgroundSignals.SELECT_CHAT) {
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                store.dispatch(selectChat(tabs[0].id, request.idx))
            })
        } else if (request.signal === BackgroundSignals.REMOVE_CHAT_FRAME) {
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                store.dispatch(removeChatFrame(tabs[0].id))
            })
        } else if (request.signal === BackgroundSignals.ADD_TO_FAVORITES) {
            store.dispatch(addToFavorites(request.streamerId))
        } else if (request.signal === BackgroundSignals.REMOVE_FROM_FAVORITES) {
            store.dispatch(removeFromFavorites(request.streamerId))
        } else if (request.signal === BackgroundSignals.UPDATE_STREAM_LAST_POS) {
            store.dispatch(updateStreamLastPosition(request.streamerId, request.pos))
        } else if (request.signal === BackgroundSignals.UPDATE_STREAM_LAST_SIZE) {
            store.dispatch(updateStreamLastSize(request.streamerId, request.size))
        } else if (request.signal === BackgroundSignals.UPDATE_CHAT_FRAME_LAST_POS) {
            store.dispatch(updateChatFrameLastPosition(request.pos))
        } else if (request.signal === BackgroundSignals.UPDATE_CHAT_FRAME_LAST_SIZE) {
            store.dispatch(updateChatFrameLastSize(request.size))
        } else if (request.signal === BackgroundSignals.UPDATE_DELAY) {
            store.dispatch(updateMainBroadcastDelay(request.tabId, request.delaySec))
        } else if (request.signal === BackgroundSignals.TOGGLE_DARK_MODE) {
            store.dispatch(toggleDarkMode())
        } else if (request.signal === BackgroundSignals.SHOW_CONTENT_OVERLAY) {
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                const tabId = tabs.length === 0 ? null : tabs[0].id
                showContentOverlay(tabId, request.addedStreams, request.addedChats)
            })
        } else if (request.signal === BackgroundSignals.UPDATE_STREAM_INIT_POS) {
            store.dispatch(updateStreamInitPosition(request.newPos))
        } else if (request.signal === BackgroundSignals.UPDATE_STREAM_INIT_SIZE) {
            store.dispatch(updateStreamInitSize(request.newSize))
        } else if (request.signal === BackgroundSignals.UPDATE_CHAT_FRAME_INIT_POS) {
            store.dispatch(updateChatFrameInitPosition(request.newPos))
        } else if (request.signal === BackgroundSignals.UPDATE_CHAT_FRAME_INIT_SIZE) {
            store.dispatch(updateChatFrameInitSize(request.newSize))
        } else if (request.signal === BackgroundSignals.RESET_CONTENT_STATE) {
            store.dispatch(resetContentState())
        } else if (request.signal === BackgroundSignals.RESET_FAVORITE_STATE) {
            store.dispatch(resetFavoriteState())
        } else if (request.signal === BackgroundSignals.CHANGE_STREAM_LAYER_TO_INNER) {
            store.dispatch(changeStreamLayer("inner"))
        } else if (request.signal === BackgroundSignals.CHANGE_STREAM_LAYER_TO_OUTER) {
            store.dispatch(changeStreamLayer("outer"))
        }
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, {signal: ForegroundSignals.RENDER})
        })
    })
})()