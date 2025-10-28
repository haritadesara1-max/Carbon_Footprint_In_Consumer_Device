import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { requestId, type } = await req.json();
    
    // Use anon key with JWT for proper RLS enforcement
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } }
      }
    );

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get request details
    const { data: request, error: requestError } = await supabase
      .from('ewaste_requests')
      .select('*, profiles(*)')
      .eq('id', requestId)
      .single();

    if (requestError || !request) {
      return new Response(
        JSON.stringify({ error: 'Request not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the authenticated user owns this request
    if (request.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: You can only generate certificates for your own requests' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate certificate URL (simplified - in production, use a PDF library)
    const certificateUrl = `https://certificates.carbontrackr.com/${requestId}.pdf`;
    
    // Update request with certificate
    await supabase
      .from('ewaste_requests')
      .update({ certificate_url: certificateUrl })
      .eq('id', requestId);

    // Create certificate record
    await supabase
      .from('certificates')
      .insert({
        user_id: request.user_id,
        certificate_type: type === 'csr' ? 'CSR/ESG Certificate' : 'E-Waste Certificate',
        certificate_url: certificateUrl,
        reference_id: requestId
      });

    // Update user stats
    const { data: stats } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', request.user_id)
      .single();

    await supabase
      .from('user_points')
      .update({
        pickups_completed: (stats?.pickups_completed || 0) + 1,
        certificates_earned: (stats?.certificates_earned || 0) + 1
      })
      .eq('user_id', request.user_id);

    return new Response(
      JSON.stringify({ success: true, certificateUrl }),
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
