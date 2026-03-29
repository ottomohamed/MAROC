import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ADMIN_KEY = Deno.env.get('ADMIN_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, x-admin-key, authorization',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const adminKey = req.headers.get('x-admin-key')
  if (adminKey !== ADMIN_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  const { action, id, data } = await req.json()

  let result
  if (action === 'insert') {
    result = await supabase.from('articles').insert(data)
  } else if (action === 'update') {
    result = await supabase.from('articles').update(data).eq('id', id)
  } else if (action === 'delete') {
    result = await supabase.from('articles').delete().eq('id', id)
  } else {
    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
})
