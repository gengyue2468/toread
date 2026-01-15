import { Metadata } from "next";
import { getToReadListById } from "@/app/api/fetchData";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    const data = await getToReadListById(id);
    const item = data.item;

    if (!item) {
      return {
        title: "Not Found - ToRead of gengyue",
      };
    }

    return {
      title: `${item.title}`,
      description: item.description || "A link in your to-read list",
      openGraph: {
        title: item.title,
        description: item.description || "A link in your to-read list",
        type: "article",
        url: item.url,
      },
      twitter: {
        card: "summary_large_image",
        title: item.title,
        description: item.description || "A link in your to-read list",
      },
    };
  } catch {
    return {
      title: "ToRead",
    };
  }
}

export default function ReadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
