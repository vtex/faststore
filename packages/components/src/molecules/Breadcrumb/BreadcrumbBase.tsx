import React, {
  cloneElement,
  forwardRef,
  ReactElement,
  ReactNode,
  useCallback,
} from 'react'
import Icon from '../../atoms/Icon'
import Link from '../../atoms/Link'
import Dropdown, {
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '../Dropdown'
import BreadcrumbPure, { BreadcrumbPureProps } from './BreadcrumbPure'

type ItemElement = {
  item: string
  name: string
  position: number
}

type RenderLinkProps = {
  /**
   * Item prop for specific item.
   */
  itemProps: ItemElement
  /**
   * Represents if the item is collapsed or not.
   */
  collapsed: boolean
}

export interface BreadcrumbBaseProps extends BreadcrumbPureProps {
  /**
   * Array of ItemElement that represents each breadcrumb item.
   */
  breadcrumbList: ItemElement[]
  /**
   * Represents if is Desktop os mobile.
   */
  isDesktop?: boolean
  /**
   * Link go to home.
   */
  homeLink?: ReactElement
  /**
   * Icon for dropdown button.
   */
  dropdownButtonIcon?: ReactNode
  /**
   * Icon for collapsed items.
   */
  collapsedItemsIcon?: ReactNode
  /**
   * Function to render a item as breadcrumb link.
   * @param renderLinkProps Properties for each item to be rendered.
   * @returns Link to be rendered.
   */
  renderLink?: (renderLinkProps: RenderLinkProps) => ReactElement
}

const BreadcrumbBase = forwardRef<HTMLDivElement, BreadcrumbBaseProps>(
  function BreadcrumbBase(
    {
      children,
      divider: rawDivider = '',
      testId = 'fs-breadcrumb',
      breadcrumbList,
      isDesktop = false,
      renderLink,
      homeLink,
      dropdownButtonIcon = <Icon name="DotsThree" />,
      collapsedItemsIcon = (
        <Icon data-fs-dropdown-item-icon name="ArrowElbowDownRight" />
      ),
      ...otherProps
    },
    ref
  ) {
    const firstItem = isDesktop ? breadcrumbList[0] : null
    const mediumItems = isDesktop
      ? breadcrumbList.slice(1, -2)
      : breadcrumbList.slice(0, -2)

    const lastItems = breadcrumbList.slice(-2)

    const collapseBreadcrumb = breadcrumbList.length > 4

    const breadcrumbLink = useCallback(
      (renderLinkProps: RenderLinkProps) => {
        const breadcrumbItem = renderLink?.(renderLinkProps)
        const itemProps = renderLinkProps.collapsed
          ? {
              'data-fs-breadcrumb-dropdown-link': true,
            }
          : {
              'data-fs-breadcrumb-link': true,
            }
        return breadcrumbItem ? (
          cloneElement(breadcrumbItem, {
            ...itemProps,
            key: renderLinkProps.itemProps.position,
          })
        ) : (
          <Link
            {...itemProps}
            href={renderLinkProps.itemProps.item}
            key={renderLinkProps.itemProps.position}
          >
            {renderLinkProps.itemProps.name}
          </Link>
        )
      },
      [renderLink]
    )

    return (
      <BreadcrumbPure
        ref={ref}
        data-fs-breadcrumb-is-desktop={isDesktop}
        {...otherProps}
      >
        {homeLink}

        {!collapseBreadcrumb &&
          breadcrumbList.map((item, index) => {
            return breadcrumbList.length === index + 1 ? (
              <span key={String(item.position)}>{item.name}</span>
            ) : (
              breadcrumbLink({ itemProps: item, collapsed: false })
            )
          })}

        {collapseBreadcrumb &&
          firstItem &&
          breadcrumbLink({ itemProps: firstItem, collapsed: false })}

        {collapseBreadcrumb && (
          <Dropdown>
            <DropdownButton
              aria-label="View More"
              data-fs-breadcrumb-dropdown-button
              size="small"
            >
              {dropdownButtonIcon}
            </DropdownButton>
            <DropdownMenu data-fs-breadcrumb-dropdown-menu>
              {mediumItems.map((item) => (
                <DropdownItem
                  data-fs-breadcrumb-dropdown-item
                  key={String(item.position)}
                  icon={collapsedItemsIcon}
                >
                  {breadcrumbLink({ itemProps: item, collapsed: true })}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        )}

        {collapseBreadcrumb &&
          lastItems.map((item, index) => {
            return lastItems.length === index + 1 ? (
              <span key={String(item.position)}>{item.name}</span>
            ) : (
              breadcrumbLink({ itemProps: item, collapsed: false })
            )
          })}
      </BreadcrumbPure>
    )
  }
)

export default BreadcrumbBase
