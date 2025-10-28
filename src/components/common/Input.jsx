import "./input.css";
const Input = ({ label, type = "text", value, onChange, ...props }) => {
  return (
    <div className="common-input-group">
      {label && <label className="common-input-label">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="common-input-field"
        {...props}
      />
    </div>
  );
};

export default Input;
