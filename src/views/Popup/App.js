import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import { makeStyles, createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from "@material-ui/styles";
import { BackgroundSignals } from '../../common/signals'
import TitleContainer from './components/TitleContainer'
import DarkModeControllerContainer from './components/DarkModeControllerContainer'
import FavoritesContainer from './components/FavoritesContainer'
import InputContainer from './components/InputContainer'
import ContentFinderContainer from './components/ContentFinderContainer'
import DelayControllerContainer from './components/DelayControllerContainer'
import CurrentDelayContainer from './components/CurrentDelayContainer'
import { selectIsDarkMode } from '../../store/contentSlice'
import { selectShowFavoritesContainer } from '../../store/favoriteSlice'

function App() {
  const useStyles = makeStyles((theme) => ({
    popupGrid: {
        padding: '5px',
    },
    popupElementGrid: {
    },
    lightMode: {
        background: 'rgb(239, 239, 241)',
        color: 'rgb(14, 14, 16)'
    },
    darkMode: {
        background: 'rgb(66, 66, 66)',
        color: 'rgb(255, 255, 255)'
    }
  }))

  const classes = useStyles()

  const onClickStreamButton = useCallback(streamerId => () => {
    chrome.runtime.sendMessage({ signal: BackgroundSignals.ADD_STREAM, streamerId: streamerId })
  }, [])

  const onClickChatButton = useCallback(streamerId => () => {
    chrome.runtime.sendMessage({ signal: BackgroundSignals.ADD_CHAT, streamerId: streamerId })
  }, [])

  const onClickAddToFavButton = useCallback(streamerId => () => {
    chrome.runtime.sendMessage({ signal: BackgroundSignals.ADD_TO_FAVORITES, streamerId: streamerId })
  }, [])

  const onClickRemoveFromFavButton = useCallback(streamerId => () => {
    chrome.runtime.sendMessage({ signal: BackgroundSignals.REMOVE_FROM_FAVORITES, streamerId: streamerId })
  }, [])

  const isDarkMode = useSelector(selectIsDarkMode)

  const showFavoritesContainer = useSelector(selectShowFavoritesContainer)

  const theme = createMuiTheme({
    palette: {
      type: isDarkMode ? "dark" : "light"
    }
  });

  return (
    <ThemeProvider theme={theme}>
        <Grid className={classes.popupGrid + " " + (isDarkMode ? classes.darkMode : classes.lightMode)} container direction='column' spacing={2}>
            <Grid className={classes.popupElementGrid} container item xs>
                <TitleContainer />
            </Grid>
            <Divider />
            <Grid className={classes.popupElementGrid} container item xs>
                <DarkModeControllerContainer />
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
                <ContentFinderContainer />
            </Grid>
            <Divider />
            <Grid className={classes.popupElementGrid} container item xs>
                <DelayControllerContainer />
            </Grid>
            <Grid className={classes.popupElementGrid} container item xs>
                <CurrentDelayContainer />
            </Grid>
        </Grid>
    </ThemeProvider>
  )
}

export default App