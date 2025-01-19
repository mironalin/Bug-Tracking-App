import { TaskViewSwitcher } from '@/features/tasks/components/task-view-switcher'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/workspaces/$workspaceId/tasks/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher />
    </div>
  )
}
