"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from "motion/react";
import { FolderLockIcon, LockKeyholeOpenIcon } from "../icons";

export default function BottomBar() {
  const { data: session } = useSession();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 w-[calc(100%-4rem)] md:w-fit left-1/2 -translate-x-1/2 z-20"
    >
      <div className="flex items-center justify-between gap-4 px-2 py-1.5 bg-stone-100/50 dark:bg-neutral-900/50 backdrop-blur-lg rounded-full border border-stone-200/75 dark:border-neutral-800/75">
        {session ? (
          <>
            <span className="text-xs md:text-sm text-stone-600 dark:text-stone-400 flex flex-row items-center gap-0.5">
              <LockKeyholeOpenIcon size={14} className="ml-1 mr-2" /> You have proper
              access to edit this toread list, yay!
            </span>
            <button
              onClick={() => signOut()}
              className="whitespace-nowrap text-xs md:text-sm px-3 py-1 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-700 dark:hover:bg-stone-200 transition-all"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <span className="text-xs md:text-sm text-stone-600 dark:text-stone-400 flex flex-row items-center gap-0.5">
              <FolderLockIcon size={14} className="ml-1 mr-2" /> You could only
              view this toread list but cannot edit.
            </span>
            <button
              onClick={() => signIn("github")}
              className="whitespace-nowrap text-xs md:text-sm px-3 py-1 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-700 dark:hover:bg-stone-200 transition-all"
            >
              Try Login
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
