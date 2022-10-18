import rootReducer from './store/rootReducer'
import { createStore } from 'redux'
import storeCreatorFactory from 'reduxed-chrome-storage'
import { ForegroundSignals } from "./common/signals"
import { moveVideoTime, registerObserver, toggleTimePanelVisibility } from './contentUtils'

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
            if (event.data === ForegroundSignals.MOVE_FORWARD) {
                moveVideoTime(store.state.content.timeMoveUnit)
            } else if (event.data === ForegroundSignals.MOVE_BACK) {
                moveVideoTime(-1 * store.state.content.timeMoveUnit)
            }
        }
    }

    const keyDownEventListener = store => event => {
        switch (event.keyCode) {
            case 37:
                event.stopImmediatePropagation()
                if (store.state.content.isVodMoveTimeTogether) {
                    moveVideoTime(0)
                    window.parent.postMessage(ForegroundSignals.MOVE_BACK, "*")
                } else {
                    moveVideoTime(-1 * store.state.content.timeMoveUnit)
                }
                break
            case 39:
                event.stopImmediatePropagation()
                if (store.state.content.isVodMoveTimeTogether) {
                    moveVideoTime(0)
                    window.parent.postMessage(ForegroundSignals.MOVE_FORWARD, "*")
                } else {
                    moveVideoTime(store.state.content.timeMoveUnit)
                }
                break
            default:
                break
        }
    }

    if (document.domain.includes("player.twitch.tv")) {
        window.addEventListener("message", messageListener)
        if (document.documentURI.match(VOD_PATTERN)) {
            registerObserver('#root', toggleTimePanelVisibility(store))
            store.subscribe(toggleTimePanelVisibility(store))
            window.addEventListener("message", vodMessageListener)
            window.addEventListener("keydown", keyDownEventListener(store), true)
        }
    }
})()