const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Debug: Check if environment variables are loaded
console.log('Environment variables check:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Loaded' : 'Missing');
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? 'Loaded' : 'Missing');
console.log('PERPLEXITY_API_KEY:', process.env.PERPLEXITY_API_KEY ? 'Loaded' : 'Missing');

app.use(cors());
app.use(express.json());

// Industry mapping
const INDUSTRY_MAP = {
  '1': 'Technology',
  '2': 'Healthcare',
  '3': 'Finance',
  '4': 'Education',
  '5': 'Manufacturing',
  '6': 'Retail',
  '7': 'Real Estate',
  '8': 'Consulting',
  '9': 'Marketing & Advertising',
  '10': 'Legal Services',
  '11': 'Engineering',
  '12': 'Construction',
  '13': 'Transportation & Logistics',
  '14': 'Media & Entertainment',
  '15': 'Government',
  '16': 'Non-profit',
  '17': 'Hospitality & Tourism',
  '18': 'Energy & Utilities',
  '19': 'Telecommunications',
  '20': 'Pharmaceuticals',
  '21': 'Insurance',
  '22': 'Banking',
  '23': 'Automotive',
  '24': 'Aerospace',
  '25': 'Agriculture',
  '26': 'Food & Beverage',
  '27': 'Fashion & Apparel',
  '28': 'Sports & Recreation',
  '29': 'Publishing',
  '30': 'E-commerce',
  '31': 'Commodities Trading',
  '32': 'Investment Banking',
  '33': 'Private Equity',
  '34': 'Venture Capital',
  '35': 'Hedge Funds',
  '36': 'Asset Management',
  '37': 'Wealth Management',
  '38': 'Investment Management',
  '39': 'Corporate Banking',
  '40': 'Commercial Banking',
  '41': 'Credit & Lending',
  '42': 'Fintech',
  '43': 'Cryptocurrency',
  '44': 'Blockchain',
  '45': 'Cybersecurity',
  '46': 'Data Science',
  '47': 'Artificial Intelligence',
  '48': 'Cloud Computing',
  '49': 'Software Development',
  '50': 'Product Management',
  '51': 'Digital Marketing',
  '52': 'Social Media',
  '53': 'Content Creation',
  '54': 'Influencer Marketing',
  '55': 'Public Relations',
  '56': 'Event Management',
  '57': 'Project Management',
  '58': 'Business Development',
  '59': 'Sales',
  '60': 'Customer Success',
  '61': 'Human Resources',
  '62': 'Talent Acquisition',
  '63': 'Executive Search',
  '64': 'Management Consulting',
  '65': 'Strategy Consulting',
  '66': 'Operations Consulting',
  '67': 'IT Consulting',
  '68': 'Digital Transformation',
  '69': 'Change Management',
  '70': 'Risk Management',
  '71': 'Compliance',
  '72': 'Audit',
  '73': 'Tax Advisory',
  '74': 'Accounting',
  '75': 'Corporate Law',
  '76': 'Intellectual Property',
  '77': 'Mergers & Acquisitions',
  '78': 'Securities Law',
  '79': 'Employment Law',
  '80': 'Litigation',
  '81': 'Arbitration',
  '82': 'Regulatory Affairs',
  '83': 'Clinical Research',
  '84': 'Medical Devices',
  '85': 'Biotechnology',
  '86': 'Telemedicine',
  '87': 'Health Insurance',
  '88': 'Mental Health',
  '89': 'Fitness & Wellness',
  '90': 'Nutrition',
  '91': 'Oil & Gas',
  '92': 'Renewable Energy',
  '93': 'Solar Energy',
  '94': 'Wind Energy',
  '95': 'Nuclear Energy',
  '96': 'Mining',
  '97': 'Forestry',
  '98': 'Fishing',
  '99': 'Water Management',
  '100': 'Waste Management',
  '101': 'Environmental Services',
  '102': 'Sustainability',
  '103': 'Carbon Trading',
  '104': 'ESG Investing',
  '105': 'Impact Investing',
  '106': 'Microfinance',
  '107': 'International Development',
  '108': 'Humanitarian Aid',
  '109': 'Social Impact',
  '110': 'Grant Writing',
  '111': 'Fundraising',
  '112': 'Philanthropy',
  '113': 'Corporate Social Responsibility',
  '114': 'Diversity & Inclusion',
  '115': 'Training & Development'
};

