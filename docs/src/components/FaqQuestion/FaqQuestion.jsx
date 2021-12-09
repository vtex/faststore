import React from "react";
import styles from "./FaqQuestion.module.css";

const FaqQuestion = ({ question, answer }) => {
    return (
        <details className={styles.FaqDetails}>
            <summary>{question}</summary>
            <p dangerouslySetInnerHTML={{__html: answer}} />
        </details>
    );
};

export default FaqQuestion;
