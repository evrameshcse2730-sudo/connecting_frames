import React from "react";
import "./FormFields.css";

export function Field({ field, value, onChange }) {
  const [key, label, type = "text", options] = field;
  const id = `f-${key}-${React.useId()}`;

  let input;
  if (type === "textarea") {
    input = <textarea id={id} rows={4} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
  } else if (type === "select") {
    input = (
      <select id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  } else if (type === "number") {
    input = (
      <input
        id={id}
        type="number"
        value={value ?? 0}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      />
    );
  } else {
    input = (
      <input
        id={id}
        type="text"
        inputMode={type === "url" ? "url" : undefined}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <div className="ad-field">
      <label htmlFor={id}>{label}</label>
      {input}
    </div>
  );
}

function Preview({ item }) {
  if (!item.url || !/^https:\/\//i.test(item.url)) return null;
  if (item.type === "video") {
    return <video className="ad-preview" src={item.url} controls muted preload="metadata" />;
  }
  return (
    <a className="ad-link" href={item.url} target="_blank" rel="noopener noreferrer">
      Open website ↗
    </a>
  );
}

export function ListEditor({ list, items, onChange }) {
  const update = (i, value) => onChange(items.map((it, j) => (j === i ? value : it)));
  const remove = (i) => {
    if (window.confirm(`Remove this ${list.itemLabel.toLowerCase()}?`)) {
      onChange(items.filter((_, j) => j !== i));
    }
  };
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const add = () =>
    onChange([...items, typeof list.newItem === "object" ? { ...list.newItem } : list.newItem]);

  return (
    <div className="ad-list">
      {items.map((item, i) => (
        <div className={`ad-item ${list.type === "strings" ? "ad-item-inline" : ""}`} key={i}>
          <div className="ad-item-head">
            <strong>
              {list.itemLabel} {i + 1}
            </strong>
            <div className="ad-item-actions">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                ↑
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">
                ↓
              </button>
              <button type="button" className="ad-danger" onClick={() => remove(i)} aria-label="Remove">
                ✕
              </button>
            </div>
          </div>

          {list.type === "strings" ? (
            <input type="text" value={item} onChange={(e) => update(i, e.target.value)} aria-label={`${list.itemLabel} ${i + 1}`} />
          ) : (
            <>
              <div className="ad-grid">
                {list.fields.map((f) => (
                  <Field key={f[0]} field={f} value={item[f[0]]} onChange={(v) => update(i, { ...item, [f[0]]: v })} />
                ))}
              </div>
              {list.preview && <Preview item={item} />}
            </>
          )}
        </div>
      ))}

      <button type="button" className="ad-add" onClick={add}>
        + Add {list.itemLabel.toLowerCase()}
      </button>
    </div>
  );
}
