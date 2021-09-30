import { useSelector } from 'react-redux'
import ChatFrame from './ChatFrame'
import { selectCurrentChatFrameInfo, selectCurrentTabId, selectCurrentHost } from '../../store/contentSlice'

function ChatFrameWrapper(props) {
    const currentChatFrameInfo = useSelector(selectCurrentChatFrameInfo)

    const currentTabId = useSelector(selectCurrentTabId)

    const currentHost = useSelector(selectCurrentHost)

    return (
        <ChatFrame 
        host={currentHost}
        streamerIds={currentChatFrameInfo.streamerIds}
        tabId={currentTabId}
        initPos={currentChatFrameInfo.initPos}
        initSize={currentChatFrameInfo.initSize}
        />
    )
}

export default ChatFrameWrapper