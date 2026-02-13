# RichText

## Intention
Render HTML content from CMS or external sources safely.

## Description
RichText is a component that renders raw HTML content using React's `dangerouslySetInnerHTML`. It's designed for displaying rich formatted content from CMS systems, product descriptions, or markdown-converted HTML.

In ecommerce, RichText is used for product descriptions, blog posts, policy pages, and any content-managed HTML.

## Import
```tsx
import { RichText } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-rich-text'` | No | ID for testing tools |
| `content` | `string` | - | Yes | HTML string to render |
| `as` | `ElementType` | `'div'` | No | HTML element to render as wrapper |

Extends `HTMLAttributes<HTMLElement>` for additional attributes based on `as` prop.

## Security Warning

⚠️ **Important**: RichText uses `dangerouslySetInnerHTML` which can expose your app to XSS attacks if content is not sanitized. Only use with **trusted** HTML sources.

### Safe Sources
✅ CMS-managed content with sanitization  
✅ Markdown converted to HTML (with sanitization)  
✅ Content from your own database/API  
✅ HTML sanitized with libraries like DOMPurify

### Unsafe Sources
❌ User-generated content without sanitization  
❌ External/third-party HTML  
❌ URL parameters or query strings  
❌ Unvalidated API responses

## Accessibility

- Uses semantic HTML wrapper (div, section, article, etc.)
- **Content must be semantic**: Ensure HTML contains proper headings, lists, etc.
- **Images**: Alt text required in HTML content
- **Links**: Should open in same tab unless specified
- **Headings**: Maintain proper hierarchy (h2 → h3 → h4)
- Color contrast in HTML content should meet WCAG standards

## CSS Custom Properties

```scss
// Rich text inherits most styles from content
--fs-rich-text-line-height: 1.6

// Typical content styles
[data-fs-rich-text] {
  h2, h3, h4, h5, h6 {
    margin-top: var(--fs-spacing-4);
    margin-bottom: var(--fs-spacing-2);
  }
  
  p {
    margin-bottom: var(--fs-spacing-3);
  }
  
  ul, ol {
    margin-left: var(--fs-spacing-4);
    margin-bottom: var(--fs-spacing-3);
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
}
```

## Data Attributes

```tsx
<div
  data-fs-rich-text
  data-testid="fs-rich-text"
  dangerouslySetInnerHTML={{ __html: content }}
/>
```

## Best Practices

### Do's
✅ Sanitize HTML before passing to component  
✅ Use for CMS-managed content  
✅ Test rendered HTML for accessibility  
✅ Ensure images have alt text  
✅ Style content consistently with design system  
✅ Use appropriate wrapper element (section, article, div)

### Don'ts
❌ Don't trust user input without sanitization  
❌ Don't render scripts or event handlers  
❌ Don't bypass sanitization for "trusted" users  
❌ Don't forget to handle empty content  
❌ Don't allow inline styles from untrusted sources

### Sanitization Example

```tsx
import DOMPurify from 'dompurify'

const sanitizedHTML = DOMPurify.sanitize(rawHTML, {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h2', 'h3', 'ul', 'ol', 'li', 'a'],
  ALLOWED_ATTR: ['href', 'target', 'rel']
})

<RichText content={sanitizedHTML} />
```

## Related Components

- [ProductDescription](../../matter/ui/ProductDescription.md) - Uses RichText for product details
- [Label](./Label.md) - For simple text labels
- [Button](./Button.md) - Avoid rendering buttons in RichText

## Examples

### Basic Usage
```tsx
const htmlContent = '<p>This is <strong>bold</strong> text.</p>'

<RichText content={htmlContent} />
```

### Product Description
```tsx
const productDescription = `
  <h3>Features</h3>
  <ul>
    <li>Wireless connectivity</li>
    <li>40-hour battery life</li>
    <li>Noise cancellation</li>
  </ul>
  <p>Experience premium audio quality with our latest headphones.</p>
`

<RichText
  as="section"
  content={productDescription}
  aria-labelledby="product-features"
/>
```

### With Sanitization
```tsx
import DOMPurify from 'dompurify'

const userContent = getUserContent() // From CMS
const safeContent = DOMPurify.sanitize(userContent)

<RichText content={safeContent} />
```

### Blog Post
```tsx
const blogPost = `
  <article>
    <h2>Summer Collection 2024</h2>
    <p>Discover our latest summer arrivals...</p>
    <img src="/images/summer.jpg" alt="Summer collection banner" />
    <p>Shop now and get 20% off!</p>
  </article>
`

<RichText as="article" content={blogPost} />
```

### Empty Content Handling
```tsx
{content ? (
  <RichText content={content} />
) : (
  <p>No description available</p>
)}
```

### With Custom Wrapper
```tsx
<RichText
  as="section"
  content={htmlContent}
  className="product-specs"
  aria-label="Product specifications"
/>
```

### Policy/Legal Content
```tsx
const termsHTML = `
  <h2>Terms and Conditions</h2>
  <h3>1. Acceptance of Terms</h3>
  <p>By using this service...</p>
  <h3>2. User Responsibilities</h3>
  <p>Users agree to...</p>
`

<RichText
  as="article"
  content={termsHTML}
  role="document"
/>
```

### Markdown to HTML
```tsx
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const markdown = `
# Product Features

- Feature 1
- Feature 2
- Feature 3
`

const html = marked(markdown)
const safeHTML = DOMPurify.sanitize(html)

<RichText content={safeHTML} />
```

### With Styling
```tsx
<RichText
  content={htmlContent}
  style={{
    maxWidth: '800px',
    lineHeight: 1.6,
  }}
/>
```

## Security Checklist

Before using RichText:

1. ✅ Is the content from a trusted source?
2. ✅ Is the content sanitized?
3. ✅ Does the content contain scripts or event handlers?
4. ✅ Are user uploads/inputs excluded?
5. ✅ Is DOMPurify or similar library used for sanitization?
6. ✅ Are you allowing only necessary HTML tags?
7. ✅ Are inline styles and attributes restricted?

If you can't check all boxes, reconsider using RichText or implement additional sanitization.
