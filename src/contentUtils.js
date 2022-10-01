import { TIME_PANEL_SELECTOR } from "./common/constants";
import { sleep } from "./common/utils";

export const findContentRoot = (body, videoRoot) => {
    for (let child of body.children) {
        if (child.contains(videoRoot)) {
            return child
        }
    }
    return null
}

export const createEmbedRootWithId = id => {
    const div = document.createElement("div")
    div.setAttribute("id", id)
    div.setAttribute("style", "position: absolute; top: 0px; left: 0px;")
    return div
}

export const registerObserver = async (selector, callback) => {
    let element;
    for (let i=0; i < 100; i++) {
        element = document.querySelector(selector)
        if (!element) {
            await sleep(10)
        } else {
            const observer = new MutationObserver(callback)
            observer.observe(element, { childList: true, subtree: true })
            break
        }
    }
}

export const toggleTimePanelVisibility = store => () => {
    const video = document.querySelector("video")
    if (!video) {
        return
    }
    const videoRoot = video.parentElement
    const timePanel = videoRoot.querySelector(TIME_PANEL_SELECTOR)
    if (store.state.content.isVodSpoilerFree) {
        timePanel.style.visibility = "hidden"
    } else {
        timePanel.style.visibility = "visible"
    }
}
