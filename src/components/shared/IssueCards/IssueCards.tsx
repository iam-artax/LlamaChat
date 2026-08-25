import styles from "./IssueCards.module.css";
import type { Issue } from "@/types/issue";

type IssueCardsProps = {
  issue: Issue;
};

export default function IssueCards({ issue }: IssueCardsProps) {
  return (
    <div className={styles.issueCard}>
      <p className={styles.issueTitle}>{issue.title}</p>

      <p className={styles.issuePriority}>
        {issue.priority}
      </p>

      <p className={styles.issueStatus}>
        {issue.status}
      </p>

      <p className={styles.issueCreatedat}>
        {issue.createdAt.toDateString()}
      </p>
    </div>
  );
}