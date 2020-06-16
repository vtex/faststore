import React from "react"
import PropTypes from "prop-types"
import { IntlProvider } from "react-intl"

import "./global.css"

import Header from "./header"
import { Outer } from "ui"
import SEO from "components/seo"

export * from "./crystallize-fragments"

const Layout = ({ headerItems, children, title }) => {
  return (
    <IntlProvider locale="en">
      <SEO title={title} />
      <Header headerItems={headerItems} />
      <main>{children}</main>
      <footer style={{ margin: "2rem 0" }}>
        <Outer>
          Built with
          {` `}
          <a href="https://www.crystallize.com">Crystallize</a>
          {` `}| Powered by
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </Outer>
      </footer>
    </IntlProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
