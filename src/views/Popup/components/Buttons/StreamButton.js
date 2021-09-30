import React from 'react'
import styles from '../../Popup.module.css'
import Button from './Button'

function StreamButton (props) {
    return (
        <Button 
        buttonClass={styles.streamButton} 
        tooltipText={chrome.i18n.getMessage("tooltip_stream")} 
        onClick={props.onClick} 
        />
    )
}

export default StreamButton