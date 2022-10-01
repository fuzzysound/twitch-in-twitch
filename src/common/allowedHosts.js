export const TWITCH = "twitch.tv"
export const YOUTUBE = "youtube.com"
export const NAVER = "game.naver.com"
export const AFREECATV = "afreecatv.com"
export const ALLOWED_HOSTS = [TWITCH, YOUTUBE, NAVER, AFREECATV]

export const getHostFromUrl = url => {
    for (const host of ALLOWED_HOSTS) {
        if (url.match(host)) {
            return host
        }
    }
    return null
}
