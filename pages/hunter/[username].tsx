import { GetStaticPaths, GetStaticProps, NextPage } from "next"

import $supabase from "@/lib/supabase"
import { IUserHunter } from "@/lib/types"

type HunterPageProps = {
  params: {
    username: string
  },
  data: IUserHunter
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data, error } = await $supabase.from("user_hunters").select("username")

  if (error) {
    console.error(error)
    return {
      paths: [
        {
          params: { username: "error" },
        }
      ],
      fallback: "blocking"
    }
  }

  const paths = data.map((hunter) => ({
    params: { username: hunter.username },
  }))

  return {
    paths,
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context
  const { data, error } = await $supabase
    .from("user_hunters")
    .select("*")
    .eq("username", params?.username)
    .single()

  if (error) {
    console.error(error)
    return {
      props: {
        params: {
          username: "error"
        },
      }
    }
  }

  return {
    props: {
      params,
      data
    }
  }
}

const HunterPage: NextPage<HunterPageProps> = ({ params, data }) => {
  return <div>Hunter {params.username}</div>
}

export default HunterPage