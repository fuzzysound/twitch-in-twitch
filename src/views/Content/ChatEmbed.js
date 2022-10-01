import { TWITCH } from '../../common/allowedHosts'
import { CHAT_ID_PREFIX } from '../../common/constants'

function ChatEmbed({
    channel = "",
    parent = TWITCH,
    isDarkMode = false,
    height = '100%',
    width = '100%',
}) {
    return (
        <iframe
        id={CHAT_ID_PREFIX + channel}
        title={channel}
        src={"https://www.twitch.tv/embed/" + channel + "/chat?" + (isDarkMode ? "darkpopout&" : "") + "parent=" + parent + "&migration=true"}
        height={height}
        width={width}
        frameBorder="0" />
    )
}

export default ChatEmbed