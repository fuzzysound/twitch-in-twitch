import React from 'react'
import TextField from '@material-ui/core/TextField'
import { InputAdornment } from '@material-ui/core'
import FloatNumberFormat from './FloatNumberFormat'

function FloatTextField(props) {
    const {suffix, onChange, defaultValue, ...other} = props

    return (
        <TextField fullWidth
        {...other}
        size='small'
        variant='outlined'
        InputProps={{
            inputComponent: FloatNumberFormat,
            endAdornment: <InputAdornment position='end'>
                            {suffix}
                        </InputAdornment>
        }}
        inputProps={{
            defaultValue: defaultValue,
            onChange: onChange
        }}
        />
    )
}

export default FloatTextField