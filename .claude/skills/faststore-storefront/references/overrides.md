---
name: faststore-overrides
description: How to override FastStore native sections and inner components using getOverriddenSection, and how to create brand-new custom sections. Use when customizing existing sections (Navbar, Alert, ProductDetails, etc.), replacing inner component slots (BuyButton, Icon, etc.), adding CSS classes to a section, or creating new sections that integrate with VTEX Headless CMS.
metadata:
  author: vtex
  version: "1.0"
---

# FastStore Section Overrides & Custom Sections

FastStore provides global sections with defaults that every store typically needs. You can customize them by overriding their inner components or styles, or create entirely new sections.

**Key rule:** Always use `getOverriddenSection` from `@faststore/core` when overriding a section. Never rewrite an entire native section from scratch if overriding is sufficient.

## Section Registry — `src/components/index.tsx`

This is the **single entry point** where FastStore discovers all custom and overridden sections. It must use a **default export** (not named exports).

```tsx
// src/components/index.tsx
import CustomIconsAlert from "./sections/CustomIconsAlert/CustomIconsAlert";
import AlertWithImage from "./sections/AlertWithImage/AlertWithImage";
import CustomProductDetails from "./sections/CustomProductDetails/CustomProductDetails";
import CustomNewsletter from "./sections/CustomNewsletter/CustomNewsletter";
import ContactForm from "./ContactForm/ContactForm";

const sections = {
  // New section — unique name, must also exist in cms/faststore/components/cms_component__customIconsAlert.jsonc
  CustomIconsAlert,

  // New section — alert with image instead of icon. must also exist in cms/faststore/components/cms_component__alertWithImage.jsonc
  AlertWithImage,

  // Override — key matches native section name, replacing it everywhere
  ProductDetails: CustomProductDetails,

  // New section — contact form backed by a third-party GraphQL mutation.  must also exist in cms/faststore/components/cms_component__contactForm.jsonc
  ContactForm,

  // New section — custom newsletter with analytics.  must also exist in cms/faststore/components/cms_component__customNewsLetter.jsonc
  CustomNewsletter,
};

export default sections;
```

- **Override a native section**: Use the exact native name as the key (e.g., `ProductDetails`). The custom component replaces it on all pages.
- **Add a new section**: Use a unique new name as the key (e.g., `ContactForm`). Also define a CMS schema in `cms/faststore/components/cms_component__<sectionName>.jsonc`.

## Pattern 1: Override with Custom CSS Class Only

Use when you only need to restyle a native section, not change its inner components.

```tsx
// src/components/sections/CustomIconsAlert/CustomIconsAlert.tsx
import { getOverriddenSection, AlertSection } from "@faststore/core";
import styles from "./custom-icons-alert.module.scss";

const CustomIconsAlert = getOverriddenSection({
  Section: AlertSection,
  className: styles.customIconsAlert, // Added to the section root element
  // No `components` key needed — only styling changes
});

export default CustomIconsAlert;
```

## Pattern 2: Override an Inner Component

Use when you need to replace a specific sub-component within a native section.

```tsx
// src/components/sections/CustomProductDetails/CustomProductDetails.tsx
import { getOverriddenSection, ProductDetailsSection } from "@faststore/core";
import { BuyButtonWithDetails } from "../../BuyButtonWithDetails/BuyButtonWithDetails";

const CustomProductDetails = getOverriddenSection({
  Section: ProductDetailsSection,
  components: {
    // Key must match the slot name in the native section
    BuyButton: {
      Component: BuyButtonWithDetails, // Replaces native BuyButton
    },
  },
});

export default CustomProductDetails;
```

## Pattern 3: Override with Dynamic Props (Memoized)

Use when the override depends on props from the CMS or parent. Memoize with `useMemo` to avoid creating a new component type on every render (which would unmount/remount the subtree).

