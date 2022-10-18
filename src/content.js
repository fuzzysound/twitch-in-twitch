import React from 'react'
import ReactDOM from 'react-dom'
import rootReducer from './store/rootReducer'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import storeCreatorFactory from 'reduxed-chrome-storage'
import StreamList from './views/Content/StreamList'
import ChatFrameWrapper from './views/Content/ChatFrameWrapper'
import { ForegroundSignals } from './common/signals'
import { STREAM_ID_PREFIX } from './common/constants'
import { createEmbedRootWithId, findContentRoot, moveVideoTime, registerObserver, toggleTimePanelVisibility } from './contentUtils'

const STREAM_INNER_EMBED_ROOT = "stream-embed-root";
const STREAM_OUTER_EMBED_ROOT = "stream-outer-embed-root";
const CHAT_EMBED_ROOT = "chat-embed-root";
const VOD_PATTERN = new RegExp("videos/\\d+$");

(async () => {
    const store = await storeCreatorFactory({ createStore })(rootReducer)

    function postMessageToAllStreams(message) {
        const streamIframes = document.querySelectorAll('[id^="' + STREAM_ID_PREFIX + '"]')
        streamIframes.forEach(iframe => iframe.contentWindow.postMessage(message, "*"))
    }

    function moveBackVideoTime() {
        moveVideoTime(-1 * store.state.content.timeMoveUnit)
        if (store.state.content.isVodMoveTimeTogether) {
            postMessageToAllStreams(ForegroundSignals.MOVE_BACK)
        }
    }

    function moveForwardVideoTime() {
        moveVideoTime(store.state.content.timeMoveUnit)
        if (store.state.content.isVodMoveTimeTogether) {
            postMessageToAllStreams(ForegroundSignals.MOVE_FORWARD)
        }
    }

    const render = () => {
        const video = document.querySelector("video")
        if (!video) {
            return
        }
        const videoRoot = video.parentElement
        let streamInnerEmbedRoot = document.getElementById(STREAM_INNER_EMBED_ROOT)
        if (streamInnerEmbedRoot === null) {
            streamInnerEmbedRoot = createEmbedRootWithId(STREAM_INNER_EMBED_ROOT)
            videoRoot.appendChild(streamInnerEmbedRoot)
        }
        let streamOuterEmbedRoot = document.getElementById(STREAM_OUTER_EMBED_ROOT)
        if (streamOuterEmbedRoot === null) {
            streamOuterEmbedRoot = createEmbedRootWithId(STREAM_OUTER_EMBED_ROOT)
            const contentRoot = findContentRoot(document.body, videoRoot)
            if (contentRoot !== null) {
                contentRoot.appendChild(streamOuterEmbedRoot)
            }
        }
        const isStreamOnOuterLayer = store.state.content.isStreamOnOuterLayer
        const streamEmbedRoot = (isStreamOnOuterLayer) ? streamOuterEmbedRoot : streamInnerEmbedRoot
        const streamEmbedRootToRemove = (isStreamOnOuterLayer) ? streamInnerEmbedRoot : streamOuterEmbedRoot
        streamEmbedRootToRemove.parentElement.removeChild(streamEmbedRootToRemove)
        ReactDOM.render(
            <Provider store={store}>
                <StreamList />
            </Provider>,
            streamEmbedRoot
        )
        let chatEmbedRoot = document.getElementById(CHAT_EMBED_ROOT)
        if (chatEmbedRoot === null) {
            chatEmbedRoot = createEmbedRootWithId(CHAT_EMBED_ROOT)
            const contentRoot = findContentRoot(document.body, videoRoot)
            if (contentRoot !== null) {
                contentRoot.appendChild(chatEmbedRoot)
            }
        }
        ReactDOM.render(
            <Provider store={store}>
                <ChatFrameWrapper />   
            </Provider>,
            chatEmbedRoot
        )
    }

    const signalListener = store => (request, sender, sendResponse) => {
        if (request.signal === ForegroundSignals.DELAY) {
            const video = document.querySelector("video")
            if (!video) {
                return
            }
            video.currentTime -= request.interval
        }
        return true
    }

    const messageListener = event => {
        if (event.data === ForegroundSignals.MOVE_BACK) {
            moveBackVideoTime()
        } else if (event.data === ForegroundSignals.MOVE_FORWARD) {
            moveForwardVideoTime()
        }
    }

    const keyDownEventListener = store => event => {
        switch (event.keyCode) {
            case 37:
                event.stopImmediatePropagation()
                moveBackVideoTime()
                break
            case 39:
                event.stopImmediatePropagation()
                moveForwardVideoTime()
                break
            default:
                break
        }
    }

    store.subscribe(render)
    chrome.runtime.onMessage.addListener(signalListener(store))
    if (document.documentURI.match(VOD_PATTERN)) {
        registerObserver('main', toggleTimePanelVisibility(store))
        store.subscribe(toggleTimePanelVisibility(store))
        window.addEventListener("message", messageListener)
        window.addEventListener("keydown", keyDownEventListener(store), true)
    }
})()