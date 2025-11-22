// export default SearchBox;
import Link from "next/link";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

function SearchBox({
  placeholder = "Search products",
  handleSearch,
  searchServices = [],
}) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const filteredSuggestions = searchServices.filter((service) =>
      service.serviceName.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(value ? filteredSuggestions : []);
  };

  const handleSelectSuggestion = (suggestion) => {
    setInputValue(suggestion.serviceName);
    setSuggestions([]);
    handleSearch?.(suggestion.serviceName);
  };

  const onSearchClick = () => {
    handleSearch?.(inputValue);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearchClick();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="relative flex w-full">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-l-md focus:outline-none bg-gray-100 focus:ring-1 focus:ring-gray-500"
        />
        <button
          onClick={onSearchClick}
          className="bg-kappes px-3 sm:px-4 lg:px-6 text-white rounded-r-md flex items-center justify-center cursor-pointer min-w-[44px] sm:min-w-[50px]"
          aria-label="Search"
        >
          <FiSearch className="text-white text-base sm:text-lg" />
        </button>
        {suggestions.length > 0 ? (
          <ul className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <Link
                href={`/trades-&-services/services/${suggestion.id}`}
                key={suggestion.id}
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                <li className="px-4 py-2 text-sm sm:text-base cursor-pointer hover:bg-gray-100">
                  {suggestion.serviceName}
                </li>
              </Link>
            ))}
          </ul>
        ) : inputValue.trim() ? (
          <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            <p className="px-4 py-2 text-sm sm:text-base text-gray-500">
              No services found for "{inputValue}"
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default SearchBox;
