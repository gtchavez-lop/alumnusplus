import { FiSearch, FiUsers } from "react-icons/fi";
import { useEffect, useState } from "react";

const MeConnections = ({ connections }) => {
  const [localConnections, setLocalConnections] = useState();

  useEffect(() => {
    setLocalConnections(connections);
  }, [connections]);

  return (
    <>
      {localConnections?.length < 1 && (
        <div className="flex flex-col items-center justify-center h-full mt-16">
          <div className="flex flex-col items-center gap-2">
            <FiUsers className="text-4xl" />
            <p className="text-xl">No connections yet</p>
          </div>
        </div>
      )}
    </>
  );
};

export default MeConnections;
