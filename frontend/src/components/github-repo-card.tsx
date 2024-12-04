import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitFork, Star, Calendar, RefreshCw } from "lucide-react";

interface Repository {
  id: number;
  name: string;
  description: string;
  repositoryUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface GithubRepoCardProps {
  repo: Repository;
}

export function GithubRepoCard({ repo }: GithubRepoCardProps) {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{repo.name}</CardTitle>
          <Badge variant="secondary" className="text-xs">
            ID: {repo.id}
          </Badge>
        </div>
        <CardDescription>{repo.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            <span>Created: {formatDate(repo.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <RefreshCw className="mr-1 h-4 w-4" />
            <span>Updated: {formatDate(repo.updatedAt)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Star className="mr-1 h-4 w-4" />
            Star
          </Button>
          <Button variant="outline" size="sm">
            <GitFork className="mr-1 h-4 w-4" />
            Fork
          </Button>
        </div>
        <Button variant="default" size="sm" asChild>
          <a href={repo.repositoryUrl} target="_blank" rel="noopener noreferrer">
            View Repository
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
