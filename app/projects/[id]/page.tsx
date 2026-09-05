import mockProjects from "@/data/mockProjects.json";
import ProjectDetailClient from "@/components/projects/ProjectDetailClient";

export function generateStaticParams() {
  return mockProjects.map((p) => ({
    id: p.id,
  }));
}

export default async function ProjectFullPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectDetailClient id={id} />;
}
