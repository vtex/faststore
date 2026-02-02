# ImageGallery

## Intention
Product image gallery with thumbnails and zoom.

## Description
ImageGallery displays product images with thumbnail selector and main viewer. Supports zoom, multiple images, and 360° views.

## Import
```tsx
import { ImageGallery } from '@faststore/components'
```

## Sub-components
- `ImageGallerySelector` - Thumbnail selector
- `ImageGalleryViewer` - Main image viewer

## Examples

```tsx
<ImageGallery>
  <ImageGalleryViewer>
    <img src={images[selectedImage]} alt="Product" />
  </ImageGalleryViewer>
  <ImageGallerySelector>
    {images.map((img, i) => (
      <button key={i} onClick={() => setSelectedImage(i)}>
        <img src={img} alt={`View ${i + 1}`} />
      </button>
    ))}
  </ImageGallerySelector>
</ImageGallery>
```
