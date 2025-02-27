import styles from './section.module.scss'

import dynamic from 'next/dynamic'
import { type FormEvent, useRef, useState, useCallback } from 'react'
import { Image } from 'src/components/ui/Image'

const UIButton = dynamic(
  () =>
    import(/* webpackChunkName: "UIButton" */ '@faststore/ui').then(
      (mod) => mod.Button
    ),
  { ssr: false }
)

const UIAddReviewModalBody = dynamic(
  () =>
    import(/* webpackChunkName: "UIAddReviewModalBody" */ '@faststore/ui').then(
      (mod) => mod.AddReviewModalBody
    ),
  { ssr: false }
)

const UIAddReviewModalFooter = dynamic(
  () =>
    import(
      /* webpackChunkName: "UIAddReviewModalFooter" */ '@faststore/ui'
    ).then((mod) => mod.AddReviewModalFooter),
  { ssr: false }
)

const UIProductThumbnail = dynamic(
  () =>
    import(/* webpackChunkName: "UIProductThumbnail" */ '@faststore/ui').then(
      (mod) => mod.ProductThumbnail
    ),
  { ssr: false }
)

const UIProductThumbnailImage = dynamic(
  () =>
    import(
      /* webpackChunkName: "UIProductThumbnailImage" */ '@faststore/ui'
    ).then((mod) => mod.ProductThumbnailImage),
  { ssr: false }
)

const UIProductThumbnailTitle = dynamic(
  () =>
    import(
      /* webpackChunkName: "UIProductThumbnailTitle" */ '@faststore/ui'
    ).then((mod) => mod.ProductThumbnailTitle),
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

export interface AddReviewModalFormProps {
  product: {
    id: string
    name: string
    image?: { url: string; alternateName: string }
  }
  ratingField: {
    label: string
    requiredErrorMessage: string
  }
  reviewTitleField: {
    label: string
    requiredErrorMessage: string
  }
  reviewerNameField: {
    label: string
    requiredErrorMessage: string
  }
  reviewTextField: {
    label: string
    requiredErrorMessage: string
  }
  privacyPolicyCheckboxField: {
    label: string
    requiredErrorMessage: string
  }
  cancelButtonLabel: string
  submitButtonLabel: string
  loading?: boolean
  onSubmit: (data: AddReviewModalFormData) => void
  onCancel: () => void
}

export interface AddReviewModalFormData {
  rating: number
  title: string
  reviewerName: string
  text: string
  privacyPolicy: boolean
}

function AddReviewModalForm({
  product,
  ratingField,
  reviewTitleField,
  reviewerNameField,
  reviewTextField,
  privacyPolicyCheckboxField,
  cancelButtonLabel,
  submitButtonLabel,
  loading,
  onSubmit,
  onCancel,
}: AddReviewModalFormProps) {
  const [values, setValues] = useState<AddReviewModalFormData>({
    rating: 0,
    title: '',
    reviewerName: '',
    text: '',
    privacyPolicy: false,
  })

  const [errors, setErrors] = useState<
    Record<keyof AddReviewModalFormData, string | undefined>
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
    <T extends keyof AddReviewModalFormData>(
      field: T,
      value: AddReviewModalFormData[T]
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
    (field: keyof AddReviewModalFormData): boolean => {
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
    <T extends keyof AddReviewModalFormData>(
      field: T,
      value: AddReviewModalFormData[T]
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
    const fields = Object.keys(values) as Array<keyof AddReviewModalFormData>
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
    <form onSubmit={handleSubmit} className={styles.addReviewModalForm}>
      <UIAddReviewModalBody className={styles.addReviewModalBody}>
        <UIProductThumbnail>
          <UIProductThumbnailImage>
            <Image
              src={product.image?.url}
              alt={product.image?.alternateName}
              width={50}
              height={50}
            />
          </UIProductThumbnailImage>
          <UIProductThumbnailTitle>{product.name}</UIProductThumbnailTitle>
        </UIProductThumbnail>

        <UIRatingField
          id="add-review-modal-rating"
          label={ratingField.label}
          error={errors.rating}
          value={values.rating}
          onChange={(value) => setValue('rating', value)}
          ratingRef={refs.rating}
        />

        <UIInputField
          id="add-review-modal-review-title"
          label={reviewTitleField.label}
          error={errors.title}
          value={values.title}
          onChange={(e) => setValue('title', e.target.value)}
          onBlur={() => validateField('title')}
          inputRef={refs.title}
          name="reviewTitle"
        />

        <UIInputField
          id="add-review-modal-reviewer-name"
          label={reviewerNameField.label}
          error={errors.reviewerName}
          value={values.reviewerName}
          onChange={(e) => setValue('reviewerName', e.target.value)}
          onBlur={() => validateField('reviewerName')}
          inputRef={refs.reviewerName}
          name="reviewerName"
        />

        <UITextareaField
          id="add-review-modal-review-text"
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
          id="add-review-modal-privacy-policy"
          label={privacyPolicyCheckboxField.label}
          error={errors.privacyPolicy}
          checked={values.privacyPolicy}
          onChange={(e) => setValue('privacyPolicy', e.target.checked)}
          checkboxRef={refs.privacyPolicy}
          name="privacyPolicy"
          alignment="top"
        />
      </UIAddReviewModalBody>

      <UIAddReviewModalFooter className={styles.addReviewModalFooter}>
        <UIButton variant="secondary" onClick={() => onCancel()} type="button">
          {cancelButtonLabel}
        </UIButton>
        <UIButton variant="primary" type="submit" loading={loading}>
          {submitButtonLabel}
        </UIButton>
      </UIAddReviewModalFooter>
    </form>
  )
}

export default AddReviewModalForm