// Helper function to get market analysis from Perplexity
async function getMarketAnalysis({ jobTitle, industry, location, yearsExperience }) {
  console.log('=== PERPLEXITY REQUEST ===');
  console.log('Parameters:', { jobTitle, industry, location, yearsExperience });
  
  try {
    const apiKey = process.env.PERPLEXITY_API_KEY;

    if (!apiKey) {
      throw new Error('PERPLEXITY_API_KEY not configured');
    }

    const prompt = `Analyze the current job market and salary expectations for a ${jobTitle} in the ${industry} industry, located in ${location}, with ${yearsExperience} years of experience. 

Provide specific insights on:
1. Current market demand and trends
2. Salary ranges (monthly and annual in local currency and USD)
3. Key skills in demand
4. Regional market factors
5. Hiring trends and demand outlook

Please format your response as JSON with this EXACT structure:
{
  "marketTarget": {"local": 92000, "usd": 92000},
  "salaryRange": {
    "monthly": {"min": 5650, "max": 9700, "usd": {"min": 5650, "max": 9700}, "local": {"min": 5650, "max": 9700}},
    "annual": {"min": 67800, "max": 116400, "usd": {"min": 67800, "max": 116400}, "local": {"min": 67800, "max": 116400}}
  },
  "premiumsNote": "Brief note about salary factors and premiums",
  "demandNotes": ["High demand insight 1", "Market trend 2", "Industry factor 3"],
  "regionalNotes": ["Regional market insight 1", "Location factor 2"],
  "macroNotes": ["Economic factor 1", "Industry trend 2"],
  "hiringNotes": ["Hiring trend 1", "Demand insight 2", "Market condition 3"],
  "citations": [{"title": "Source Name", "url": "https://example.com"}],
  "highDemand": true,
  "locationPremium": true
}

Use the most current salary data available. Be specific with numbers. Return ONLY valid JSON, no markdown formatting.`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', errorText);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extract JSON from response (handles markdown code blocks)
    let jsonText = content;
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[1] || jsonMatch[0];
    }

    const marketData = JSON.parse(jsonText);
    console.log('✅ Market analysis completed');
    
    return marketData;

  } catch (error) {
    console.error('❌ Market analysis error:', error.message);
    throw error;
  }
}

// ==========================================
// API ENDPOINTS
// ==========================================

// Test Supabase connection
app.get('/api/test-supabase', async (req, res) => {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    
    const { data, error } = await supabase.from('reports').select('session_id').limit(1);
    
    if (error) {
      res.json({ error: error.message });
    } else {
      res.json({ success: true, data });
    }
  } catch (err) {
    res.json({ error: err.message });
  }
});

// Get report data (used by the report page)
app.get('/api/user-data/:id', async (req, res) => {
  const reportId = req.params.id;
  console.log('=== FETCHING REPORT ===');
  console.log('Report ID:', reportId);
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const { data: reportData, error } = await supabase
      .from('reports')
      .select('*')
      .eq('session_id', reportId)
      .single();

    if (error || !reportData) {
      console.error('❌ Report not found:', error);
      return res.status(404).json({ error: 'Report not found' });
    }

    console.log('✅ Report found');

    // Parse JSON fields if they're strings
    const parsedReportData = typeof reportData.report_data === 'string' 
      ? JSON.parse(reportData.report_data) 
      : reportData.report_data;

    const parsedMarketAnalysis = typeof reportData.market_analysis === 'string'
      ? JSON.parse(reportData.market_analysis)
      : reportData.market_analysis;

    const response = {
      ...parsedReportData,
      marketAnalysis: parsedMarketAnalysis,
      payment_status: reportData.payment_status,
      created_at: reportData.created_at
    };

    res.json(response);
    
  } catch (error) {
    console.error('❌ Error fetching report:', error);
    res.status(500).json({ error: 'Failed to load report' });
  }
});

// Direct market analysis endpoint
app.post('/api/perplexity-analysis', async (req, res) => {
  const { jobTitle, industry, location, yearsExperience } = req.body;
  
  console.log('=== DIRECT ANALYSIS REQUEST ===');
  
  try {
    const analysisData = await getMarketAnalysis({ jobTitle, industry, location, yearsExperience });
    res.json(analysisData);
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    res.status(500).json({ error: 'Failed to get market analysis' });
  }
});

