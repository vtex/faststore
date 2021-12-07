import React from "react";

import styles from "./CardGrid.module.css";

const CardGrid = ({ children, home = false }) => (
  <div className={home ? styles.homeGrid : styles.cardGrid}>{children}</div>
);

export default CardGrid;