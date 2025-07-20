import React from "react";

function EditableField({ label, name, value, isEditing, onChange, type = "text" }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {isEditing ? (
        name === "bio" ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded bg-white text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
            autoComplete="off"
          />
        ) : (
          <input
            name={name}
            value={value}
            onChange={onChange}
            type={type}
            className="w-full p-2 border border-gray-300 rounded bg-white text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
            autoComplete="off"
          />
        )
      ) : (
        <p className="text-gray-800">{value || `No ${label.toLowerCase()} available.`}</p>
      )}
    </div>
  );
}

export default EditableField;
