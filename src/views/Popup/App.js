import React from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/core/styles'
import { BackgroundSignals } from '../../common/signals'
import TitleContainer from './components/TitleContainer'
import FavoritesContainer from './components/FavoritesContainer'
import InputContainer from './components/InputContainer'
import DelayControllerContainer from './components/DelayControllerContainer'
import { selectShowFavoritesContainer } from '../../store/favoriteSlice'

function App() {
  const useStyles = makeStyles((theme) => ({
    popupGrid: {
        padding: '5px',
    },
    popupElementGrid: {
    }
  }))

  const classes = useStyles()

  const onClickStreamButton = streamerId => () => {
    chrome.runtime.sendMessage({ signal: BackgroundSignals.ADD_STREAM, streamerId: streamerId })
  }

  const onClickChatButton = streamerId => () => {
    chrome.runtime.sendMessage({ signal: BackgroundSignals.ADD_CHAT, streamerId: streamerId })
  }

  const onClickAddToFavButton = streamerId => () => {
    chrome.runtime.sendMessage({ signal: BackgroundSignals.ADD_TO_FAVORITES, streamerId: streamerId })
  }

  const onClickRemoveFromFavButton = streamerId => () => {
    chrome.runtime.sendMessage({ signal: BackgroundSignals.REMOVE_FROM_FAVORITES, streamerId: streamerId })
  }

  const showFavoritesContainer = useSelector(selectShowFavoritesContainer)

  return (
    <Grid className={classes.popupGrid} container direction='column' spacing={2}>
        <Grid className={classes.popupElementGrid} container item xs>
            <TitleContainer />
        </Grid>
        <Divider />
        {showFavoritesContainer &&
        <Grid className={classes.popupElementGrid} container item xs>
            <FavoritesContainer 
            onClickStreamButton={onClickStreamButton}
            onClickChatButton={onClickChatButton}
            onClickRemoveFromFavButton={onClickRemoveFromFavButton}
            />
        </Grid>
        }
        {showFavoritesContainer &&
        <Divider />
        }
        <Grid className={classes.popupElementGrid} container item xs>
            <InputContainer 
            onClickStreamButton={onClickStreamButton}
            onClickChatButton={onClickChatButton}
            onClickAddToFavButton={onClickAddToFavButton}
            />
        </Grid>
        <Divider />
        <Grid className={classes.popupElementGrid} container item xs>
            <DelayControllerContainer />
        </Grid>
    </Grid>
  )
}

export default App