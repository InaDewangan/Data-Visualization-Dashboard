import React from "react";
import "./Filters.css";

const Filters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filters">
      <div className="filter-group">
        <label>Age:</label>
        <select name="age" value={filters.age} onChange={handleChange}>
          <option value="None">None</option>
          <option value="15-25">15-25</option>
          <option value="&gt;25">&gt;25</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Gender:</label>
        <select name="gender" value={filters.gender} onChange={handleChange}>
          <option value="None">None</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Start Date:</label>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label>End Date:</label>
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default Filters;
