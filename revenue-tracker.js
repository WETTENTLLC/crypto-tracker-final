// This script helps track monetization metrics across different revenue streams
// It can be run daily or weekly to monitor revenue growth

import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';
import fetch from 'node-fetch'; // Added import for node-fetch

// Configuration
const config = {
  dataPath: path.join(process.cwd(), 'revenue-data'),
  revenueStreams: [
    'premium_subscriptions',
    'advertising',
    'affiliate_marketing',
    'api_access'
  ],
  startDate: new Date('2025-05-23'), // Today's date
};

// Create the data directory if it doesn't exist
if (!fs.existsSync(config.dataPath)) {
  fs.mkdirSync(config.dataPath, { recursive: true });
}

// Real revenue data fetching from analytics API
const fetchRevenueData = async (stream, date) => {
  try {
    // Format the date for the API query
    const formattedDate = formatDateForFile(date);
    console.log(`[DEBUG] fetchRevenueData called for stream: ${stream}, date: ${date}, formattedDate: ${formattedDate}`);

    // Fetch actual revenue data from the analytics API
    const analyticsApiUrl = `http://localhost:3003/api/mcp/analytics?eventName=revenue_recorded&date=${formattedDate}`;
    console.log(`[DEBUG] Fetching analytics URL: ${analyticsApiUrl}`);
    const response = await fetch(analyticsApiUrl);
    console.log(`[DEBUG] Analytics API response status: ${response.status}, statusText: ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[DEBUG] Analytics API error response text: ${errorText}`);
      throw new Error(`Failed to fetch revenue data: ${response.status} ${response.statusText}`);
    }
    
    const analyticsData = await response.json();
    console.log('[DEBUG] Parsed analyticsData:', JSON.stringify(analyticsData, null, 2));
    
    if (!analyticsData.success || !analyticsData.data || !analyticsData.data.events) {
      console.error('[DEBUG] Invalid analytics data structure in response.');
      throw new Error('Invalid analytics data response');
    }
    
    // Find events for this revenue stream on this date
    console.log(`[DEBUG] Filtering ${analyticsData.data.events.length} events for stream: ${stream} AND date: ${formattedDate}`);
    const streamEvents = analyticsData.data.events.filter(event => {
      const eventMatches = event.eventData.stream === stream && event.eventData.date === formattedDate;
      // if (event.eventData.date === formattedDate) { // Log all events for today to see what we got
      //   console.log(`[DEBUG] Event for today found (stream ${event.eventData.stream}):`, JSON.stringify(event.eventData, null, 2));
      // }
      return eventMatches;
    });
    console.log(`[DEBUG] Found ${streamEvents.length} matching streamEvents:`, JSON.stringify(streamEvents, null, 2));
    
    // Calculate total revenue for this stream on this date
    let totalRevenue = 0;
    
    if (streamEvents.length > 0) {
      streamEvents.forEach(event => {
        const amount = parseFloat(event.eventData.amount || 0);
        totalRevenue += isNaN(amount) ? 0 : amount;
      });
      console.log(`[DEBUG] Calculated totalRevenue from streamEvents: ${totalRevenue}`);
      return totalRevenue;
    } else {
      console.log(`[DEBUG] No direct streamEvents found for ${stream} on ${formattedDate}. Checking PayPal fallback if applicable.`);
      // If no events are found, check for PayPal transactions for premium subscriptions
      if (stream === 'premium_subscriptions') {
        const paypalApiUrl = `http://localhost:3003/api/paypal/transactions?date=${formattedDate}`;
        console.log(`[DEBUG] Fetching PayPal URL: ${paypalApiUrl}`);
        const paypalResponse = await fetch(paypalApiUrl);
        console.log(`[DEBUG] PayPal API response status: ${paypalResponse.status}, statusText: ${paypalResponse.statusText}`);

        if (paypalResponse.ok) {
          const paypalData = await paypalResponse.json();
          console.log('[DEBUG] Parsed paypalData:', JSON.stringify(paypalData, null, 2));
          if (paypalData.success && paypalData.transactions && paypalData.transactions.length > 0) {
            totalRevenue = paypalData.transactions.reduce((total, tx) => total + parseFloat(tx.amount.value), 0);
            console.log(`[DEBUG] Calculated totalRevenue from PayPal: ${totalRevenue}`);
            return totalRevenue;
          } else {
            console.log('[DEBUG] No successful PayPal transactions found or empty transaction list.');
          }
        } else {
          const paypalErrorText = await paypalResponse.text();
          console.error(`[DEBUG] PayPal API error response text: ${paypalErrorText}`);
          console.log('[DEBUG] PayPal fetch failed, returning 0 for this stream.');
        }
      }
      
      // Default to 0 if no data is found
      console.log(`[DEBUG] No revenue found for ${stream} on ${formattedDate} after all checks. Returning 0.`);
      return 0;
    }
  } catch (error) {
    console.error(`Error fetching revenue data for ${stream}:`, error);
    // Return 0 on error
    return 0;
  }
};

