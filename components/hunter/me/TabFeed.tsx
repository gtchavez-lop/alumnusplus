import { FC, useEffect, useState } from "react";

import { $SolidHunterAccountData } from "@/lib/globalstore";
import FeedCard from "../FeedCard";
import { H_FetchHunterFeedPersonal } from "@/lib/helpers";
import { IUserHunter } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

const TabFeed: FC = () => {
  const [globalHunterUser, setGlobalHunterUser] = useState<IUserHunter>($SolidHunterAccountData.get() as IUserHunter)

  useEffect(() => {
    setGlobalHunterUser($SolidHunterAccountData.get() as IUserHunter)
  }, [])

  const hunterFeed = useQuery({
    queryKey: ["h.hunterFeed", globalHunterUser.username],
    enabled: globalHunterUser.username !== "",
    queryFn: () => H_FetchHunterFeedPersonal({ target: globalHunterUser.id }),
    refetchOnWindowFocus: false,
  })

  return <div className="flex flex-col gap-3">
    {hunterFeed.isLoading && (
      <div className="flex items-center justify-center py-24">
        <div className="loading loading-spinner" />
      </div>
    )}
    {hunterFeed.isFetched && hunterFeed.data?.map((feed, i) => (
      <FeedCard key={`hunter.${globalHunterUser.username}.feedcard.${i + 1}`} data={feed} />
    ))}
  </div>;
}

export default TabFeed;