import { GithubRepoCard } from "@/components/github-repo-card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function fetchProjects() {
  const res = await api.projects.$get();
  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }
  return await res.json();
}

function App() {
  const { isPending, error, data } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  if (isPending) return "Loading...";

  if (error) return "An error occurred: " + error.message;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">GitHub Repositories</h1>
        <ScrollArea className="h-[600px] w-full rounded-md border p-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.projects.map((project) => (
              <GithubRepoCard key={project.id} repo={project} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </main>
  );
}

export default App;
