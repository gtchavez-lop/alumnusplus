import { FC } from "react"
import Link from "next/link"

type RecommendedHunterCardProps = {
  data: {
    id: string,
    username: string,
    full_name: {
      first: string,
      last: string
    },
    avatar_url: string,
  }
}

const RecommendedHunterCard: FC<RecommendedHunterCardProps> = ({ data }) => {
  return (
    <div className="flex justify-between items-center p-2 rounded-box">
      <Link href={`/hunter/${data.username}`} className="flex items-center gap-2">
        <img src={data.avatar_url ?? "https://via.placeholder.com/100"} height={32} width={32} className="rounded-full" alt="" />
        <div className="flex flex-col justify-center">
          <p className="leading-none">@{data.username}</p>
          <p className="leading-none text-sm opacity-50">{data.full_name.first} {data.full_name.last}</p>
        </div>
      </Link>
      <button className="link link-primary no-underline ml-auto" type="button">
        Follow
      </button>
    </div>
  )
}

export default RecommendedHunterCard