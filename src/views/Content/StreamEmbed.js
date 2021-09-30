import { STREAM_ID_PREFIX } from '../../common/constants'
function StreamEmbed({
    id = "",
    parent = "twitch.tv",
    allowFullScreen = true,
    height = '100%',
    width = '100%',
    muted = false,
}) {
    // if streamer id only consists of numbers, recognize it as VOD id.
    const target = id.match('^[0-9]+$') ? "video" : "channel"

    return (
        <iframe
        id={STREAM_ID_PREFIX + id}
        title={id}
        src={"https://player.twitch.tv/?" + target + "=" + id + "&parent=" + parent + "&muted=" + muted}
        height={height}
        width={width}
        allowfullscreen={allowFullScreen} />
    )
}

export default StreamEmbed