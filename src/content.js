import React from 'react'
import ReactDOM from 'react-dom'
import rootReducer from './store/rootReducer'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import storeCreatorFactory from 'reduxed-chrome-storage'
import StreamList from './views/Content/StreamList'
import ChatFrameWrapper from './views/Content/ChatFrameWrapper'
import { ForegroundSignals } from './common/signals'

const STREAM_EMBED_ROOT = "stream-embed-root";
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
        let streamEmbedRoot = document.getElementById(STREAM_EMBED_ROOT)
        if (streamEmbedRoot === null) {
            streamEmbedRoot = document.createElement("div")
            streamEmbedRoot.setAttribute("id", STREAM_EMBED_ROOT)
            videoRoot.appendChild(streamEmbedRoot)
        }
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
            chatEmbedRoot.setAttribute("style", "z-index: 99999")
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
    }
    return true
}

(async () => {
    const store = await storeCreatorFactory({ createStore })(rootReducer)
    chrome.runtime.onMessage.addListener(signalListener(store))
})()