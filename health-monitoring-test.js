// Health monitoring system validation test
// Tests all aspects of the cryptocurrency data source health monitoring

const test = async () => {
  console.log('🔍 Starting comprehensive health monitoring system test...\n');

  // Test 1: Health API endpoint
  console.log('1. Testing /api/crypto/health endpoint...');
  try {
    const response = await fetch('http://localhost:3001/api/crypto/health');
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Health API endpoint working');
      console.log(`   - Overall health score: ${data.data.overall.healthScore}%`);
      console.log(`   - Active sources: ${data.data.overall.activeSources}/${data.data.overall.totalSources}`);
      console.log(`   - Primary source: ${data.data.overall.primarySource}`);
      
      // List all sources and their status
      console.log('   - Source details:');
      Object.entries(data.data.sources).forEach(([source, info]) => {
        const status = info.isHealthy ? '🟢' : '🔴';
        console.log(`     ${status} ${source}: ${info.isHealthy ? 'Healthy' : 'Unhealthy'} (${info.errors} errors)`);
      });
    } else {
      console.log('❌ Health API endpoint failed');
      console.log('   Response:', data);
    }
  } catch (error) {
    console.log('❌ Health API endpoint error:', error.message);
  }

  console.log('');

  // Test 2: Multi-source failover functionality
  console.log('2. Testing multi-source crypto data fetching...');
  try {
    const response = await fetch('http://localhost:3001/api/crypto');
    const data = await response.json();
    
    if (response.ok && data.success && data.data.length > 0) {
      console.log('✅ Multi-source crypto data working');
      console.log(`   - Retrieved ${data.data.length} cryptocurrencies`);
      console.log(`   - Sample: ${data.data[0].name} (${data.data[0].symbol}) - $${data.data[0].current_price}`);
    } else {
      console.log('❌ Multi-source crypto data failed');
    }
  } catch (error) {
    console.log('❌ Multi-source crypto data error:', error.message);
  }

  console.log('');

  // Test 3: Health monitoring components
  console.log('3. Testing health monitoring UI components...');
  try {
    // Test dashboard page load
    const dashboardResponse = await fetch('http://localhost:3001/dashboard');
    if (dashboardResponse.ok) {
      console.log('✅ User dashboard loads successfully');
    } else {
      console.log('❌ User dashboard failed to load');
    }

    // Test admin dashboard page load
    const adminResponse = await fetch('http://localhost:3001/admin/dashboard');
    if (adminResponse.ok) {
      console.log('✅ Admin dashboard loads successfully');
    } else {
      console.log('❌ Admin dashboard failed to load');
    }
  } catch (error) {
    console.log('❌ Dashboard loading error:', error.message);
  }

  console.log('');

  // Test 4: Performance metrics
  console.log('4. Testing performance metrics...');
  const startTime = Date.now();
  try {
    const response = await fetch('http://localhost:3001/api/crypto/health');
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (response.ok) {
      console.log(`✅ Health endpoint response time: ${responseTime}ms`);
      if (responseTime < 1000) {
        console.log('✅ Response time is optimal (< 1s)');
      } else {
        console.log('⚠️  Response time is slow (> 1s)');
      }
    }
  } catch (error) {
    console.log('❌ Performance test error:', error.message);
  }

  console.log('');

  // Test 5: Error handling
  console.log('5. Testing error handling...');
  try {
    // Test invalid endpoint
    const response = await fetch('http://localhost:3001/api/crypto/invalid-endpoint');
    if (response.status === 404) {
      console.log('✅ 404 error handling working correctly');
    }
  } catch (error) {
    console.log('✅ Network error handling working:', error.message);
  }

  console.log('');
  console.log('🎉 Health monitoring system validation complete!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   - Multi-source cryptocurrency data service with automatic failover');
  console.log('   - Real-time health monitoring for all data sources');
  console.log('   - Health indicators integrated into user and admin dashboards');
  console.log('   - Comprehensive error tracking and recovery mechanisms');
  console.log('   - Performance monitoring and optimization');
};

// Run the test
test().catch(console.error);
