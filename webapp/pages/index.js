import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import TabNavigation from '../components/TabNavigation';
import ListingsChart from '../components/ListingsChart';
import PriceTrendsChart from '../components/PriceTrendsChart';
import PriceRatioChart from '../components/PriceRatioChart';
import DaysOnMarketChart from '../components/DaysOnMarketChart';
import MonthsOfInventoryChart from '../components/MonthsOfInventoryChart';
import VolumeChart from '../components/VolumeChart';
import DateRangeSelector from '../components/DateRangeSelector';
const { filterDataByDateRange, getDefaultDateRange, formatMonthYear } = require('../lib/dateUtils');

export default function Home() {
  const [activeTab, setActiveTab] = useState('listings');
  const [data, setData] = useState({
    listings: [],
    prices: [],
    ratio: [],
    dom: [],
    inventory: [],
    volume: []
  });
  const [filteredData, setFilteredData] = useState({
    listings: [],
    prices: [],
    ratio: [],
    dom: [],
    inventory: [],
    volume: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize date range with empty values, will be set after data is fetched
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  
  // Force a re-render when filtered data changes
  const [filterKey, setFilterKey] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [
          listingsRes,
          pricesRes,
          ratioRes,
          domRes,
          inventoryRes,
          volumeRes
        ] = await Promise.all([
          fetch('/api/listings'),
          fetch('/api/prices'),
          fetch('/api/ratio'),
          fetch('/api/dom'),
          fetch('/api/inventory'),
          fetch('/api/volume')
        ]);

        const [
          listings,
          prices,
          ratio,
          dom,
          inventory,
          volume
        ] = await Promise.all([
          listingsRes.json(),
          pricesRes.json(),
          ratioRes.json(),
          domRes.json(),
          inventoryRes.json(),
          volumeRes.json()
        ]);

        // Log data for debugging
        console.log("API Data fetched:", {
          listings: listings.length,
          prices: prices.length,
          ratio: ratio.length,
          dom: dom.length,
          inventory: inventory.length,
          volume: volume.length
        });

        // Store raw data
        setData({
          listings,
          prices,
          ratio,
          dom,
          inventory,
          volume
        });
        
        // Set default date range based on the data
        // Combine all data to find the most recent date
        const allData = [...listings, ...prices, ...ratio, ...dom, ...inventory, ...volume];
        const defaultRange = getDefaultDateRange(allData);
        
        // Update date range states
        setStartMonth(defaultRange.startMonth);
        setStartYear(defaultRange.startYear);
        setEndMonth(defaultRange.endMonth);
        setEndYear(defaultRange.endYear);
        
        // Apply initial filtering with the calculated date range
        applyDateFilter(
          listings, 
          prices, 
          ratio, 
          dom, 
          inventory, 
          volume, 
          defaultRange.startMonth, 
          defaultRange.startYear, 
          defaultRange.endMonth, 
          defaultRange.endYear
        );
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    }

    fetchData();
  }, []);
  
  // Function to filter data based on date range
  const applyDateFilter = (listings, prices, ratio, dom, inventory, volume, sMonth = startMonth, sYear = startYear, eMonth = endMonth, eYear = endYear) => {
    console.log(`Applying date filter: ${formatMonthYear(sMonth, sYear)} to ${formatMonthYear(eMonth, eYear)}`);
    
    // Apply filtering with data type labels for better debugging
    const filtered = {
      listings: filterDataByDateRange(listings, sMonth, sYear, eMonth, eYear, 'listings'),
      prices: filterDataByDateRange(prices, sMonth, sYear, eMonth, eYear, 'prices'),
      ratio: filterDataByDateRange(ratio, sMonth, sYear, eMonth, eYear, 'ratio'),
      dom: filterDataByDateRange(dom, sMonth, sYear, eMonth, eYear, 'dom'),
      inventory: filterDataByDateRange(inventory, sMonth, sYear, eMonth, eYear, 'inventory'),
      volume: filterDataByDateRange(volume, sMonth, sYear, eMonth, eYear, 'volume')
    };
    
    // Log filtered data counts for debugging
    console.log("Filtered data counts:", {
      listings: filtered.listings.length,
      prices: filtered.prices.length,
      ratio: filtered.ratio.length,
      dom: filtered.dom.length,
      inventory: filtered.inventory.length,
      volume: filtered.volume.length
    });
    
    setFilteredData(filtered);
    
    // Force re-render of charts with new filtered data
    setFilterKey(prevKey => prevKey + 1);
  };
  
  // Handler for filter button click
  const handleFilterChange = () => {
    console.log("Filter button clicked with date range:", {
      startMonth, startYear, endMonth, endYear 
    });
    
    applyDateFilter(
      data.listings, 
      data.prices, 
      data.ratio, 
      data.dom, 
      data.inventory, 
      data.volume,
      startMonth,
      startYear,
      endMonth,
      endYear
    );
  };

  const renderActiveChart = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-96">Loading data...</div>;
    }

    if (error) {
      return <div className="flex justify-center items-center h-96 text-red-500">{error}</div>;
    }

    // Use key to force chart re-renders when filtered data changes
    const key = `chart-${activeTab}-${filterKey}`;
    
    // Log which chart is being rendered
    console.log(`Rendering chart for tab: ${activeTab} with filterKey: ${filterKey}`);
    console.log(`Filtered data for ${activeTab}:`, filteredData[activeTab]?.length || 0, "items");
    
    switch (activeTab) {
      case 'listings':
        console.log("Passing listings data to ListingsChart:", filteredData.listings?.length || 0, "items");
        return <ListingsChart key={`listings-chart-${filterKey}-${JSON.stringify(filteredData.listings?.length)}`} data={filteredData.listings} />;
      case 'prices':
        return <PriceTrendsChart key={key} data={filteredData.prices} />;
      case 'ratio':
        return <PriceRatioChart key={key} data={filteredData.ratio} />;
      case 'dom':
        return <DaysOnMarketChart key={key} data={filteredData.dom} />;
      case 'inventory':
        return <MonthsOfInventoryChart key={key} data={filteredData.inventory} />;
      case 'volume':
        return <VolumeChart key={key} data={filteredData.volume} />;
      default:
        return <div>Select a tab to view data</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>New Bern Real Estate Market Data</title>
        <meta name="description" content="Interactive data visualization for New Bern, NC real estate market" />
        <link rel="icon" href="/favicon.ico" />
        {/* begin Widget Tracker Code */}
        <script dangerouslySetInnerHTML={{
          __html: `
          (function(w,i,d,g,e,t){w["WidgetTrackerObject"]=g;(w[g]=w[g]||function()
          {(w[g].q=w[g].q||[]).push(arguments);}),(w[g].ds=1*new Date());(e="script"),
          (t=d.createElement(e)),(e=d.getElementsByTagName(e)[0]);t.async=1;t.src=i;
          e.parentNode.insertBefore(t,e);})
          (window,"https://widgetbe.com/agent",document,"widgetTracker");
          window.widgetTracker("create", "WT-HXRGLMXI");
          window.widgetTracker("send", "pageview");
          `
        }} />
        {/* end Widget Tracker Code */}
      </Head>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-blue-600 text-center">New Bern Real Estate Market Data</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="mb-6 text-gray-600">
            I created this page because it's way too hard for buyers and homeowners to find real, local real estate data without getting bombarded by agents. So we're fixing that. Each month, we manually pull accurate stats straight from our MLS to give you a clear view of what's really happening in the New Bern market—no fluff, no pressure. And when you're ready to buy or sell, we'd love the chance to earn your business.
          </p>
          
          <DateRangeSelector 
            startMonth={startMonth}
            startYear={startYear}
            endMonth={endMonth}
            endYear={endYear}
            onStartMonthChange={setStartMonth}
            onStartYearChange={setStartYear}
            onEndMonthChange={setEndMonth}
            onEndYearChange={setEndYear}
            onFilterChange={handleFilterChange}
          />
          
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="mt-6">
            {renderActiveChart()}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-4">
              <div className="flex-shrink-0">
                <img 
                  src="/images/headshot.png" 
                  alt="Ray Copeland" 
                  className="h-36 w-36 rounded-full object-cover border-2 border-blue-600 shadow-md" 
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold text-gray-800">Ray Copeland</h3>
                <p className="text-gray-600 mt-1">
                  <a href="tel:252-649-3081" className="hover:text-blue-600">252-649-3081</a>
                </p>
                <p className="text-gray-600">
                  <a href="mailto:ray@sellingnorthcarolina.com" className="hover:text-blue-600">ray@sellingnorthcarolina.com</a>
                </p>
                <p className="mt-2 text-gray-700">
                  Ready to buy or sell in New Bern? Contact me for professional real estate assistance.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center mt-4 mb-8">
              <a 
                href="https://consumer.hifello.com/p/raycopeland/678966069a3b6000363c36f2" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                target="_blank"
                rel="noopener noreferrer"
              >
                See Your Home's Value Instantly
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Added Powered by section here */}
          <div className="flex flex-col items-center justify-center mb-4">
            <p className="text-lg text-gray-600 mb-2">Powered by</p>
            <img src="/images/Copy of MainSelling North Carolina Logo (2).png" alt="Company Logo" className="h-24 max-w-md" />
          </div>
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} New Bern Real Estate Market Data
          </p>
        </div>
      </footer>
    </div>
  );
} 