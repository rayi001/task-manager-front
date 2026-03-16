// Simple API test utility
export const testApiConnection = async () => {
  const results = [];
  
  // Test 1: Basic connectivity
  try {
    const response = await fetch('https://task-manager-back-mfmmebeox-ramons-projects-1a1b208a.vercel.app/api/tasks/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    });
    
    results.push(`✓ Server reachable: HTTP ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      results.push(`✓ API working: ${Array.isArray(data) ? data.length : 'object'} items returned`);
      return { success: true, data, results };
    } else {
      const errorText = await response.text();
      results.push(`✗ API Error: ${response.status} - ${errorText}`);
      
      // Check if it's an authentication error
      if (response.status === 401) {
        results.push(`ℹ️  Note: This is expected - tasks require authentication`);
      }
      
      return { success: false, error: `HTTP ${response.status}`, results, errorText };
    }
  } catch (error) {
    results.push(`✗ Connection failed: ${error.message}`);
    
    // Test 2: Try without CORS mode
    try {
      const response = await fetch('https://task-manager-back-mfmmebeox-ramons-projects-1a1b208a.vercel.app/api/tasks/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      results.push(`✓ Server responds without CORS: HTTP ${response.status}`);
    } catch (corsError) {
      results.push(`✗ CORS issue detected: ${corsError.message}`);
    }
    
    // Test 3: Check if base domain works
    try {
      const response = await fetch('https://task-manager-back-mfmmebeox-ramons-projects-1a1b208a.vercel.app/', {
        method: 'GET'
      });
      results.push(`✓ Base domain works: HTTP ${response.status}`);
    } catch (baseError) {
      results.push(`✗ Base domain failed: ${baseError.message}`);
    }
    
    // Test 4: Try login endpoint (should work without auth)
    try {
      const response = await fetch('https://task-manager-back-mfmmebeox-ramons-projects-1a1b208a.vercel.app/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'test', password: 'test' })
      });
      results.push(`✓ Login endpoint reachable: HTTP ${response.status}`);
    } catch (loginError) {
      results.push(`✗ Login endpoint failed: ${loginError.message}`);
    }
    
    return { success: false, error: error.message, results };
  }
};
