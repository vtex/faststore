import { useState } from 'react'
import {
  Button,
  Icon,
  IconButton,
  Input,
  SlideOver,
  SlideOverHeader,
  useFadeEffect,
  useUI,
} from '@faststore/ui'

import { useSetPassword } from 'src/sdk/account/useSetPassword'
import styles from './styles.module.scss'

type SecurityDrawerProps = {
  userEmail: string
  isOpen: boolean
  onClose: () => void
  accountName?: string
}

const validations = [
  { label: '8 characters', test: (v: string) => v.length >= 8 },
  { label: '1 uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { label: '1 lowercase letter', test: (v: string) => /[a-z]/.test(v) },
  { label: '1 number', test: (v: string) => /\d/.test(v) },
]

export const SecurityDrawer = ({
  userEmail,
  accountName,
  isOpen,
  onClose,
}: SecurityDrawerProps) => {
  const { fade, fadeOut } = useFadeEffect()
  const { pushToast } = useUI()

  const [currentPassword, setCurrentPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [formError, setFormError] = useState<string | null>(null)

  const { setPassword, loading, error } = useSetPassword(accountName)

  const newPasswordValidations = validations.map((rule) => ({
    label: rule.label,
    isValid: rule.test(newPassword),
  }))

  const allValid = newPasswordValidations.every((r) => r.isValid)

  const handleClose = () => {
    setFormError(null)
    setCurrentPassword('')
    setShowCurrentPassword(false)
    setNewPassword('')
    setShowNewPassword(false)
    onClose()
  }

  const handleSetPassword = async () => {
    if (!userEmail) {
      setFormError('Email is required to set a new password.')
      return
    }

    if (!newPassword || !currentPassword) {
      setFormError('All fields are required to set a new password.')
      return
    }

    if (newPassword === currentPassword) {
      setFormError('New password cannot be the same as the current password.')
      return
    }

    try {
      const data = await setPassword({
        userEmail,
        currentPassword,
        newPassword,
      })

      if (error) {
        throw error
      }

      if (!data.success) {
        pushToast({
          title: 'Error setting password',
          status: 'ERROR',
          message: `Failed to set password: ${data.message}`,
          icon: <Icon width={30} height={30} name="CircleWavyWarning" />,
        })

        return
      }

      if (data.success) {
        pushToast({
          title: 'Success setting password',
          status: 'INFO',
          message: 'Password updated successfully',
          icon: <Icon width={30} height={30} name="CircleWavyCheck" />,
        })

        handleClose()
      }
    } catch (error) {
      console.error('Error setting password:', error)
      pushToast({
        title: 'Error setting password',
        status: 'ERROR',
        message: 'Failed to set password.',
        icon: <Icon width={30} height={30} name="CircleWavyWarning" />,
      })
    }
  }

  return (
    <SlideOver
      data-fs-security-drawer
      fade={fade}
      onDismiss={fadeOut}
      onTransitionEnd={() => fade === 'out' && handleClose()}
      isOpen={isOpen}
      size="partial"
      direction="rightSide"
      overlayProps={{ className: styles.section }}
    >
      <SlideOverHeader data-fs-security-drawer-header onClose={handleClose}>
        <h1 data-fs-security-drawer-header-title>Reset password</h1>
      </SlideOverHeader>

      <div data-fs-security-drawer-body>
        <div data-fs-security-drawer-body-form>
          <div data-fs-security-drawer-body-current-password>
            <Input
              data-fs-security-drawer-input
              id="security-drawer-input-current-password"
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder="Current Password"
              inputMode="text"
              value={currentPassword}
              onChange={(e) => {
                setFormError(null)
                setCurrentPassword(e.target.value)
              }}
            />
            <IconButton
              data-fs-security-drawer-input-password-toggle
              size="small"
              aria-label="Show Password"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              icon={
                showCurrentPassword ? (
                  <Icon name="EyeSlash" />
                ) : (
                  <Icon name="Eye" />
                )
              }
            />
          </div>

          <div data-fs-security-drawer-body-new-password>
            <Input
              data-fs-security-drawer-input
              id="security-drawer-input-new-password"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="New Password"
              inputMode="text"
              value={newPassword}
              onChange={(e) => {
                setFormError(null)
                setNewPassword(e.target.value)
              }}
            />
            <IconButton
              data-fs-security-drawer-input-password-toggle
              size="small"
              aria-label="Show Password"
              onClick={() => setShowNewPassword((prev) => !prev)}
              icon={
                showNewPassword ? <Icon name="EyeSlash" /> : <Icon name="Eye" />
              }
            />
          </div>

          {formError && (
            <div data-fs-security-drawer-error>
              <Icon
                width={20}
                height={20}
                name="CircleWavyWarning"
                data-fs-security-drawer-error-icon
              />
              <span>{formError}</span>
            </div>
          )}

          {newPassword.length > 0 && (
            <div data-fs-security-drawer-input-password-rules-container>
              <p data-fs-security-drawer-input-password-rules-title>
                Your password must have at least:
              </p>

              <ul data-fs-security-drawer-input-password-rules-list>
                {newPasswordValidations.map((rule, index) => (
                  <li
                    key={index}
                    data-fs-security-drawer-input-password-rule-item
                    data-status={rule.isValid ? 'success' : 'error'}
                  >
                    <Icon
                      name={rule.isValid ? 'CheckCircle' : 'XCircle'}
                      width={20}
                      height={20}
                    />
                    {rule.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <footer data-fs-security-drawer-footer>
        <Button variant="tertiary" onClick={handleClose}>
          Cancel
        </Button>

        <Button
          data-fs-security-drawer-footer-button
          variant="primary"
          loading={loading}
          disabled={loading || !currentPassword || !newPassword || !allValid}
          onClick={handleSetPassword}
        >
          Save Password
        </Button>
      </footer>
    </SlideOver>
  )
}
