import ProtectedPageContainer from "@/components/ProtectedPageContainer";
import { __PageTransition } from "@/lib/animation";
import { motion } from "framer-motion";

// randomizer
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const randomString = (length) => {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const NotificationsPage = () => {
  return (
    <ProtectedPageContainer>
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative min-h-screen w-full pt-24 pb-36"
      >
        <h1 className="text-4xl font-bold">Notifications</h1>

        <div className="mt-8 flex flex-col gap-2">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <div
                key={`notification-loading-${i}`}
                className="flex items-center gap-4 p-4 bg-base-200 rounded-lg shadow-sm"
              >
                <div
                  style={{
                    animationDelay: `${i * 200}ms`,
                  }}
                  className="w-12 h-12 bg-zinc-500 bg-opacity-40 animate-pulse rounded-full"
                />
                <div className="flex flex-col justify-center gap-0">
                  <h2
                    style={{
                      animationDelay: `${i * 200}ms`,
                    }}
                    className="text-lg font-bold bg-zinc-500 bg-opacity-40 animate-pulse text-transparent max-w-fit"
                  >
                    {Array(5)
                      .fill(0)
                      .map((_, i) =>
                        randomString(Math.floor(Math.random() * 10))
                      )}
                  </h2>
                  <p
                    style={{
                      animationDelay: `${i * 200}ms`,
                    }}
                    className="bg-zinc-500 bg-opacity-40 animate-pulse text-transparent"
                  >
                    {Array(10)
                      .fill(0)
                      .map((_, i) =>
                        randomString(Math.floor(Math.random() * 10))
                      )}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </motion.main>
    </ProtectedPageContainer>
  );
};

export default NotificationsPage;
