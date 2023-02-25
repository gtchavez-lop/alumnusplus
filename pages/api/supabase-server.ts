import type { NextApiRequest, NextApiResponse } from 'next'

import type { Database } from '@/lib/types'
import {createServerSupabaseClient} from '@supabase/auth-helpers-nextjs'

const APIHandler =  async (req: NextApiRequest, res: NextApiResponse) => {
  const supabaseServerClient = createServerSupabaseClient<Database>({
    req,res
  })

  const {data: {user}} = await supabaseServerClient.auth.getUser()

  res.status(200).json({user})
}

export default APIHandler