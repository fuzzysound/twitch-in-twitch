import React from 'react'
import NumberFormat from 'react-number-format'

function IntegerNumberFormat(props) {
    return (
        <NumberFormat
        {...props}
        isNumericString
        decimalScale={0}
        />
    )
}

export default IntegerNumberFormat