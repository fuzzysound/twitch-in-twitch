import React from 'react'
import { useSelector } from 'react-redux'
import Stream from './Stream'
import { selectCurrentStreamsInfo, selectCurrentHost } from '../../store/contentSlice'
import './content.css'

function StreamList (props) {
    const currentStreamsInfo = useSelector(selectCurrentStreamsInfo)

    const currentHost = useSelector(selectCurrentHost)
    
    const streamList = Object.entries(currentStreamsInfo).map(
        ([streamerId, {initPos, initSize}]) => (
            <Stream 
            key={streamerId} 
            streamerId={streamerId}
            host={currentHost}
            initPos={initPos}
            initSize={initSize}
            />
        )
    )

    return (
        <div>
            {streamList}
        </div>
    )
}

export default StreamList