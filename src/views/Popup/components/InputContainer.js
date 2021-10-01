import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { StreamButton, ChatButton, AddToFavButton } from './Buttons'

function InputContainer({ onClickStreamButton, onClickChatButton, onClickAddToFavButton }) {
    const [streamerId, setStreamerId] =  useState("")

    const useStyles = makeStyles((theme) => ({
        inputContainerGrid: {
            height: '40px',
            'flex-wrap': 'nowrap'
        },
        buttonGrid: {
            width: '70px',
            'flex-grow': 0
        },
        textField: {
            width: '30ch'
        }
    }))
    const classes = useStyles()

    const handleChange = event => setStreamerId(event.target.value)

    return (
        <Grid className={classes.inputContainerGrid} container spacing={0} item xs>
            <Grid item xs={9}>
                <form onSubmit={onClickStreamButton(streamerId)}>
                    <TextField fullWidth
                    className={classes.textField}
                    size='small' 
                    label={chrome.i18n.getMessage("streamerId")} 
                    variant="outlined" 
                    onChange={handleChange}
                    />
                </form>
            </Grid>
            <StreamButton onClick={onClickStreamButton(streamerId)} />
            <ChatButton onClick={onClickChatButton(streamerId)} />
            <AddToFavButton onClick={onClickAddToFavButton(streamerId)} />
        </Grid>
    )
}

export default InputContainer