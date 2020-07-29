import React, { FC } from 'react'

type Props = { offer::  }
const Availability: FC<Props> = ({ offer: }) => {
    return (
      <Box variant={`${variant}.availability`}>
      {offer.AvailableQuantity} units left!
    </Box>
    )
};

export default Availability