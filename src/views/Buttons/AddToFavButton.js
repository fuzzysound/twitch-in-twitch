import React from 'react'
import styles from './Buttons.module.css'
import Button from './Button'

function AddToFavButton (props) {
    return (
        <Button 
        buttonClass={styles.addToFavButton} 
        tooltipText={chrome.i18n.getMessage("tooltip_star")} 
        onClick={props.onClick} 
        />
    )
}

export default AddToFavButton