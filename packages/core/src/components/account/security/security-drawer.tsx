import { useState } from 'react'
import {
  Button,
  Icon,
  IconButton,
  Input,
  SlideOver,
  SlideOverHeader,
  useFadeEffect,
} from '@faststore/ui'

import styles from './security.module.scss'

type SecurityDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

const ERROR_COLOR = '#940303'
const SUCCESS_COLOR = '#015132'

const RULES = [
  { label: '8 characters', test: (v: string) => v.length >= 8 },
  { label: '1 uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { label: '1 lowercase letter', test: (v: string) => /[a-z]/.test(v) },
  { label: '1 number', test: (v: string) => /\d/.test(v) },
]

const initialRules = RULES.map((rule) => ({
  label: rule.label,
  color: ERROR_COLOR,
}))

export const SecurityDrawer = ({ isOpen, onClose }: SecurityDrawerProps) => {
  const { fade, fadeOut } = useFadeEffect()

  const [currentPassword, setCurrentPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [newPasswordRules, setNewPasswordRules] = useState(initialRules)

  const onChangeCurrentPassword = (value: string) => {
    setCurrentPassword(value)
  }

  const onChangeNewPassword = (value: string) => {
    setNewPassword(value)

    const updatedRules = RULES.map((rule) => ({
      label: rule.label,
      color: rule.test(value) ? SUCCESS_COLOR : ERROR_COLOR,
    }))

    setNewPasswordRules(updatedRules)
  }

  const handleClose = () => {
    setCurrentPassword('')
    setShowCurrentPassword(false)

    setNewPassword('')
    setShowNewPassword(false)

    setNewPasswordRules(initialRules)
    onClose()
  }

  if (!isOpen) {
    return null
  }

  return (
    <SlideOver
      data-fs-security-drawer
      fade={fade}
      onDismiss={fadeOut}
      onTransitionEnd={() => fade === 'out' && onClose()}
      isOpen={isOpen}
      size="partial"
      direction="rightSide"
      overlayProps={{ className: `section ${styles.section}` }}
    >
      <SlideOverHeader data-fs-security-drawer-header onClose={onClose}>
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
              onChange={(e) => onChangeCurrentPassword(e.target.value)}
            />
            <IconButton
              data-fs-security-drawer-input-password-toggle
              size="small"
              aria-label="Show Password"
              icon={showCurrentPassword ? <EyeSlash /> : <Eye />}
              onClick={() => setShowCurrentPassword((prev) => !prev)}
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
              onChange={(e) => onChangeNewPassword(e.target.value)}
            />
            <IconButton
              data-fs-security-drawer-input-password-toggle
              size="small"
              aria-label="Show Password"
              icon={showNewPassword ? <EyeSlash /> : <Eye />}
              onClick={() => setShowNewPassword((prev) => !prev)}
            />
          </div>

          <div data-fs-security-drawer-input-password-rules-container>
            <p data-fs-security-drawer-input-password-rules-title>
              Your password must have at least:
            </p>

            <ul data-fs-security-drawer-input-password-rules-list>
              {newPasswordRules.map((rule, index) => (
                <li
                  key={index}
                  data-fs-security-drawer-input-password-rule-item
                  style={{ color: rule.color }}
                >
                  <Icon
                    name={rule.color === SUCCESS_COLOR ? 'Checked' : 'XCircle'}
                    width={20}
                    height={20}
                  />
                  {rule.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <footer data-fs-security-drawer-footer>
        <Button variant="tertiary" onClick={handleClose}>
          Cancel
        </Button>

        <Button
          data-fs-security-drawer-footer-button
          variant="primary"
          disabled={
            !currentPassword ||
            !newPassword ||
            newPasswordRules.some((rule) => rule.color === ERROR_COLOR)
          }
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

const Eye = () => (
  <svg
    data-fs-security-drawer-input-password-icon
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="#000000"
    viewBox="0 0 256 256"
  >
    <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
  </svg>
)

const EyeSlash = () => (
  <svg
    data-fs-security-drawer-input-password-icon
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="#000000"
    viewBox="0 0 256 256"
  >
    <path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z"></path>
  </svg>
)
