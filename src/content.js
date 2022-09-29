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
import { createDivWithId, findContentRoot, registerObserver, toggleTimePanelVisibility } from './contentUtils'

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

    const render = () => {
        const videos = document.getElementsByTagName("video")
        if (videos.length === 0) {
            return
        }
        const videoRoot = videos[0].parentElement
        let streamInnerEmbedRoot = document.getElementById(STREAM_INNER_EMBED_ROOT)
        if (streamInnerEmbedRoot === null) {
            streamInnerEmbedRoot = createDivWithId(STREAM_INNER_EMBED_ROOT)
            videoRoot.appendChild(streamInnerEmbedRoot)
        }
        let streamOuterEmbedRoot = document.getElementById(STREAM_OUTER_EMBED_ROOT)
        if (streamOuterEmbedRoot === null) {
            streamOuterEmbedRoot = createDivWithId(STREAM_OUTER_EMBED_ROOT)
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
            chatEmbedRoot = createDivWithId(CHAT_EMBED_ROOT)
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
    }

    const signalListener = store => (request, sender, sendResponse) => {
        if (request.signal === ForegroundSignals.DELAY) {
            const video = document.querySelector("video")
            if (!video) {
                return
            }
            video.currentTime -= request.interval
        } else if (request.signal === ForegroundSignals.GOTO) {
            window.location.href = request.url
        }
        return true
    }

    const keyDownEventListener = store => event => {
        if (store.state.content.isVodMoveTimeTogether) {
            switch (event.keyCode) {
                case 37:
                    postMessageToAllStreams(ForegroundSignals.MOVE_BACK)
                    break
                case 39:
                    postMessageToAllStreams(ForegroundSignals.MOVE_FORWARD)
                    break
                default:
                    break
            }
        }
    }

    store.subscribe(render)
    chrome.runtime.onMessage.addListener(signalListener(store))
    if (document.documentURI.match(VOD_PATTERN)) {
        registerObserver('main', toggleTimePanelVisibility(store))
        store.subscribe(toggleTimePanelVisibility(store))
        document.onkeydown = keyDownEventListener(store)
    }
})()