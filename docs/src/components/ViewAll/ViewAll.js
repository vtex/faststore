import React from 'react'
import styles from './ViewAll.module.css'
import Link from '@docusaurus/Link'

const ViewAll = ({message, linkTo}) => {
    return (
        <Link to={linkTo} className={styles.viewAll}>
            {message}
            <svg
                id="arrow"
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="16"
                viewBox="0 0 16 16"
            >
                <g fill="#f71963">
                    <path d="M 3.79311 2 L 9.79311 8 L 3.79311 14 L 5.20711 15.414 L 11.9141 8.707 C 12.3045 8.3165 12.3045 7.6835 11.9141 7.293 L 5.20711 0.586 Z"></path>
                </g>
            </svg>
        </Link>
    );
};


export default ViewAll;
