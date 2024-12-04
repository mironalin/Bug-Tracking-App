import { GithubRepoCard } from "@/components/github-repo-card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

function App() {
  interface Project {
    id: number;
    name: string;
    description: string;
    repositoryUrl: string;
    createdAt: string;
    updatedAt: string;
  }

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      const res = await api.projects.$get();
      const data = await res.json();
      setProjects(data.projects);
    }
    fetchProjects();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">GitHub Repositories</h1>
        <ScrollArea className="h-[600px] w-full rounded-md border p-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <GithubRepoCard key={project.id} repo={project} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </main>
  );
}

export default App;
