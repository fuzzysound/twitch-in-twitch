import rootReducer from './store/rootReducer'
import { createStore } from 'redux'
import storeCreatorFactory from 'reduxed-chrome-storage'
import { ForegroundSignals } from "./common/signals"
import { registerObserver, toggleTimePanelVisibility } from './contentUtils'

const MOVE_UNIT_SEC = 10;
const VOD_PATTERN = new RegExp("video=\\d+$");

(async () => {
    const store = await storeCreatorFactory({ createStore })(rootReducer)

    const messageListener = event => {
        if (event.data === ForegroundSignals.REFRESH) {
            window.location.reload(true)
        }
    }

    const vodMessageListener = event => {
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

    if (document.domain.includes("player.twitch.tv")) {
        window.addEventListener("message", messageListener)
        if (document.documentURI.match(VOD_PATTERN)) {
            registerObserver('#root', toggleTimePanelVisibility(store))
            store.subscribe(toggleTimePanelVisibility(store))
            window.addEventListener("message", vodMessageListener)
        }
    }
})()