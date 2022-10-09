import { useEffect, useState } from "react";

const MeConnectionCard = ({ userData }) => {
  return (
    <>
      <div className="w-full text-center h-max bg-base-300 bg-opacity-50 p-4 rounded-box flex flex-col justify-center">
        <div className="flex flex-col items-center gap-2">
          <img
            // dicebear api
            src={`https://avatars.dicebear.com/api/micah/${userData.user_id}.svg`}
            className="rounded-full w-24 h-24 lg:w-32 lg:h-32 bg-secondary"
          />
          <div className="flex flex-col gap-2 leading-none mt-5">
            <p className="">
              {userData.data.first_name} {userData.data.last_name}
            </p>
            <p className="text-sm opacity-50 leading-none">
              @{userData.data.username}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MeConnectionCard;
