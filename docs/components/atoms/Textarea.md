# Textarea

## Intention
Multi-line text input for longer user content like comments and messages.

## Description
Textarea is a form control for multi-line text entry. It's a styled wrapper around the native HTML `<textarea>` element with configurable resize behavior. Use for content that typically spans multiple lines like product reviews, messages, and descriptions.

In ecommerce, textareas are used for product reviews, contact forms, gift messages, and customer feedback.

## Import
```tsx
import { Textarea } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-textarea'` | No | ID for testing tools |
| `resize` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'both'` | No | Resize behavior |
| `value` | `string` | - | No | Controlled textarea value |
| `defaultValue` | `string` | - | No | Initial value (uncontrolled) |
| `onChange` | `function` | - | No | Callback when text changes |
| `placeholder` | `string` | - | No | Placeholder text |
| `rows` | `number` | - | No | Initial visible rows |
| `disabled` | `boolean` | `false` | No | Disables textarea |
| `required` | `boolean` | `false` | No | Makes field required |
| `maxLength` | `number` | - | No | Maximum character limit |
| `id` | `string` | - | Recommended | ID for label association |

Extends `TextareaHTMLAttributes<HTMLTextAreaElement>` for additional native textarea props.

## Resize Behavior

- **`both`** (default): User can resize width and height
- **`vertical`**: User can resize height only (recommended)
- **`horizontal`**: User can resize width only (rare)
- **`none`**: Fixed size, no resize handle

Most forms use `vertical` resize to maintain layout width while allowing height adjustment.

## Accessibility

- Uses semantic `<textarea>` element
- **Required**: Pair with `<Label>` using matching `id`/`htmlFor`
- Character counter should use `aria-live="polite"` for dynamic updates
- Error messages should use `aria-describedby`
- Screen readers announce:
  - Label text
  - Placeholder (if no label)
  - Character count/limit
  - Error messages

## CSS Custom Properties

```scss
--fs-textarea-min-height: var(--fs-spacing-8)
--fs-textarea-padding: var(--fs-spacing-2) var(--fs-spacing-3)
--fs-textarea-border-radius: var(--fs-border-radius)
--fs-textarea-border-width: var(--fs-border-width)
--fs-textarea-border-color: var(--fs-border-color)
--fs-textarea-border-color-hover: var(--fs-border-color-hover)
--fs-textarea-border-color-focus: var(--fs-color-focus-ring)
--fs-textarea-bkg-color: var(--fs-color-body-bkg)
--fs-textarea-text-color: var(--fs-color-text)
--fs-textarea-text-size: var(--fs-text-size-base)
--fs-textarea-line-height: 1.5
--fs-textarea-disabled-bkg-color: var(--fs-color-disabled-bkg)
```

## Data Attributes

```tsx
<textarea
  data-fs-textarea
  data-fs-textarea-resize="both"
  data-testid="fs-textarea"
/>
```

## Best Practices

### Do's
✅ Always pair with visible labels  
✅ Use vertical resize for most cases  
✅ Set appropriate `rows` for expected content  
✅ Provide character counters for length limits  
✅ Show clear error messages below field  
✅ Use placeholder for format hints only  
✅ Auto-grow for better UX (optional)

### Don'ts
❌ Don't use placeholder instead of label  
❌ Don't make textarea too small (min 3 rows)  
❌ Don't use for single-line input (use Input)  
❌ Don't enforce strict maxLength without warning  
❌ Don't allow horizontal resize in responsive layouts

### Textarea vs Input

- **Textarea**: Multi-line content (reviews, comments, descriptions)
- **Input**: Single-line content (names, emails, titles)

## Related Components

- [TextareaField](../molecules/TextareaField.md) - Textarea with integrated label
- [Input](./Input.md) - For single-line text
- [Label](./Label.md) - For labeling textareas

## Examples

### Basic Textarea
```tsx
<Label htmlFor="comments">Comments</Label>
<Textarea id="comments" rows={4} />
```

### Controlled Textarea
```tsx
const [message, setMessage] = useState('')

<Textarea
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  placeholder="Type your message..."
  rows={5}
/>
```

### Resize Variants
```tsx
{/* Vertical only (recommended) */}
<Textarea resize="vertical" rows={4} />

{/* No resize */}
<Textarea resize="none" rows={4} />

{/* Both directions */}
<Textarea resize="both" rows={4} />
```

### Product Review
```tsx
<form onSubmit={submitReview}>
  <Label htmlFor="review">Your Review</Label>
  <Textarea
    id="review"
    placeholder="Share your experience with this product..."
    rows={6}
    resize="vertical"
    required
    maxLength={500}
  />
  <Button type="submit">Submit Review</Button>
</form>
```

### With Character Counter
```tsx
const [text, setText] = useState('')
const maxChars = 200

<div>
  <Label htmlFor="message">Message</Label>
  <Textarea
    id="message"
    value={text}
    onChange={(e) => setText(e.target.value)}
    maxLength={maxChars}
    rows={4}
    aria-describedby="char-count"
  />
  <div id="char-count" aria-live="polite">
    {text.length} / {maxChars} characters
  </div>
</div>
```

### Gift Message
```tsx
<fieldset>
  <legend>Add a Gift Message</legend>
  
  <Label htmlFor="gift-message">Your Message</Label>
  <Textarea
    id="gift-message"
    placeholder="Write your personalized message here..."
    rows={5}
    resize="vertical"
    maxLength={250}
  />
</fieldset>
```

### Contact Form
```tsx
<form onSubmit={handleSubmit}>
  <Label htmlFor="subject">Subject</Label>
  <Input id="subject" type="text" required />
  
  <Label htmlFor="message">Message</Label>
  <Textarea
    id="message"
    rows={8}
    resize="vertical"
    required
    placeholder="How can we help you?"
  />
  
  <Button type="submit">Send Message</Button>
</form>
```

### Disabled Textarea
```tsx
<Textarea
  value="This content cannot be edited"
  disabled
  rows={3}
/>
```

### With Error State
```tsx
<div>
  <Label htmlFor="feedback">Feedback</Label>
  <Textarea
    id="feedback"
    aria-invalid="true"
    aria-describedby="feedback-error"
    rows={4}
  />
  <span id="feedback-error" role="alert">
    Please provide at least 10 characters
  </span>
</div>
```

### Auto-growing Textarea (custom implementation)
```tsx
const textareaRef = useRef<HTMLTextAreaElement>(null)

useEffect(() => {
  if (textareaRef.current) {
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
  }
}, [value])

<Textarea
  ref={textareaRef}
  value={value}
  onChange={(e) => setValue(e.target.value)}
  rows={3}
  resize="none"
/>
```

### Required Field
```tsx
<Label htmlFor="description">
  Description <span aria-label="required">*</span>
</Label>
<Textarea
  id="description"
  required
  rows={6}
  aria-required="true"
/>
```

### With Helper Text
```tsx
<div>
  <Label htmlFor="bio">Bio</Label>
  <Textarea
    id="bio"
    rows={5}
    aria-describedby="bio-help"
  />
  <small id="bio-help">
    Tell us about yourself (optional)
  </small>
</div>
```
