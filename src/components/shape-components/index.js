import React from "react"
import PropTypes from "prop-types"
import CrystallizeContent from "@crystallize/content-transformer/react"
import Image from "@crystallize/react-image"

import ParagraphCollection from "./paragraph-collection"
import { Images, Videos } from "./paragraph-collection/styles"
import VideoPlayer from "components/video-player"

const ShapeComponents = ({ components, overrides }) => {
  if (!components) {
    return null
  }
  return components
    .filter(component => component && component.content != null)
    .map(({ type, ...component }, index) => {
      const key = index
      let Component

      // Check for overrides
      if (overrides && overrides[component.name]) {
        Component = overrides[component.name]
      }

      if (type === "paragraphCollection") {
        Component = Component || ParagraphCollection

        return <Component key={key} paragraphs={component.content.paragraphs} />
      }

      if (type === "images") {
        return (
          component.content?.images && (
            <Images key={key}>
              {component.content.images.map((image, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <Image key={idx} {...image} />
              ))}
            </Images>
          )
        )
      }

      if (type === "videos") {
        return (
          component.content?.videos && (
            <Videos key={key}>
              {component.content.videos.map((video, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <VideoPlayer key={idx} {...video} />
              ))}
            </Videos>
          )
        )
      }

      if (type === "richText") {
        if (!component.content.json) {
          return null
        }
        Component = Component || CrystallizeContent
        return <Component key={key} {...component.content.json[0]} />
      }

      if (type === "singleLine") {
        if (!component.content.json) {
          return null
        }
        Component = Component || "span"
        return <Component key={key}>{component.content.text}</Component>
      }

      if (type) {
        // eslint-disable-next-line no-console
        console.log(`Render for ${type} not implemented`)
      }

      return <span key={key} />
    })
}

ShapeComponents.propTypes = {
  components: PropTypes.array.isRequired,
  overrides: PropTypes.object,
}

export default ShapeComponents
