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
  // TODO: Change this prop to `required` once all the components are updated with the new PropsSection
  propsList?: RowItem[]
}

const PropsSection = ({ propsList }) => {
  return (
    <section className={styles.propsSection}>
      <table>
        <colgroup>
          <col data-nx-props-section-name />
          <col data-nx-props-section-type />
          <col data-nx-props-section-description />
          <col data-nx-props-section-default />
        </colgroup>
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
                      {prop.required && <span title="Required">*</span>}
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
                  <td data-nx-props-section-description>{prop.description}</td>
                  <td data-nx-props-section-default>
                    {prop.default && <code>{prop.default}</code>}
                  </td>
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
    </section>
  )
}

export default PropsSection
