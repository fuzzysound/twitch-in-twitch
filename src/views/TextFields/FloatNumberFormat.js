import React from 'react'
import NumberFormat from 'react-number-format'

function FloatNumberFormat(props) {
    return (
        <NumberFormat
        {...props}
        isNumericString
        />
    )
}

export default FloatNumberFormat