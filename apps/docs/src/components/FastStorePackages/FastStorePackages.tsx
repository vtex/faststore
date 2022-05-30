import React from "react";

import styles from "./FastStorePackages.module.css";

const FastStorePackages = ({ children }) => (
  <div className={styles.homeGrid}>{children}</div>
);

export default FastStorePackages;