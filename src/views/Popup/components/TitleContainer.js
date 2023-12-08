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
            <div className={styles.version}>Ver 1.3.2</div>
            <div className={styles.rip}>R.I.P. Twitch Korea (2015.2.1 ~ 2024.2.27)</div>
        </div>
    )
}

export default TitleContainer