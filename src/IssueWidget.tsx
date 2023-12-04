// IssueWidget.tsx
import React from 'react';

interface IssueWidgetProps {
  markers: { issue: string; description: string }[];
}

const IssueWidget: React.FC<IssueWidgetProps> = ({ markers }) => {
  const countByIssue: { [key: string]: number } = {};
  const descriptionsByIssue: { [key: string]: string[] } = {};

  // Count issues and collect descriptions
  markers.forEach((marker) => {
    const { issue, description } = marker;
    countByIssue[issue] = (countByIssue[issue] || 0) + 1;
    descriptionsByIssue[issue] = descriptionsByIssue[issue] || [];
    descriptionsByIssue[issue].push(description);
  });

  return (
    <div>
      <h2>Issue Widget</h2>
      <ul>
        {Object.keys(countByIssue).map((issue) => (
          <li key={issue}>
            <strong>{issue}:</strong> {countByIssue[issue]} issues
            <ul>
              {descriptionsByIssue[issue].map((description, index) => (
                <li key={index}>{description}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IssueWidget;
