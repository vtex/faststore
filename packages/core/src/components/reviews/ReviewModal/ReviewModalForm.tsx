import dynamic from 'next/dynamic'
import { type FormEvent, useRef, useState, useCallback } from 'react'

const UIButton = dynamic(
  () =>
    import(/* webpackChunkName: "UIButton" */ '@faststore/ui').then(
      (mod) => mod.Button
    ),
  { ssr: false }
)

const UIModalBody = dynamic(
  () =>
    import(/* webpackChunkName: "UIModalBody" */ '@faststore/ui').then(
      (mod) => mod.ModalBody
    ),
  { ssr: false }
)

const UIModalFooter = dynamic(
  () =>
    import(/* webpackChunkName: "UIReviewModalFooter" */ '@faststore/ui').then(
      (mod) => mod.ModalFooter
    ),
  { ssr: false }
)

const ProductThumbnail = dynamic(
  () =>
    import(
      /* webpackChunkName: "ProductThumbnail" */ 'src/components/reviews/ReviewModal/ProductThumbnail'
    ),
  { ssr: false }
)

const UICheckboxField = dynamic(
  () =>
    import(/* webpackChunkName: "UICheckboxField" */ '@faststore/ui').then(
      (mod) => mod.CheckboxField
    ),
  { ssr: false }
)

const UIInputField = dynamic(
  () =>
    import(/* webpackChunkName: "UIInputField" */ '@faststore/ui').then(
      (mod) => mod.InputField
    ),
  { ssr: false }
)

const UITextareaField = dynamic(
  () =>
    import(/* webpackChunkName: "UITextareaField" */ '@faststore/ui').then(
      (mod) => mod.TextareaField
    ),
  { ssr: false }
)

const UIRatingField = dynamic(
  () =>
    import(/* webpackChunkName: "UIRatingField" */ '@faststore/ui').then(
      (mod) => mod.RatingField
    ),
  { ssr: false }
)

export interface ReviewModalFormProps {
  product: {
    id: string
    name: string
    image?: { url: string; alternateName: string }
  }
  ratingField?: {
    label: string
    requiredErrorMessage: string
  }
  reviewTitleField?: {
    label: string
    requiredErrorMessage: string
  }
  reviewerNameField?: {
    label: string
    requiredErrorMessage: string
  }
  reviewTextField?: {
    label: string
    requiredErrorMessage: string
  }
  privacyPolicyCheckboxField?: {
    label: string
    requiredErrorMessage: string
  }
  cancelButtonLabel?: string
  submitButtonLabel?: string
  loading?: boolean
  onSubmit: (data: ReviewModalFormData) => void
  onCancel: () => void
}

export interface ReviewModalFormData {
  rating: number
  title: string
  reviewerName: string
  text: string
  privacyPolicy: boolean
}

