import type { ToReadItem } from "@/types/item";

export default function Hero({
  status,
  itemList,
}: {
  status: string;
  itemList: ToReadItem[];
}) {
  return (
    <div>
      <div
        className={`rounded-full size-4 mb-8 ${
          status === "ok" ? "bg-green-500" : "bg-red-500"
        }`}
      />

      <div className="*:font-medium *:text-3xl space-y-2 text-balance">
        <h1>Have you read yet?</h1>
        <h1>
          There’s{" "}
          <span className="text-neutral-500">
            {itemList.filter((i) => i.status !== "unread").length}
          </span>{" "}
          URLs you’ve read yet.
        </h1>
        <h1>
          And{" "}
          <span className="text-neutral-500">
            {itemList.filter((i) => i.status === "unread").length}
          </span>{" "}
          left.
        </h1>
      </div>
    </div>
  );
}