// Format date for filenames
const formatDateForFile = (date) => {
  return format(date, 'yyyy-MM-dd');
};

// Main function to record daily revenue
const recordDailyRevenue = async (date = new Date()) => {
  const dateStr = formatDateForFile(date);
  const filePath = path.join(config.dataPath, `revenue-${dateStr}.json`);
  
  const revenueData = {
    date: dateStr,
    total: 0,
    streams: {}
  };
  
  // Fetch revenue for each stream
  for (const stream of config.revenueStreams) {
    const amount = await fetchRevenueData(stream, date);
    revenueData.streams[stream] = parseFloat(amount.toFixed(2));
    revenueData.total += revenueData.streams[stream];
  }
  
  // Round the total
  revenueData.total = parseFloat(revenueData.total.toFixed(2));
  
  // Save to file
  fs.writeFileSync(filePath, JSON.stringify(revenueData, null, 2));
  console.log(`Revenue data for ${dateStr} recorded successfully!`);
  console.log(revenueData);
  
  // Update the monthly summary
  updateMonthlySummary(date);
  
  return revenueData;
};

// Generate a monthly summary
const updateMonthlySummary = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const monthStr = month.toString().padStart(2, '0');
  
  const summaryFilePath = path.join(config.dataPath, `summary-${year}-${monthStr}.json`);
  
  // Initialize summary
  let summary = {
    year,
    month,
    total: 0,
    streams: {},
    dailyData: []
  };
  
  // If summary exists, load it
  if (fs.existsSync(summaryFilePath)) {
    summary = JSON.parse(fs.readFileSync(summaryFilePath, 'utf8'));
  } else {
    // Initialize stream totals
    for (const stream of config.revenueStreams) {
      summary.streams[stream] = 0;
    }
  }
  
  // Scan all daily files for the month
  const endDate = new Date(year, month, 0);
  
  // Reset totals
  summary.total = 0;
  for (const stream of config.revenueStreams) {
    summary.streams[stream] = 0;
  }
  summary.dailyData = [];
  
  // Iterate through each day of the month
  for (let day = 1; day <= endDate.getDate(); day++) {
    const currentDate = new Date(year, month - 1, day);
    if (currentDate > date) break; // Don't process future dates
    
    const dateStr = formatDateForFile(currentDate);
    const dailyFilePath = path.join(config.dataPath, `revenue-${dateStr}.json`);
    
    if (fs.existsSync(dailyFilePath)) {
      const dailyData = JSON.parse(fs.readFileSync(dailyFilePath, 'utf8'));
      
      // Add to totals
      summary.total += dailyData.total;
      
      // Add to stream totals
      for (const stream of config.revenueStreams) {
        if (dailyData.streams[stream]) {
          summary.streams[stream] += dailyData.streams[stream];
        }
      }
      
      // Add to daily data array
      summary.dailyData.push({
        date: dateStr,
        total: dailyData.total,
        streams: dailyData.streams
      });
    }
  }
  
  // Round all totals
  summary.total = parseFloat(summary.total.toFixed(2));
  for (const stream of config.revenueStreams) {
    summary.streams[stream] = parseFloat(summary.streams[stream].toFixed(2));
  }
  
  // Save summary
  fs.writeFileSync(summaryFilePath, JSON.stringify(summary, null, 2));
  console.log(`Monthly summary for ${year}-${monthStr} updated successfully!`);
};

