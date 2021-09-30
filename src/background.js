import { createStore } from 'redux'
import storeCreatorFactory from 'reduxed-chrome-storage'
import rootReducer from './store/rootReducer'
import { addStream, addChat, removeStream, removeChat, selectChat,
removeChatFrame, removeTabRelatedState, changeCurrentTab, updateStreamLastPosition,
updateStreamLastSize, updateChatFrameLastPosition, updateChatFrameLastSize,
updateMainBroadcastDelay } from './store/contentSlice'
import { addToFavorites, removeFromFavorites } from './store/favoriteSlice'
import { ForegroundSignals, BackgroundSignals } from './common/signals'

(async () => {
    const store = await storeCreatorFactory({ createStore })(rootReducer)

    // extension only active in Youtube or Twitch
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
    })

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

    // on runtime message that needs re-render
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
        }
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, {signal: ForegroundSignals.RENDER})
        })
    })

    // on runtime message that needs no re-render
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.signal === BackgroundSignals.UPDATE_STREAM_LAST_POS) {
            store.dispatch(updateStreamLastPosition(request.streamerId, request.pos))
        } else if (request.signal === BackgroundSignals.UPDATE_STREAM_LAST_SIZE) {
            store.dispatch(updateStreamLastSize(request.streamerId, request.size))
        } else if (request.signal === BackgroundSignals.UPDATE_CHAT_FRAME_LAST_POS) {
            store.dispatch(updateChatFrameLastPosition(request.pos))
        } else if (request.signal === BackgroundSignals.UPDATE_CHAT_FRAME_LAST_SIZE) {
            store.dispatch(updateChatFrameLastSize(request.size))
        } else if (request.signal === BackgroundSignals.UPDATE_DELAY) {
            store.dispatch(updateMainBroadcastDelay(request.tabId, request.delaySec))
        }
    })
})()