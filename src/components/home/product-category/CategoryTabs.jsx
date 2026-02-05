"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { LuChevronDown } from "react-icons/lu";

const buildCategoryTree = (categories) => {
  const roots = categories.filter((c) => !c.parentId);
  return roots.map((parent) => {
    const children = categories.filter((c) => c.parentId === parent.id);
    return { ...parent, children };
  });
};

const CategoryTabs = ({ categories, activeTab, onTabChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const categoryTree = useMemo(
    () => {
      console.log('CategoryTabs - Building tree from categories:', categories.length);
      const tree = buildCategoryTree(categories);
      console.log('CategoryTabs - Tree built:', tree.map(p => ({ 
        name: p.name, 
        childrenCount: p.children?.length || 0 
      })));
      return tree;
    },
    [categories],
  );

  const activeCategory = categories.find((cat) => cat.id === activeTab);

  const isParentActive = (parent) => {
    if (activeTab === parent.id) return true;
    return parent.children?.some((child) => child.id === activeTab);
  };

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
        {categoryTree.map((parent) => {
          const isActive = isParentActive(parent);
          const hasChildren = parent.children && parent.children.length > 0;

          return (
            <div
              key={parent.id}
              className={`tab-item-wrapper ${hasChildren ? "has-dropdown" : ""}`}
            >
              <button
                className={`tab-btn ${isActive ? "active" : ""}`}
                onClick={() => onTabChange(parent.id)}
              >
                {parent.label || parent.name}
                {hasChildren && (
                  <LuChevronDown className="dropdown-arrow" size={14} />
                )}
              </button>

              {/* The Dropdown Menu */}
              {hasChildren && (
                <div className="dropdown-menu">
                  {parent.children.map((child) => (
                    <div
                      key={child.id}
                      className={`dropdown-item ${activeTab === child.id ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTabChange(child.id);
                      }}
                    >
                      {child.label || child.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="tabs-mobile" ref={dropdownRef}>
        <div
          className={`mobile-select-header ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="selected-label">
            {activeCategory?.label || activeCategory?.name || "Danh mục"}
          </span>
          <LuChevronDown className={`arrow-icon ${isOpen ? "rotate" : ""}`} />
        </div>

        {isOpen && (
          <div className="mobile-select-options">
            {categoryTree.map((parent) => (
              <div key={parent.id} className="mobile-group">
                {/* Parent Option */}
                <div
                  className={`option-item parent ${activeTab === parent.id ? "selected" : ""}`}
                  onClick={() => handleSelect(parent.id)}
                >
                  {parent.label || parent.name}
                </div>

                {/* Children Options (Indented) */}
                {parent.children?.map((child) => (
                  <div
                    key={child.id}
                    className={`option-item child ${activeTab === child.id ? "selected" : ""}`}
                    onClick={() => handleSelect(child.id)}
                  >
                    — {child.label || child.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryTabs;
