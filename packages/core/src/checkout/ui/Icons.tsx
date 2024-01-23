import React from 'react'

type Props = React.SVGProps<SVGSVGElement>

export const SearchIcon = ({ ...props }: Props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14.2939 12.5786H13.3905L13.0703 12.2699C14.191 10.9663 14.8656 9.27387 14.8656 7.43282C14.8656 3.32762 11.538 0 7.43282 0C3.32762 0 0 3.32762 0 7.43282C0 11.538 3.32762 14.8656 7.43282 14.8656C9.27387 14.8656 10.9663 14.191 12.2699 13.0703L12.5786 13.3905V14.2939L18.2962 20L20 18.2962L14.2939 12.5786ZM7.43282 12.5786C4.58548 12.5786 2.28702 10.2802 2.28702 7.43282C2.28702 4.58548 4.58548 2.28702 7.43282 2.28702C10.2802 2.28702 12.5786 4.58548 12.5786 7.43282C12.5786 10.2802 10.2802 12.5786 7.43282 12.5786Z"
      fill="#545454"
    />
  </svg>
)

export const NavigationOutlinedIcon = ({ ...props }: Props) => (
  <svg
    width="16"
    height="19"
    viewBox="0 0 16 19"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      id="Vector (Stroke) (Stroke)"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.88785 11.2825L11.3323 14.5541L12.5285 4.97677L4.83236 10.8014L8.88785 11.2825ZM0.907804 12.3498L0.654272 11.4552L15.1004 0.522066L12.8551 18.4994L11.9536 18.7271L7.7996 13.1674L0.907804 12.3498Z"
      fill="#2953B2"
    />
  </svg>
)

export const NavigationFilledIcon = ({ ...props }: Props) => (
  <svg
    width="16"
    height="19"
    viewBox="0 0 16 19"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.907804 12.3498L0.654272 11.4552L15.1004 0.522066L12.8551 18.4994L11.9536 18.7271L7.7996 13.1674L0.907804 12.3498Z"
      fill="#2953B2"
    />
  </svg>
)
