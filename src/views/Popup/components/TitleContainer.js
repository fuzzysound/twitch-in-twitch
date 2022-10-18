import React from 'react'
import styles from '../Popup.module.css'

function TitleContainer(props) {
    return (
        <div>
            <div className={styles.title}>
                <div>TWITCH</div>
                <div>IN</div>
                <div>TWITCH</div>
            </div>
            <div className={styles.version}>Ver 1.3.1</div>
        </div>
    )
}

export default TitleContainer