import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

export const InviteCodeInvalidCard = () => {
  const navigate = useNavigate();
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
        <CardDescription>The invite link is not valid or has expired</CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row gap-2 items-end justify-end">
          <Button
            type="button"
            size="lg"
            className="w-full lg:w-fit"
            onClick={() => {
              navigate({ to: "/" });
            }}
          >
            Go Home
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