function ReviewModalForm({
  product,
  ratingField = {
    label: 'Rate the product from 1 to 5 stars',
    requiredErrorMessage: 'This field is required',
  },
  reviewTitleField = {
    label: 'Headline',
    requiredErrorMessage: 'This field is required',
  },
  reviewerNameField = {
    label: 'Name',
    requiredErrorMessage: 'This field is required',
  },
  reviewTextField = {
    label:
      'Share your thoughts about the product. How would you describe its quality?',
    requiredErrorMessage: 'This field is required',
  },
  privacyPolicyCheckboxField = {
    label:
      'I confirm that I agree to the Privacy Policy, Terms of Use, and Terms of Service. I acknowledge that my review may be used for marketing purposes by the company or its partners. I understand that my rating and review may be visible publicly, may include a “Verified buyer” badge, and that my data may be associated with my review.',
    requiredErrorMessage: 'This field is required',
  },
  cancelButtonLabel = 'Cancel',
  submitButtonLabel = 'Submit your review',
  loading,
  onSubmit,
  onCancel,
}: ReviewModalFormProps) {
  const [values, setValues] = useState<ReviewModalFormData>({
    rating: 0,
    title: '',
    reviewerName: '',
    text: '',
    privacyPolicy: false,
  })

  const [errors, setErrors] = useState<
    Record<keyof ReviewModalFormData, string | undefined>
  >({
    rating: undefined,
    title: undefined,
    reviewerName: undefined,
    text: undefined,
    privacyPolicy: undefined,
  })

  const refs = {
    rating: useRef<HTMLUListElement>(null),
    title: useRef<HTMLInputElement>(null),
    reviewerName: useRef<HTMLInputElement>(null),
    text: useRef<HTMLTextAreaElement>(null),
    privacyPolicy: useRef<HTMLInputElement>(null),
  }

  const errorMessages = {
    rating: ratingField.requiredErrorMessage,
    title: reviewTitleField.requiredErrorMessage,
    reviewerName: reviewerNameField.requiredErrorMessage,
    text: reviewTextField.requiredErrorMessage,
    privacyPolicy: privacyPolicyCheckboxField.requiredErrorMessage,
  }

  const isValidValue = useCallback(
    <T extends keyof ReviewModalFormData>(
      field: T,
      value: ReviewModalFormData[T]
    ): boolean => {
      switch (field) {
        case 'rating':
          return typeof value === 'number' && value > 0
        case 'title':
        case 'reviewerName':
        case 'text':
          return typeof value === 'string' && value.trim().length > 0
        case 'privacyPolicy':
          return !!value
        default:
          return false
      }
    },
    []
  )

  const validateField = useCallback(
    (field: keyof ReviewModalFormData): boolean => {
      const value = values[field]
      const isValid = isValidValue(field, value)

      setErrors((prev) => ({
        ...prev,
        [field]: isValid ? undefined : errorMessages[field],
      }))

      return isValid
    },
    [values, errorMessages, isValidValue]
  )

  const setValue = useCallback(
    <T extends keyof ReviewModalFormData>(
      field: T,
      value: ReviewModalFormData[T]
    ) => {
      setValues((prev) => ({
        ...prev,
        [field]: value,
      }))

      const isValid = isValidValue(field, value)

      setErrors((prev) => ({
        ...prev,
        [field]: isValid ? undefined : errorMessages[field],
      }))
    },
    [errorMessages, isValidValue]
  )

  const validateForm = useCallback((): boolean => {
    const fields = Object.keys(values) as Array<keyof ReviewModalFormData>
    const results = fields.map((field) => ({
      field,
      isValid: validateField(field),
    }))

    const firstInvalidField = results.find((r) => !r.isValid)?.field
    const isValid = !firstInvalidField

    if (firstInvalidField && refs[firstInvalidField]?.current) {
      if (firstInvalidField && refs[firstInvalidField]?.current) {
        // Handle special scrolling for certain fields
        if (
          firstInvalidField === 'privacyPolicy' ||
          firstInvalidField === 'rating'
        ) {
          refs[firstInvalidField].current?.scrollIntoView()
        }
        refs[firstInvalidField].current?.focus()
      }
    }

    return isValid
  }, [values, errorMessages, isValidValue, refs])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(values)
    }
  }

  return (
    <form onSubmit={handleSubmit} data-fs-review-modal-form>
      <UIModalBody data-fs-review-modal-body data-fs-review-modal-step="form">
        <ProductThumbnail
          image={{
            src: product.image?.url,
            alt: product.image?.alternateName,
          }}
          title={product.name}
        />

        <UIRatingField
          id="review-modal-rating"
          label={ratingField.label}
          error={errors.rating}
          value={values.rating}
          onChange={(value) => setValue('rating', value)}
          ratingRef={refs.rating}
        />

        <UIInputField
          id="review-modal-review-title"
          label={reviewTitleField.label}
          error={errors.title}
          value={values.title}
          onChange={(e) => setValue('title', e.target.value)}
          onBlur={() => validateField('title')}
          inputRef={refs.title}
          name="reviewTitle"
        />

        <UIInputField
          id="review-modal-reviewer-name"
          label={reviewerNameField.label}
          error={errors.reviewerName}
          value={values.reviewerName}
          onChange={(e) => setValue('reviewerName', e.target.value)}
          onBlur={() => validateField('reviewerName')}
          inputRef={refs.reviewerName}
          name="reviewerName"
        />

        <UITextareaField
          id="review-modal-review-text"
          label={reviewTextField.label}
          error={errors.text}
          value={values.text}
          onChange={(e) => setValue('text', e.target.value)}
          onBlur={() => validateField('text')}
          textareaRef={refs.text}
          name="reviewText"
          resize="none"
          rows={10}
        />

        <UICheckboxField
          id="review-modal-privacy-policy"
          label={privacyPolicyCheckboxField.label}
          error={errors.privacyPolicy}
          checked={values.privacyPolicy}
          onChange={(e) => setValue('privacyPolicy', e.target.checked)}
          checkboxRef={refs.privacyPolicy}
          name="privacyPolicy"
          alignment="top"
        />
      </UIModalBody>

      <UIModalFooter data-fs-review-modal-footer>
        <UIButton variant="secondary" onClick={() => onCancel()} type="button">
          {cancelButtonLabel}
        </UIButton>
        <UIButton variant="primary" type="submit" loading={loading}>
          {submitButtonLabel}
        </UIButton>
      </UIModalFooter>
    </form>
  )
}

export default ReviewModalForm
