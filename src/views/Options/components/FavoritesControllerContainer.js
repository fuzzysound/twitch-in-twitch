import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import { BackgroundSignals } from '../../../common/signals'
import { AddToFavButton, RemoveFromFavButton } from '../../Buttons'
import { selectFavorites } from '../../../store/favoriteSlice'

function FavoritesControllerContainer() {
    const [inputStreamerId, setInputStreamerId] = useState("")

    const useStyles = makeStyles((theme) => ({
        favoriteGrid: {
            height: '40px',
            'flex-wrap': 'nowrap',
            'line-height': '180%',
            'font-size': '16px'
        },
        inputGrid: {
            height: '40px',
            'flex-wrap': 'nowrap',
            'line-height': '180%',
            'font-size': '16px'
        },
        textField: {
        }
    }))
    const classes = useStyles()

    const favorites = useSelector(selectFavorites)

    const onClickAddToFavButton = useCallback(streamerId => () => {
        chrome.runtime.sendMessage({ signal: BackgroundSignals.ADD_TO_FAVORITES, streamerId: streamerId })
    }, [])

    const onClickRemoveFromFavButton = useCallback(streamerId => () => {
        chrome.runtime.sendMessage({ signal: BackgroundSignals.REMOVE_FROM_FAVORITES, streamerId: streamerId })
    }, [])

    const handleChange = event => setInputStreamerId(event.target.value)

    const favoritesList = favorites.map(streamerId => (
        <Grid className={classes.favoriteGrid} container spacing={1} item xs>
            <Grid item xs={1}></Grid>
            <Grid item xs={8}>
                {streamerId}
            </Grid>
            <Grid item xs={1}>
                <RemoveFromFavButton onClick={onClickRemoveFromFavButton(streamerId)} />
            </Grid>
            <Grid item xs={2}></Grid>
        </Grid>
    ))

    return (
        <Grid container direction='column' spacing={0} item xs>
            {favoritesList}
            <Grid className={classes.inputGrid} container spacing={1} item xs>
                <Grid item xs={1}></Grid>
                <Grid item xs={8}>
                    <form onSubmit={onClickAddToFavButton(inputStreamerId)}>
                        <TextField fullWidth
                        className={classes.textField}
                        size='small'
                        label='스트리머/VOD ID'
                        variant='outlined'
                        onChange={handleChange}
                        />
                    </form>
                </Grid>
                <Grid item xs={1}>
                    <AddToFavButton onClick={onClickAddToFavButton(inputStreamerId)} />
                </Grid>
                <Grid item xs={2}></Grid>
            </Grid>
        </Grid>
    )
}

export default FavoritesControllerContainer