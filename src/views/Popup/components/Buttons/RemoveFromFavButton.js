import React from 'react'
import styles from '../../Popup.module.css'
import Button from './Button'

function RemoveFromFavButton (props) {
    return (
        <Button 
        buttonClass={styles.delFromFavButton}  
        tooltipText={chrome.i18n.getMessage("tooltip_unstar")} 
        onClick={props.onClick} 
        />
    )
}

export default RemoveFromFavButton