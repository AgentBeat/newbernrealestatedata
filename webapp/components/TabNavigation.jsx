import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'listings', label: 'Number Of Listings' },
    { id: 'prices', label: 'Price Trends' },
    { id: 'ratio', label: 'Sale/List Price' },
    { id: 'dom', label: 'Days On Market' },
    { id: 'inventory', label: 'Months Of Inventory' },
    { id: 'volume', label: 'Volume' },
  ];

  return (
    <div className="border-b border-gray-200">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${
              activeTab === tab.id
                ? 'tab-active'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } tab whitespace-nowrap`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation; 