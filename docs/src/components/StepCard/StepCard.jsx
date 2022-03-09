import React from "react";

import styles from "./StepCard.module.css";

const StepCard = ({ children, home = false }) => (
  <div className={home ? styles.homeGrid : styles.stepCard}>{children}</div>
);

export default StepCard;