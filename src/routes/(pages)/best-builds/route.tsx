import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/(pages)/best-builds')({
  component: () => <Outlet />,
});
