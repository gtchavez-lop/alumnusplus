import { __supabase } from "@/supabase";
import { globalUserState } from "@/lib/stores";
import { useAtom } from "jotai";

const TestPage = () => {
  const [output, setOutput] = useAtom(globalUserState);

  return <div className="py-32">{JSON.stringify(output)}</div>;
};

export default TestPage;
