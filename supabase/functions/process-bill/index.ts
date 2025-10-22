import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// State-wise emission factors (kg CO₂ per kWh)
const emissionFactors: Record<string, number> = {
  'Andhra Pradesh': 0.85, 'Arunachal Pradesh': 0.45, 'Assam': 0.82,
  'Bihar': 0.93, 'Chhattisgarh': 1.05, 'Goa': 0.65, 'Gujarat': 1.27,
  'Haryana': 0.88, 'Himachal Pradesh': 0.42, 'Jharkhand': 0.95,
  'Karnataka': 0.74, 'Kerala': 0.66, 'Madhya Pradesh': 0.97,
  'Maharashtra': 0.92, 'Manipur': 0.46, 'Meghalaya': 0.48,
  'Mizoram': 0.42, 'Nagaland': 0.44, 'Odisha': 1.04,
  'Punjab': 0.81, 'Rajasthan': 1.01, 'Sikkim': 0.40,
  'Tamil Nadu': 0.70, 'Telangana': 0.82, 'Tripura': 0.55,
  'Uttar Pradesh': 0.89, 'Uttarakhand': 0.62, 'West Bengal': 0.85,
  'India': 0.703
};

// Extract units from OCR text
function extractUnitsFromText(text: string): number | null {
  if (!text) return null;
  
  // Try multiple regex patterns to find units
  const patterns = [
    /(\d{1,3}(?:[,\.\s]\d{3})*(?:\.\d+)?)\s*kWh/i,
    /units?\s*consumed?\s*:?\s*(\d{1,3}(?:[,\.\s]\d{3})*(?:\.\d+)?)/i,
    /total\s*units?\s*:?\s*(\d{1,3}(?:[,\.\s]\d{3})*(?:\.\d+)?)/i,
    /energy\s*consumed?\s*:?\s*(\d{1,3}(?:[,\.\s]\d{3})*(?:\.\d+)?)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = match[1].replace(/[,\s]/g, '');
      return parseFloat(value);
    }
  }
  
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { billUrl, monthYear, state } = await req.json();
    
    let electricityUnits = null;
    let ocrText = '';
    
    // Try OCR with enhanced prompt
    if (billUrl) {
      try {
        // Use Lovable AI for OCR (Vision capability)
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY') || ''}`
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [{
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'You are an expert at reading electricity bills. Look at this electricity bill image carefully and find the TOTAL electricity units consumed in kWh. Look for labels like "Units Consumed", "Total Units", "Energy Consumed", "kWh Used", or similar. The number is usually prominent and may have commas or spaces. Extract ONLY that number, nothing else. If you find it, respond with just the number (e.g., "450" or "1250.5"). If you cannot find it clearly, respond with "NOT_FOUND".'
                },
                {
                  type: 'image_url',
                  image_url: { url: billUrl }
                }
              ]
            }]
          })
        });
        
        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          ocrText = aiData.choices?.[0]?.message?.content || '';
          console.log('OCR Response:', ocrText);
          
          // Try to extract units from response
          if (ocrText && ocrText.trim() !== 'NOT_FOUND') {
            electricityUnits = extractUnitsFromText(ocrText);
          }
        }
      } catch (ocrError) {
        console.error('OCR failed:', ocrError);
      }
    }
    
    // Calculate carbon emissions using state-specific factor
    const emissionFactor = emissionFactors[state] || emissionFactors['India'];
    const carbonEmissions = electricityUnits ? electricityUnits * emissionFactor : null;
    
    return new Response(
      JSON.stringify({ 
        electricity_units: electricityUnits,
        carbon_emissions: carbonEmissions,
        emission_factor: emissionFactor,
        ocr_text: ocrText
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