```tsx
// src/components/sections/AlertWithImage/AlertWithImage.tsx
import { useMemo } from "react";
import { AlertSection, getOverriddenSection } from "@faststore/core";
import { Image_unstable as Image } from "@faststore/core/experimental";
import styles from "./alert-with-image.module.scss";

interface AlertWithImageProps
  extends Omit<React.ComponentProps<typeof AlertSection>, "icon"> {
  src: string;
  alt: string;
}

export default function AlertWithImage(props: AlertWithImageProps) {
  const { src, alt, ...otherProps } = props;

  const OverriddenAlert = useMemo(
    () =>
      getOverriddenSection({
        Section: AlertSection,
        className: styles.alertWithImage,
        components: {
          Icon: {
            Component: () => (
              <Image src={props.src} alt={props.alt} width={24} height={24} />
            ),
          },
        },
      }),
    [] // Empty deps — override structure is static
  );

  return <OverriddenAlert {...otherProps} icon="" />;
}


// <project_root>/src/components/index.tsx
export default {
  AlertSection: AlertWithImage
}
```

## `getOverriddenSection` API

```ts
getOverriddenSection({
  Section: NativeSection,       // Required — native section from @faststore/core
  className?: string,           // Optional — CSS class applied to section root
  components?: {                // Optional — map of slot overrides
    [SlotName: string]: {
      Component: React.ComponentType,  // Replacement component (mutually exclusive with props)
      props?: Record<string, any>,     // Additional props merged into the slot
    },
  },
})
// Returns: A React component with the same props as the native section
```

`Component` and `props` are mutually exclusive per slot.

## Creating Brand-New Sections

When no native section fits your needs, create a section from scratch.

### Checklist

1. **Create the component** in `src/components/sections/<Name>/` (or `src/components/<Name>/` for non-section sub-components)
2. **Register it** in `src/components/index.tsx` with a unique key
3. **Add a CMS schema** in `cms/faststore/components/cms_component__<sectionName>.jsonc`
4. **Run `vtex content generate-schema cms/faststore/components cms/faststore/pages -o cms/faststore/schema.json -b vtex.faststore4`** to generate final schema file.
5. **Run `vtex content upload-schema cms/faststore/schema.json`** to push final schema file to cms.
6. If the section uses `@faststore/ui` components, **import their stylesheets manually** in its `.module.scss`

### Example: ContactForm Section

```tsx
// src/components/ContactForm/ContactForm.tsx
import { useCallback, useState } from "react";
import { gql } from "@faststore/core/api";
import { useLazyQuery_unstable as useLazyQuery } from "@faststore/core/experimental";
import {
  Button as UIButton,
  InputField as UIInputField,
  Textarea as UITextArea,
} from "@faststore/ui";
import styles from "./contact-form.module.scss";

// gql tag must be at module scope — FastStore's build pipeline statically extracts it
export const mutation = gql(`
  mutation SubmitContactForm($data: ContactFormInput!) {
    submitContactForm(input: $data) {
      message
    }
  }
`);

export const ContactForm = () => {
  const [submitContactForm, { data, error }] = useLazyQuery(mutation, {
    data: { name: "", email: "", subject: "", message: "" },
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      submitContactForm({ data: { name, email, subject, message } });
    },
    [submitContactForm, name, email, subject, message]
  );

  return (
    <section className={styles.contactForm}>
      <form onSubmit={onSubmit}>
        <UIInputField id="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <UIInputField id="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <UIInputField id="subject" label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <UITextArea id="message" placeholder="Write here your message." value={message} onChange={(e) => setMessage(e.target.value)} />
        <UIButton type="submit" variant="primary">Send</UIButton>
      </form>
    </section>
  );
};

export default ContactForm;
```

## Quick Override Reference

```tsx
// Minimal override example
import { NavbarSection, getOverriddenSection } from "@faststore/core";

const MyComponent = () => <p>Overridden Component</p>;

export default {
  Navbar: getOverriddenSection({
    Section: NavbarSection,
    components: {
      NavbarHeader: { Component: MyComponent },
    },
  }),
};
```

See [faststore-sections](../faststore-sections/SKILL.md) for the full list of sections and their overridable slot names.
