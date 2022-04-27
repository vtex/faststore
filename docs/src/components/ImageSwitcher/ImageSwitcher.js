import React from 'react';
import {useColorMode} from '@docusaurus/theme-common';

const ImageSwitcher = ({lightImageSrc, darkImageSrc, classes}) => {
  const { colorMode } = useColorMode();

  return (
    <img className={classes} src={colorMode === 'dark' ? darkImageSrc : lightImageSrc} />
  )
}

export default ImageSwitcher;