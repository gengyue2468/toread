export default function Hero({
  status,
  stats,
}: {
  status: string;
  stats: { unread: number; read: number };
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
          There’s <span className="text-neutral-500">{stats.read}</span> URLs
          you’ve read yet.
        </h1>
        <h1>
          And <span className="text-neutral-500">{stats.unread}</span> left.
        </h1>
      </div>
    </div>
  );
}
