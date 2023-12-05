// IssueWidget.tsx
import React, { useState } from 'react';

interface IssueWidgetProps {
  onAddIssue: (issue: string, description: string) => void;
  addedIssues: { issue: string; description: string }[];
}

const IssueEntryForm: React.FC<{ onAddIssue: (issue: string, description: string) => void }> = ({ onAddIssue }) => {
  const [issue, setIssue] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleAddIssue = (e: React.FormEvent) => {
    e.preventDefault();
    onAddIssue(issue, description);
    setIssue('');
    setDescription('');
  };

  return (
    <form onSubmit={handleAddIssue}>
      <label>
        Issue:
        <input type="text" value={issue} onChange={(e) => setIssue(e.target.value)} />
      </label>
      <label>
        Description:
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <button type="submit">Add Issue</button>
    </form>
  );
};

const AddedIssuesList: React.FC<{ addedIssues: { issue: string; description: string }[] }> = ({ addedIssues }) => {
  return (
    <div>
      <h3>Added Issues:</h3>
      <ul>
        {addedIssues.map((issue, index) => (
          <li key={index}>
            <strong>{issue.issue}:</strong> {issue.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

const IssueWidget: React.FC<IssueWidgetProps> = ({ onAddIssue, addedIssues }) => {
  return (
    <div>
      <h2>Issue Widget</h2>
      <IssueEntryForm onAddIssue={onAddIssue} />
      <AddedIssuesList addedIssues={addedIssues} />
    </div>
  );
};

export default IssueWidget;
