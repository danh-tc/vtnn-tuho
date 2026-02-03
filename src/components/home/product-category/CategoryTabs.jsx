"use client";

import React, { useState, useRef, useEffect } from "react";
import { LuChevronDown } from "react-icons/lu";

const CategoryTabs = ({ categories, activeTab, onTabChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeCategory = categories.find((cat) => cat.id === activeTab);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id) => {
    onTabChange(id);
    setIsOpen(false);
  };

  return (
    <div className="category-tabs">
      <div className="tabs-desktop">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`tab-btn ${activeTab === cat.id ? "active" : ""}`}
            onClick={() => onTabChange(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="tabs-mobile" ref={dropdownRef}>
        <div
          className={`mobile-select-header ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="selected-label">{activeCategory?.label}</span>
          <LuChevronDown className={`arrow-icon ${isOpen ? "rotate" : ""}`} />
        </div>

        {isOpen && (
          <div className="mobile-select-options">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`option-item ${activeTab === cat.id ? "selected" : ""}`}
                onClick={() => handleSelect(cat.id)}
              >
                {cat.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryTabs;
