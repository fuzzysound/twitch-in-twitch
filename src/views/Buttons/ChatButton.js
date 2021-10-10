import React from 'react'
import styles from './Buttons.module.css'
import Button from './Button'

function ChatButton (props) {
    return (
        <Button 
        buttonClass={styles.chatButton} 
        tooltipText={chrome.i18n.getMessage("tooltip_chat")} 
        onClick={props.onClick} 
        />
    )
}

export default ChatButton