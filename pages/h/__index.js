import { ___auth } from "../../lib/stores";
import useLocalStorage from "../../lib/localStorageHook";

const HunterIndexPage = () => {
  const [authState] = useLocalStorage("authState");

  return (
    <div className="py-28">
      <h1>Hunter Index Page</h1>

      <pre>
        <code>{JSON.stringify(authState, null, 2)}</code>
      </pre>
    </div>
  );
};

export default HunterIndexPage;
