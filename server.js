const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Global variable to store form data temporarily
let pendingFormData = {};

// Debug: Check if environment variables are loaded
console.log('Environment variables check:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Loaded' : 'Missing');
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? 'Loaded' : 'Missing');

app.use(cors());
app.use(express.json());

// Industry mapping - add this after line 17
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

// Helper function to get market analysis
async function getMarketAnalysis({ jobTitle, industry, location, yearsExperience }) {
  console.log('=== PERPLEXITY REQUEST DEBUG ===');
  console.log('Request parameters:', { jobTitle, industry, location, yearsExperience });
  
  try {
    // Get Perplexity API key from Supabase
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    
const apiKey = process.env.PERPLEXITY_API_KEY;

console.log('Using API key:', apiKey ? 'Found' : 'Missing');

console.log('API key starts with:', apiKey?.substring(0, 10));

    // Create the prompt
    const prompt = `Analyze the current job market and salary expectations for a ${jobTitle} in the ${industry} industry, located in ${location}, with ${yearsExperience} years of experience. 

Provide specific insights on:
1. Current market demand and trends
2. Salary ranges (local and USD)
3. Key skills in demand
4. Notable achievements to highlight
5. Regional market factors
6. Hiring trends and demand outlook

Please format your response as JSON with this structure:
{
  "marketTarget": {"local": 130000, "usd": 130000},
  "premiumsNote": "Brief note about salary factors",
  "demandNotes": ["High demand insight", "Another demand point"],
  "regionalNotes": ["Regional market insight"],
  "macroNotes": ["Economic factor"],
  "hiringNotes": ["Hiring trend 1", "Hiring trend 2"],
  "citations": [{"title": "Source Name", "url": "https://example.com"}],
  "highDemand": true,
  "locationPremium": true
}

Use the most current salary data available. Be specific with numbers.`;

    console.log('Prompt being sent:', prompt);

    const requestBody = {
      model: "sonar-pro",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1
    };

    console.log('Full request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Perplexity response status:', response.status);
    console.log('Perplexity response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Perplexity error response:', errorText);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Perplexity success response keys:', Object.keys(data));
    console.log('Message content:', data.choices[0].message.content);
    
    const content = data.choices[0].message.content;
    console.log('Raw content to parse:', content);

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      console.log('Found JSON match:', jsonMatch[0]);
      try {
        const marketData = JSON.parse(jsonMatch[0]);
        console.log('Successfully parsed market data:', marketData);
        
        // Transform the data to match frontend expectations
        const transformedData = {
          ...marketData,
          // Add any fields your frontend might be looking for
          usd: marketData.marketTarget?.usd || marketData.marketTarget?.local,
          local: marketData.marketTarget?.local || marketData.marketTarget?.usd,
          // Ensure all expected fields exist
          marketTarget: marketData.marketTarget,
          premiumsNote: marketData.premiumsNote || "",
          demandNotes: marketData.demandNotes || [],
          regionalNotes: marketData.regionalNotes || [],
          macroNotes: marketData.macroNotes || [],
          hiringNotes: marketData.hiringNotes || [],
          citations: marketData.citations || [],
          highDemand: marketData.highDemand || false,
          locationPremium: marketData.locationPremium || false
        };
        
        console.log('Transformed data for frontend:', transformedData);
        return transformedData;
      } catch (parseError) {
        console.log('JSON parse error:', parseError.message);
        console.log('Failed to parse this JSON:', jsonMatch[0]);
        throw new Error('Failed to parse market analysis JSON');
      }
    } else {
      console.log('No JSON found in response, raw content:', content);
      // Return a default structure if no JSON found
      return {
        marketTarget: { local: 150000, usd: 150000 },
        premiumsNote: "Based on current market analysis",
        demandNotes: ["High demand for data science skills"],
        regionalNotes: ["San Francisco Bay Area premium"],
        macroNotes: ["Technology sector growth"],
        hiringNotes: ["Strong hiring demand"],
        citations: [],
        highDemand: true,
        locationPremium: true
      };
    }

  } catch (error) {
    console.log('=== FULL ERROR DETAILS ===');
    console.log('Error message:', error.message);
    console.log('Error stack:', error.stack);
    throw error;
  }
}

// Test Supabase connection
app.get('/api/test-supabase', async (req, res) => {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    
    const { data, error } = await supabase.from('api_keys').select('service_name').limit(1);
    
    if (error) {
      res.json({ error: error.message });
    } else {
      res.json({ success: true, data });
    }
  } catch (err) {
    res.json({ error: err.message });
  }
});

