import React, { useState, useCallback } from 'react'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/core/styles'
import FavoritesControllerContainer from './components/FavoritesControllerContainer'
import InitPosAndSizeControllerContainer from './components/InitPosAndSizeControllerContainer'
import StateResetControllerContainer from './components/StateResetControllerContainer'

function App() {
    const [key, setKey] = useState(Math.random())

    const useStyles = makeStyles((theme) => ({
        optionElementGrid: {
            'padding': '15px',
            'font-size': '24px'
        }
    }))
    const classes = useStyles()

    const resetKey = useCallback(() => {
        setKey(Math.random())
    }, [])

    return (
        <div key={key}>
            <Grid className={classes.optionElementGrid} container direction='column' spacing={2}>
                <div>
                    즐겨찾기 관리
                </div>
                <FavoritesControllerContainer />
            </Grid>
            <Divider />
            <Grid className={classes.optionElementGrid} container direction='column' spacing={2}>
                <div>
                    초기 위치 조정
                </div>
                <InitPosAndSizeControllerContainer />
            </Grid>
            <Divider />
            <Grid className={classes.optionElementGrid} container direction='column' spacing={2}>
                <div>
                    데이터 삭제
                </div>
                <StateResetControllerContainer onResetState={resetKey}/>
            </Grid>
        </div>
    )
}

export default App