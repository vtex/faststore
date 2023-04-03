import React, { useState } from 'react'
import { ShippingSimulation } from '@faststore/ui'

const shippingOptions = [
    {
        carrier: 'DHL',
        localizedEstimates: 'Up to 3 business days',
        price: 12,
    },
]

const shippingLocation = "Alfredo Coutinho St"

function ShippingSimulationUsage() {
    const [options, setOptions] = useState([])
    const [postalCode, setPostalCode] = useState("")
    const [location, setLocation] = useState("")
    const [error, setError] = useState("")
    const [displayClearButton, setDisplayClearButton] = useState(false)

    const handleSubmit = () => {
        if (isNaN(Number(postalCode)) || postalCode.length <= 0) {
            setError("Set a valid Postal Code")
            return
        }
        setOptions(shippingOptions)
        setLocation(shippingLocation)
        setDisplayClearButton(true)
    }

    const handleClear = () => {
        setOptions([])
        setLocation("")
        setDisplayClearButton(false)
        setPostalCode("")
        setError("")
    }

    const handleInput = (value: string) => {
        setError("")
        setPostalCode(value)
        setDisplayClearButton(false)
    } 

    return (
        <ShippingSimulation
            onInput={(event) => handleInput(event.currentTarget.value)}
            onSubmit={handleSubmit}
            onClear={handleClear}
            location={location}
            options={options}
            displayClearButton={displayClearButton}
            formatter={(value) => value}
            errorMessage={error}
            postalCode={postalCode}
        />
    )
}

export default ShippingSimulationUsage
