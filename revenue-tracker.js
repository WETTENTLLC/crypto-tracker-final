// This script helps track monetization metrics across different revenue streams
// It can be run daily or weekly to monitor revenue growth

import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

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

// Simulated revenue data fetching
// In a real implementation, this would call your analytics API or payment processor APIs
const fetchRevenueData = async (stream, date) => {
  // Placeholder for actual API calls
  // Example: const response = await fetch(`https://api.payment-processor.com/revenue?stream=${stream}&date=${formatDate(date)}`);
  
  // For now, we'll simulate revenue growth
  const daysSinceStart = Math.floor((date.getTime() - config.startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const baseRevenue = {
    premium_subscriptions: 16.67, // $500/month base ÷ 30 days
    advertising: 10.00,           // $300/month base ÷ 30 days
    affiliate_marketing: 6.67,    // $200/month base ÷ 30 days
    api_access: 3.33,             // $100/month base ÷ 30 days
  };
  
  // Apply a small random fluctuation and growth over time
  const growthFactor = 1 + (daysSinceStart * 0.005); // 0.5% daily growth
  const randomFactor = 0.8 + (Math.random() * 0.4); // Random between 0.8 and 1.2
  
  return baseRevenue[stream] * growthFactor * randomFactor;
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
  const startDate = new Date(year, month - 1, 1);
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
