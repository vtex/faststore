import React from 'react';
import {useColorMode} from '@docusaurus/theme-common';

const ImageSwitcher = ({lightImageSrc, darkImageSrc, classes}) => {
  const { isDarkTheme } = useColorMode();

  return (
    <img className={classes} src={isDarkTheme ? darkImageSrc : lightImageSrc} />
  )
}

export default ImageSwitcher;