// Generate a report showing projected vs actual revenue
const generateReport = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const monthStr = month.toString().padStart(2, '0');
  
  const summaryFilePath = path.join(config.dataPath, `summary-${year}-${monthStr}.json`);
  
  if (!fs.existsSync(summaryFilePath)) {
    console.log(`No data available for ${year}-${monthStr}`);
    return;
  }
  
  const summary = JSON.parse(fs.readFileSync(summaryFilePath, 'utf8'));
  
  // Calculate projected monthly revenue based on current run rate
  const daysInMonth = new Date(year, month, 0).getDate();
  const currentDay = Math.min(date.getDate(), daysInMonth);
  const projected = {};
  
  projected.total = (summary.total / currentDay) * daysInMonth;
  projected.streams = {};
  
  for (const stream of config.revenueStreams) {
    projected.streams[stream] = (summary.streams[stream] / currentDay) * daysInMonth;
  }
  
  // Generate the report
  console.log(`\n=== REVENUE REPORT: ${year}-${monthStr} ===`);
  console.log(`Current date: ${date.toISOString().split('T')[0]}`);
  console.log(`Days recorded: ${currentDay}/${daysInMonth}`);
  console.log(`\nCurrent Revenue:`);
  console.log(`Total: $${summary.total.toFixed(2)}`);
  
  for (const stream of config.revenueStreams) {
    console.log(`${stream.replace('_', ' ')}: $${summary.streams[stream].toFixed(2)}`);
  }
  
  console.log(`\nProjected Month-End Revenue:`);
  console.log(`Total: $${projected.total.toFixed(2)}`);
  
  for (const stream of config.revenueStreams) {
    console.log(`${stream.replace('_', ' ')}: $${projected.streams[stream].toFixed(2)}`);
  }
  
  // Calculate growth if previous month data exists
  const previousMonth = month === 1 ? 12 : month - 1;
  const previousYear = month === 1 ? year - 1 : year;
  const previousMonthStr = previousMonth.toString().padStart(2, '0');
  const previousSummaryFilePath = path.join(config.dataPath, `summary-${previousYear}-${previousMonthStr}.json`);
  
  if (fs.existsSync(previousSummaryFilePath)) {
    const previousSummary = JSON.parse(fs.readFileSync(previousSummaryFilePath, 'utf8'));
    
    console.log(`\nMonth-over-Month Growth (Projected):`);
    const growthPercent = ((projected.total - previousSummary.total) / previousSummary.total) * 100;
    console.log(`Total: ${growthPercent.toFixed(1)}%`);
    
    for (const stream of config.revenueStreams) {
      const streamGrowth = ((projected.streams[stream] - previousSummary.streams[stream]) / previousSummary.streams[stream]) * 100;
      console.log(`${stream.replace('_', ' ')}: ${streamGrowth.toFixed(1)}%`);
    }
  }
  
  console.log(`\n=== END REPORT ===\n`);
  
  // Return the report data
  return {
    current: summary,
    projected,
    date: date.toISOString().split('T')[0],
    daysRecorded: currentDay,
    daysInMonth
  };
};

// Example usage
(async () => {
  // Record today's revenue
  await recordDailyRevenue();
  
  // Generate a report
  generateReport();
})();

// Export functions for external use
export { 
  recordDailyRevenue, 
  updateMonthlySummary, 
  generateReport 
};
