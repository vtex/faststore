const React = require('react')

const imgAccumulator = []
const defaultCreateElement = React.createElement

const parseImage = (props) => {
  const { src, srcset, srcSet, sizes, media } = props

  return {
    href: src,
    imagesrcset: srcset ?? srcSet,
    imagesizes: sizes ?? '100vw',
    media,
  }
}

const customCreateElement = (element, props, ...children) => {
  const defaultValue = defaultCreateElement(element, props, ...children)

  if (element !== 'img' && element !== 'picture') {
    return defaultValue
  }

  if (props?.['data-image-preload'] !== 'preload') {
    return defaultCreateElement(element, {...props, loading: 'lazy'}, ...children)
    // return defaultValue
  }

  if (element === 'img') {
    imgAccumulator.push(parseImage(props))
  }

  if (element === 'picture') {
    const pictureChildren = [].concat(React.Children.toArray(children) ?? []).concat(props?.children?.flat(Infinity) ?? [])
    for (const child of pictureChildren) {
      if (child.type === 'source') {
        imgAccumulator.push(parseImage(child.props))
      }
    }
  }

  return defaultValue
}

if (!React.createElement.hasInitImagePreload) {
  React.createElement = customCreateElement
  React.createElement.hasInitImagePreload = true
}

exports.onRenderBody = ({ setHeadComponents }) => {
  if (imgAccumulator.length > 0) {
    setHeadComponents(imgAccumulator.map(value => (
      React.createElement('link', {
        rel: 'preload',
        as: 'image',
        ...value,
      })
    )))
    imgAccumulator.splice(0,imgAccumulator.length)
  }
}
