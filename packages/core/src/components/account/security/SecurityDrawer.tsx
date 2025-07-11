import { useEffect, useState } from 'react'
import {
  Button,
  Icon,
  IconButton,
  Input,
  SlideOver,
  SlideOverHeader,
  useFadeEffect,
} from '@faststore/ui'

import styles from './styles.module.scss'

type SecurityDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

const validations = [
  { label: '8 characters', test: (v: string) => v.length >= 8 },
  { label: '1 uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { label: '1 lowercase letter', test: (v: string) => /[a-z]/.test(v) },
  { label: '1 number', test: (v: string) => /\d/.test(v) },
]

export const SecurityDrawer = ({ isOpen, onClose }: SecurityDrawerProps) => {
  const { fade, fadeOut } = useFadeEffect()

  const [currentPassword, setCurrentPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)

  const newPasswordValidations = validations.map((rule) => ({
    label: rule.label,
    isValid: rule.test(newPassword),
  }))

  const allValid = newPasswordValidations.every((r) => r.isValid)

  const handleClose = () => {
    setCurrentPassword('')
    setShowCurrentPassword(false)
    setNewPassword('')
    setShowNewPassword(false)
    onClose()
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
              onChange={(e) => setCurrentPassword(e.target.value)}
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
              onChange={(e) => setNewPassword(e.target.value)}
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
          disabled={!currentPassword || !newPassword || !allValid}
          onClick={() => {
            // TODO: Handle password save logic here
            console.log('Saving new password')
            handleClose()
          }}
        >
          Save Password
        </Button>
      </footer>
    </SlideOver>
  )
}
