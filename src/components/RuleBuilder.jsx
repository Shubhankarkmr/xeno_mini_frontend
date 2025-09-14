import React from "react";

export default function RuleRow({ rule, index, onChange, onRemove }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(index, { ...rule, [name]: value });
  };

  return (
    <div className="rule-row">
      <select name="field" value={rule.field} onChange={handleChange}>
        <option value="spend">Spend</option>
        <option value="visits">Visits</option>
        <option value="inactiveDays">Inactive Days</option>
      </select>

      <select name="operator" value={rule.operator} onChange={handleChange}>
        <option value=">">{">"}</option>
        <option value="<">{"<"}</option>
        <option value="=">=</option>
      </select>

      <input
        type="number"
        name="value"
        value={rule.value}
        onChange={handleChange}
      />

      {index > 0 && (
        <select
          name="logic"
          value={rule.logic}
          onChange={handleChange}
          className="logic-select"
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
      )}

      <button type="button" className="remove-btn" onClick={() => onRemove(index)}>
        ❌
      </button>
    </div>
  );
}
