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

const STREAM_INNER_IMBED_ROOT = "stream-embed-root";
const STREAM_OUTER_EMBED_ROOT = "stream-outer-embed-root";
const CHAT_EMBED_ROOT = "chat-embed-root";

function findContentRoot(body, videoRoot) {
    for (let child of body.children) {
        if (child.contains(videoRoot)) {
            return child
        }
    }
    return null
};

const signalListener = store => (request, sender, sendResponse) => {
    if (request.signal === ForegroundSignals.RENDER) {
        const videos = document.getElementsByTagName("video")
        if (videos.length === 0) {
            return
        }
        const videoRoot = videos[0].parentElement
        let streamInnerEmbedRoot = document.getElementById(STREAM_INNER_IMBED_ROOT)
        if (streamInnerEmbedRoot === null) {
            streamInnerEmbedRoot = document.createElement("div")
            streamInnerEmbedRoot.setAttribute("id", STREAM_INNER_IMBED_ROOT)
            videoRoot.appendChild(streamInnerEmbedRoot)
        }
        let streamOuterEmbedRoot = document.getElementById(STREAM_OUTER_EMBED_ROOT)
        if (streamOuterEmbedRoot === null) {
            streamOuterEmbedRoot = document.createElement("div")
            streamOuterEmbedRoot.setAttribute("id", STREAM_OUTER_EMBED_ROOT)
            streamOuterEmbedRoot.setAttribute("style", "z-index: 99999")
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
            chatEmbedRoot = document.createElement("div")
            chatEmbedRoot.setAttribute("id", CHAT_EMBED_ROOT)
            chatEmbedRoot.setAttribute("style", "z-index: 99998")
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
    } else if (request.signal === ForegroundSignals.DELAY) {
        const videos = document.getElementsByTagName("video")
        if (videos.length === 0) {
            return
        }
        const video = videos[0]
        video.currentTime -= request.interval
    } else if (request.signal === ForegroundSignals.GOTO) {
        window.location.href = request.url
    }
    return true
}

const keyDownEventListener = event => {
    const streamIframes = document.querySelectorAll('[id^="' + STREAM_ID_PREFIX + '"]')
    switch (event.keyCode) {
        case 37:
            streamIframes.forEach(iframe => iframe.contentWindow.postMessage(ForegroundSignals.MOVE_BACK, "*"))
            break
        case 39:
            streamIframes.forEach(iframe => iframe.contentWindow.postMessage(ForegroundSignals.MOVE_FORWARD, "*"))
            break
        default:
            break
     }
}

(async () => {
    const store = await storeCreatorFactory({ createStore })(rootReducer)
    chrome.runtime.onMessage.addListener(signalListener(store))
    document.onkeydown = keyDownEventListener
})()