// Debug API key retrieval
app.get('/api/debug-keys', async (req, res) => {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    
    const { data, error } = await supabase
      .from('api_keys')
      .select('service_name, api_key')
      .eq('service_name', 'perplexity');
    
    res.json({ 
      data: data?.map(row => ({ 
        service_name: row.service_name, 
        has_key: !!row.api_key,
        key_length: row.api_key?.length || 0,
        key_start: row.api_key?.substring(0, 10) || 'none'
      })) 
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// Get user data and trigger fresh market analysis
app.get('/api/user-data/:id', async (req, res) => {
  const reportId = req.params.id;
  console.log('=== USER DATA REQUEST ===');
  console.log('Fetching user data for report:', reportId);
  
  try {
    let formData = null;
    
    // Check if we have stored form data
    console.log('Looking for form data with report ID:', reportId);
    console.log('Available form data keys:', Object.keys(pendingFormData));

    // First check: direct report ID match
    if (pendingFormData[reportId]) {
      console.log('Using stored form data (direct match):', pendingFormData[reportId]);
      formData = pendingFormData[reportId];
    }
    // Second check: converted payment ID match (fallback)
    else {
      const paymentId = reportId.replace('test-report-', 'local-payment-');
      console.log('Converted to payment ID:', paymentId);
      if (pendingFormData[paymentId]) {
        console.log('Using stored form data (converted match):', pendingFormData[paymentId]);
        formData = pendingFormData[paymentId];
      }
    }

    if (formData) {
      // Get market analysis
      const jobData = {
        jobTitle: formData.jobTitle,
        industry: formData.industry === 'other' ? formData.customIndustry : (INDUSTRY_MAP[formData.industry] || formData.industry),
        location: formData.location,
        yearsExperience: formData.yearsExperience
      };
      console.log('Converted job data:', jobData);
      const marketData = await getMarketAnalysis(jobData);
      
      // Return BOTH form data AND market data
      const response = {
        // Form data fields
        name: formData.name,
        jobTitle: formData.jobTitle,
        industry: INDUSTRY_MAP[formData.industry] || formData.customIndustry || formData.industry,
        customIndustry: formData.customIndustry,
        location: formData.location,
        yearsExperience: formData.yearsExperience,
        currentSalary: formData.currentSalary,
        companyName: formData.companyName,
        achievement: formData.achievement,
        // Market data fields
        ...marketData
      };
      
      return res.json(response);
    }

    // Fallback to defaults if no form data found
    console.log('No form data found, using defaults');
    const defaultData = {
      jobTitle: "Data Scientist",
      industry: "Technology", 
      location: "San Francisco, CA",
      yearsExperience: "5"
    };
    
    const marketData = await getMarketAnalysis(defaultData);
    return res.json({
      name: "Professional User",
      jobTitle: defaultData.jobTitle,
      industry: defaultData.industry,
      location: defaultData.location,
      yearsExperience: defaultData.yearsExperience,
      currentSalary: "0",
      ...marketData
    });
    
  } catch (error) {
    console.log('Error in user-data endpoint:', error.message);
    res.status(500).json({ error: 'Failed to load report data' });
  }
});

// Original perplexity-analysis endpoint (kept for direct API calls)
app.post('/api/perplexity-analysis', async (req, res) => {
  const { jobTitle, industry, location, yearsExperience } = req.body;
  
  try {
    const analysisData = await getMarketAnalysis({ jobTitle, industry, location, yearsExperience });
    res.json(analysisData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get market analysis' });
  }
});

// Razorpay init endpoint (FIXED - removed duplicate)
app.post('/api/razorpay-init', async (req, res) => {
  try {
    console.log('=== RAZORPAY INIT REQUEST ===');
    const { userEmail, formData } = req.body;
    console.log('User email:', userEmail);
    console.log('Form data:', formData);
    
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    console.log('Razorpay key available:', !!razorpayKeyId);
    
    if (!razorpayKeyId) {
      throw new Error('Razorpay Key ID not configured');
    }
    
    const paymentId = 'local-payment-' + Date.now();
    
    // Store form data temporarily with paymentId as key
    pendingFormData[paymentId] = formData;
    console.log('Stored form data for payment:', paymentId);
    
    const response = {
      razorpayKeyId: razorpayKeyId,
      paymentId: paymentId,
      amount: 1000,
      currency: 'USD'
    };
    
    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Razorpay init error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Razorpay verify endpoint
app.post('/api/razorpay-verify', async (req, res) => {
  try {
    console.log('=== RAZORPAY VERIFY REQUEST ===');
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, paymentId } = req.body;
    console.log('Payment verification data:', { razorpayPaymentId, razorpayOrderId, paymentId });
    
    // Get the stored form data
    const formData = pendingFormData[paymentId];
    console.log('Retrieved form data:', formData);
    
    let reportId = 'test-report-' + Date.now();
    
    if (formData) {
      // Save to Supabase (keep trying this for when it works)
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
      
      const { data, error } = await supabase
        .from('reports')
        .insert({
          report_data: {
            profile: {
              name: formData.name,
              role: formData.jobTitle,
              industry: formData.industry === 'other' ? formData.customIndustry : (INDUSTRY_MAP[formData.industry] || formData.industry),
              location: formData.location,
              experience: formData.yearsExperience,
              currentSalary: formData.currentSalary,
              companyName: formData.companyName,
              achievement: formData.achievement
            }
          }
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error saving to database:', error);
      } else {
        console.log('Successfully saved form data to database:', data.id);
        reportId = data.id;
      }
      
      // Store form data with report ID as key for fallback
      pendingFormData[reportId] = formData;
      console.log('Stored form data with report ID:', reportId);
    }
    
    const response = {
      success: true,
      reportId: reportId
    };
    
    console.log('Verification response:', response);
    res.json(response);
  } catch (error) {
    console.error('Razorpay verify error:', error.message);
    res.status(500).json({ error: error.message });
  }
});
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
