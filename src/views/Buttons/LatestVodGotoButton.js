import React from 'react'
import styles from './Buttons.module.css'
import Button from './Button'

function LatestVodGotoButton (props) {
    return (
        <Button
        buttonClass={styles.latestVodGotoButton}
        tooltipText={chrome.i18n.getMessage("tooltip_latest_vod_goto")}
        onClick={props.onClick}
        />
    )
}

export default LatestVodGotoButton