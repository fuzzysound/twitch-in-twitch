import React from 'react'
import styles from './Buttons.module.css'
import Button from './Button'

function LatestVodButton (props) {
    return (
        <Button
        buttonClass={styles.latestVodButton}
        tooltipText={chrome.i18n.getMessage("tooltip_latest_vod")}
        onClick={props.onClick}
        />
    )
}

export default LatestVodButton