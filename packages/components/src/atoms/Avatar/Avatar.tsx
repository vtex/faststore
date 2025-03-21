import type { HTMLAttributes } from 'react'
import React from 'react'

export interface AvatarProps extends HTMLAttributes<HTMLImageElement> {
  /**
   * The URL of the image to be displayed.
   */
  imageUrl?: string
  /**
   * The name of the user.
   */
  alt: string
}

/**
 * The Avatar component displays a user's profile picture or initials.
 */
const Avatar = ({ imageUrl, alt }: AvatarProps) =>
  imageUrl ? (
    <img data-fs-avatar src={imageUrl} />
  ) : (
    <span data-fs-avatar>{alt[0]}</span>
  )

export default Avatar
