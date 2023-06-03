import { FC, useEffect, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";

import { $SolidHunterAccountData } from "@/lib/globalstore";
import { H_FetchConnections } from "@/lib/helpers";
import { IUserHunter } from "@/lib/types";

const TabConnections: FC = () => {
  const [globalHunterUser, setGlobalHunterUser] = useState<IUserHunter>($SolidHunterAccountData.get() as IUserHunter)



  useEffect(() => {
    setGlobalHunterUser($SolidHunterAccountData.get() as IUserHunter)
  }, [])


  const [connections] = useQueries({
    queries: [
      {
        queryKey: ["h.connections", globalHunterUser.username],
        enabled: globalHunterUser.id !== "",
        queryFn: () => {
          H_FetchConnections({ target: globalHunterUser.connections })
        },
        refetchOnWindowFocus: false,
      }
    ]
  })

  // const connections = useQuery({
  //   queryKey: ["h.connections", globalHunterUser.username],
  //   enabled: globalHunterUser.id !== "",
  //   queryFn: () => {
  //     H_FetchConnections({ target: globalHunterUser.connections })
  //   },
  //   refetchOnWindowFocus: false,
  // })

  return <div>
    <h1 className="text-4xl font-bold">Connections</h1>

    {connections.isFetching && (
      <div className="w-full py-24">
        <div className="loading loading-spinner" />
      </div>
    )}
    {connections.isError && (
      <div className="alert alert-error mt-10">
        <p>
          Something went wrong while fetching your connections. Please try again later.
        </p>
      </div>
    )}
  </div>;
}

export default TabConnections;