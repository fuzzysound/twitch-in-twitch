export const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
}

export const initStreamPosition = () => { 
    return {
        x: 200 + getRandomInt(-10, 10),
        y: 200 + getRandomInt(-10, 10)
    }
}

export const initStreamSize = () => {
    return {
        width: 480,
        height: 297
    }
}

export const initChatFramePosition = () => {
    return {
        x: 400,
        y: 200
    }
}

export const initChatFrameSize = () => {
    return {
        width: 340,
        height: 720
    }
}

/*
 * Toggles enable/disable pointer events on iframe
 * The pointer events are disabled on iframe by default, which makes dragging or resizing
 * other iframe very irritating. Thus we should enable pointer events on iframe when starting
 * dragging or resizing of an iframe, and disable it when the job's done.
*/
const toggleIframePointerEvents = (disable = false) => {
    [...document.getElementsByTagName('iframe')].forEach((iframe) => {
      // eslint-disable-next-line no-param-reassign
      iframe.style.pointerEvents = disable ? 'none' : 'auto';
    });
}

export const onDragStartHandler = () => {
    toggleIframePointerEvents(true);
}

export const onDragStopHandler = (newPos, setPos, callback) => {
    setPos(newPos)
    toggleIframePointerEvents(false);
    callback()
}

export const onResizeStartHandler = () => {
    toggleIframePointerEvents(true);
}

export const onResizeStopHandler = (newPos, setPos, newSize, setSize, callback) => {
    setPos(newPos)
    setSize(newSize)
    toggleIframePointerEvents(false);
    callback()
}

export const getVodUrl = vodId => {
    return "https://www.twitch.tv/videos/" + vodId
}