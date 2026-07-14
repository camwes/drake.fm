import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SalonCollection } from "@/components/salon-collection";
import { getCollection, getCollections } from "@/lib/salon";

type SalonCollectionPageProps = {
  params: Promise<{
    collection: string;
  }>;
};

export function generateStaticParams() {
  return getCollections().map((collection) => ({ collection: collection.id }));
}

export async function generateMetadata({
  params,
}: SalonCollectionPageProps): Promise<Metadata> {
  const { collection: id } = await params;
  const collection = getCollection(id);

  if (!collection) {
    return {};
  }

  return {
    title: `${collection.title} — Salon — Drake.fm`,
    description: collection.description,
  };
}

export default async function SalonCollectionPage({
  params,
}: SalonCollectionPageProps) {
  const { collection: id } = await params;
  const collection = getCollection(id);

  if (!collection) {
    notFound();
  }

  return <SalonCollection collection={collection} />;
}
