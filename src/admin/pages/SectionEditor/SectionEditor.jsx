import { Field, ListEditor } from "../../components/FormFields.jsx";

// Generic editor for one website section, driven by admin/config/sections.js
export default function SectionEditor({ section, value, onChange }) {
  return (
    <>
      <h1>{section.title}</h1>
      {section.hint && <p className="ad-muted">{section.hint}</p>}

      {section.rootList ? (
        <ListEditor list={section.rootList} items={value} onChange={onChange} />
      ) : (
        <>
          <div className="ad-card">
            {section.fields.map((f) => (
              <Field key={f[0]} field={f} value={value[f[0]]} onChange={(v) => onChange({ ...value, [f[0]]: v })} />
            ))}
          </div>
          {section.list && (
            <>
              <h2>{section.list.itemLabel}s</h2>
              <ListEditor
                list={section.list}
                items={value[section.list.key]}
                onChange={(items) => onChange({ ...value, [section.list.key]: items })}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
