import React from "react";

import styles from "./IconGrid.module.css";

const IconGrid = ({ children }) => (
  <div className={styles.homeGrid}>{children}</div>
);

export default IconGrid;