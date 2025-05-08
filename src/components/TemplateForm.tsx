import { TemplateFormProps } from "../pages/DirectiveTypes";
import React, { useState } from "react";

const TemplateForm: React.FC<TemplateFormProps> = ({ template, onSubmit }) => {
  const parts = template.split(/(\[.*?\])/g).filter(Boolean);
  const [inputs, setInputs] = useState<string[]>(Array(parts.filter(p => p.startsWith("[")).length).fill(""));

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handleFormSubmit = () => {
    if (template === " ") {
      onSubmit(inputs[0]?.trim() || "");
    } else {
      let inputIdx = 0;
      const filled = parts.map(part => {
        if (part.startsWith("[") && part.endsWith("]")) {
          return inputs[inputIdx++] || "";
        }
        return part;
      }).join("");

      onSubmit(filled.trim());
    }
  };

  if (template === " ") {
    return (
      <div style={{ marginTop: "10px", border: "1px dashed #ccc", padding: "10px" }}>
        <textarea
          placeholder="Wpisz treść paragrafu"
          onChange={(e) => setInputs([e.target.value])}
          value={inputs[0]}
          style={{ width: "100%", height: "100px" }}
        />
        <button onClick={handleFormSubmit} style={{ marginTop: "10px" }}>
          Dodaj paragraf
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "10px", border: "1px dashed #ccc", padding: "10px" }}>
      <div>
        {parts.map((part, idx) => {
          if (part.startsWith("[") && part.endsWith("]")) {
            const inputIndex = parts.slice(0, idx).filter(p => p.startsWith("[")).length;
            return (
              <input
                key={idx}
                type="text"
                placeholder={part.slice(1, -1)}
                value={inputs[inputIndex]}
                onChange={(e) => handleInputChange(inputIndex, e.target.value)}
                style={{ margin: "0 5px" }}
              />
            );
          } else {
            return <span key={idx}>{part}</span>;
          }
        })}
      </div>
      <button onClick={handleFormSubmit} style={{ marginTop: "10px" }}>
        Dodaj paragraf
      </button>
    </div>
  );
};

export default TemplateForm;