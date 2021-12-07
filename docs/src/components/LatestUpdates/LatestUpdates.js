import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./LatestUpdates.module.css";
import tinytime from 'tinytime'

const LatestUpdates = () => {
  const formatDate = tinytime('{MM} {DD}, {YYYY}').render
  const { siteConfig } = useDocusaurusContext();
  const release = JSON.parse(JSON.stringify(siteConfig.customFields.events));

  return (
    <section>
      <ul className={styles.changelogList}>
        {release.map((item, i) => (
          <li key={item.title}>
            <a href={`/releases/${item.fileName.split("-")
              .slice(0, 3)
              .join("/")}/${item.fileName.split("-").slice(3).join("-")}`} >
              <div className={styles.changelogTitle}>
                <h4>{item.title}</h4>
                {item.product === "FastStore" && (
                  <p className={styles.faststore}>{item.product}</p>
                )}
                {item.product === "WebOps" && (
                  <p className={styles.webops}>{item.product}</p>
                )}
              </div>

              <p className={styles.descriptionChangelog}>
                {item.description}
              </p>
              <time>
                <svg
                  viewBox="0 0 12 12"
                  className={styles.listIcon}
                >
                  <circle cx="6" cy="6" r="6" fill="currentColor" />
                  {i === 0 && (
                    <circle
                      cx="6"
                      cy="6"
                      r="11"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  )}
                  {i !== 0 && (
                    <path
                      d="M 6 -6 V -200"
                      fill="none"
                      strokeWidth="2"
                      stroke="currentColor"
                    />
                  )}
                  {i !== release.length - 1 && (
                    <path
                      d="M 6 18 V 300"
                      fill="none"
                      strokeWidth="2"
                      stroke="currentColor"
                    />
                  )}
                </svg>
                {formatDate(new Date(item.fileName.slice(0, 10)))}
                
              </time>

            </a>

          </li>
        ))}
      </ul>
    </section>
  );
};

export default LatestUpdates;