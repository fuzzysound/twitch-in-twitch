import React from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import styles from '../Popup.module.css'
import { StreamButton, ChatButton, RemoveFromFavButton, LatestVodButton, LatestVodGotoButton } from '../../Buttons'
import { selectFavorites } from '../../../store/favoriteSlice'

function FavoritesContainer({ onClickStreamButton, onClickChatButton, onClickLatestVodButton, onClickLatestVodGotoButton, onClickRemoveFromFavButton }) {
    const useStyles = makeStyles((theme) => ({
        favoriteGrid: {
            height: '40px',
            'flex-wrap': 'nowrap',
            'line-height': '180%',
            'font-size': '16px'
        },
    }))
    const classes = useStyles()

    const favorites =  useSelector(selectFavorites)

    const favoritesContainer = favorites.map(streamerId => (
        <Grid key={streamerId} className={classes.favoriteGrid} container spacing={0} item xs>
            <Grid item xs={9}>
                {streamerId}
            </Grid>
            <StreamButton onClick={onClickStreamButton(streamerId)} />
            <ChatButton onClick={onClickChatButton(streamerId)} />
            <LatestVodButton onClick={onClickLatestVodButton(streamerId)}/>
            <LatestVodGotoButton onClick={onClickLatestVodGotoButton(streamerId)}/>
            <RemoveFromFavButton onClick={onClickRemoveFromFavButton(streamerId)} />
        </Grid>
    ))

    return (
        <Grid container direction='column' spacing={0} item xs>
            <div className={styles.favoritesTitle}>
                {chrome.i18n.getMessage("favorites")}
            </div>
            {favoritesContainer}
        </Grid>
    )
}

export default FavoritesContainer