const ListingSearchField = ({
  id = "listing-search",
  value,
  onChange,
  label = "חיפוש",
  placeholder = "מה אתם מחפשים?",
}) => (
  <div className="category-filter-field category-filter-field--wide">
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  </div>
);

export default ListingSearchField;
