import React from 'react'

import styles from './props-section.module.css'

export interface RowItem {
  name: string
  type: string | []
  description: string
  default: string
  required: boolean
}

export interface PropsSectionProps {
  propsList?: RowItem[]
}

const PropsSection = ({ propsList }) => {
  return (
    <table className={styles.propsSection}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Description</th>
          <th>Default</th>
        </tr>
      </thead>
      <tbody>
        {propsList ? (
          propsList.map((prop) => {
            return (
              <tr key={prop.name}>
                <td data-nx-props-section-name>
                  <strong>
                    {prop.name}
                    {prop.required && <span>*</span>}
                  </strong>
                </td>
                <td data-nx-props-section-type>
                  {prop.type instanceof Array ? (
                    <span>
                      {prop.type.map((option) => {
                        return <code key={option}>{option}</code>
                      })}
                    </span>
                  ) : (
                    <code>{prop.type}</code>
                  )}
                </td>
                <td>{prop.description}</td>
                <td>{prop.default && <code>{prop.default}</code>}</td>
              </tr>
            )
          })
        ) : (
          <tr>
            <td>Coming Soon</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default PropsSection
