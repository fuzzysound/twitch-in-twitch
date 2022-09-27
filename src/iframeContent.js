import { ForegroundSignals } from "./common/signals"

const MOVE_UNIT_SEC = 10
const VOD_PATTERN = new RegExp("video=\\d+$")

const messageListener = event => {
    if (event.data === ForegroundSignals.REFRESH) {
        window.location.reload(true)
    }
}

const videoMoveMessageListener = event => {
    if (event.data === ForegroundSignals.MOVE_FORWARD || event.data === ForegroundSignals.MOVE_BACK) {
        const theVideo = document.getElementsByTagName("video")[0]
        if (theVideo) {
            if (event.data === ForegroundSignals.MOVE_FORWARD) {
                theVideo.currentTime += MOVE_UNIT_SEC
            } else if (event.data === ForegroundSignals.MOVE_BACK) {
                theVideo.currentTime -= MOVE_UNIT_SEC
            }
        }
    }
}

(async () => {
    if (document.domain.includes("player.twitch.tv")) {
        window.addEventListener("message", messageListener)
        if (document.documentURI.match(VOD_PATTERN)) {
            window.addEventListener("message", videoMoveMessageListener)
        }
    }
})()