// ==========================================
// POLAR WEBHOOK - HANDLES PAYMENT COMPLETION
// ==========================================
app.post('/api/webhooks/polar', async (req, res) => {
  try {
    const event = req.body;
    console.log('📨 POLAR WEBHOOK RECEIVED:', JSON.stringify(event, null, 2));

    if (event.type === 'checkout.completed' || event.type === 'order.created') {
      const sessionId = event.data.id;
      
      console.log('✅ Payment completed for session:', sessionId);

      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

      // Fetch the report
      const { data: reportData, error: fetchError } = await supabase
        .from('reports')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (fetchError) {
        console.error('❌ Report not found:', fetchError);
        return res.status(404).json({ error: 'Report not found' });
      }

      console.log('📄 Found report');

      // Update payment status
      const { error: updateError } = await supabase
        .from('reports')
        .update({
          payment_status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('session_id', sessionId);

      if (updateError) {
        console.error('❌ Failed to update payment status:', updateError);
        return res.status(500).json({ error: 'Database update failed' });
      }

      console.log('✅ Payment status updated');

      // Parse report data
      const parsedData = typeof reportData.report_data === 'string' 
        ? JSON.parse(reportData.report_data) 
        : reportData.report_data;

      // Prepare job data
      const jobData = {
        jobTitle: parsedData.jobTitle,
        industry: parsedData.industry === 'other' 
          ? parsedData.customIndustry 
          : (INDUSTRY_MAP[parsedData.industry] || parsedData.industry),
        location: parsedData.location,
        yearsExperience: parsedData.yearsExperience
      };

      console.log('🔍 Triggering analysis');

      // Get market analysis
      try {
        const marketData = await getMarketAnalysis(jobData);

        // Save analysis
        const { error: analysisError } = await supabase
          .from('reports')
          .update({
            market_analysis: marketData,
            updated_at: new Date().toISOString()
          })
          .eq('session_id', sessionId);

        if (!analysisError) {
          console.log('✅ Analysis saved');
        }
      } catch (analysisError) {
        console.error('❌ Analysis failed:', analysisError);
      }

      return res.status(200).json({ 
        success: true,
        sessionId
      });
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('❌ WEBHOOK ERROR:', error);
    return res.status(500).json({ error: 'Webhook failed' });
  }
});

// ==========================================
// POLAR WEBHOOK - HANDLES PAYMENT COMPLETION
// ==========================================
app.post('/api/webhooks/polar', async (req, res) => {
  try {
    const event = req.body;
    console.log('📨 POLAR WEBHOOK RECEIVED:', JSON.stringify(event, null, 2));

    if (event.type === 'order.paid' || event.type === 'order.created') {
      const sessionId = event.data.id;
      
      console.log('✅ Payment event for session:', sessionId);

      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

      // Fetch the report
      const { data: reportData, error: fetchError } = await supabase
        .from('reports')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (fetchError) {
        console.error('❌ Report not found:', fetchError);
        return res.status(200).json({ received: true }); // Return 200 anyway
      }

      console.log('📄 Found report');

      // Update payment status
      const { error: updateError } = await supabase
        .from('reports')
        .update({
          payment_status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('session_id', sessionId);

      if (updateError) {
        console.error('❌ Failed to update payment:', updateError);
      } else {
        console.log('✅ Payment status updated');
      }

      // Parse report data
      const parsedData = typeof reportData.report_data === 'string' 
        ? JSON.parse(reportData.report_data) 
        : reportData.report_data;

      // Prepare job data
      const jobData = {
        jobTitle: parsedData.jobTitle,
        industry: parsedData.industry === 'other' 
          ? parsedData.customIndustry 
          : (INDUSTRY_MAP[parsedData.industry] || parsedData.industry),
        location: parsedData.location,
        yearsExperience: parsedData.yearsExperience
      };

      console.log('🔍 Triggering analysis');

      // Get market analysis
      try {
        const marketData = await getMarketAnalysis(jobData);

        // Save analysis
        const { error: analysisError } = await supabase
          .from('reports')
          .update({
            market_analysis: marketData,
            updated_at: new Date().toISOString()
          })
          .eq('session_id', sessionId);

        if (!analysisError) {
          console.log('✅ Analysis saved');
        }
      } catch (analysisError) {
        console.error('❌ Analysis failed:', analysisError);
      }

      return res.status(200).json({ 
        success: true,
        sessionId
      });
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('❌ WEBHOOK ERROR:', error);
    return res.status(200).json({ received: true }); // Always return 200 to Polar
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
  console.log(`📍 Webhook: http://localhost:${PORT}/api/webhooks/polar`);
});