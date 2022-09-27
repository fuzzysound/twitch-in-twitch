import fetch from 'node-fetch'

const HASH = 'a937f1d22e269e39a03b509f65a7490f9fc247d7f83d6ac1421523e3b68042cb'
const CLIENT_ID = 'kimne78kx3ncx6brgo4mv6wki5h1ko'
const ENDPOINT = 'https://gql.twitch.tv/gql'
const OPERATION = 'FilterableVideoTower_Videos'

export const getLatestVodId = async (streamerId) => {
    const body = [{
        operationName: OPERATION,
        variables: {
            broadcastType: "ARCHIVE",
            channelOwnerLogin: streamerId,
            limit: 1,
            videoSort: "TIME"
        },
        extensions: {
            persistedQuery: {
                version: 1,
                sha256Hash: HASH
            }
        }
    }]
    const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=UTF-8",
            "Client-Id": CLIENT_ID
        },
        body: JSON.stringify(body)
    })
    const data = await res.json()
    const latestVodId = data?.[0].data.user.videos.edges[0].node.id || null
    return latestVodId
}