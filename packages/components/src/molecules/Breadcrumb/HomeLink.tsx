import { House, Icon, Link } from "../..";
import React from "react";

const HomeLink = () => (
  <Link
    data-fs-breadcrumb-link
    data-fs-breadcrumb-link-home
    aria-label="Go to homepage"
    href="/"
  >
    <Icon component={<House size={18} />} />
  </Link>
)

export default HomeLink
