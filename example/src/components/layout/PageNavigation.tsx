import { useLocation, Link } from 'react-router-dom';
import { routeConfig } from '@/router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PageNavigation() {
  // Flatten the route config inside the component to avoid circular dependency issues.
  const flattenedRoutes = routeConfig.flatMap((section) =>
    section.children.map((child) => ({
      path: `/${section.path}/${child.path}`,
      name: child.name,
    }))
  );

  const location = useLocation();
  const currentIndex = flattenedRoutes.findIndex(
    (route) => route.path === location.pathname
  );

  if (currentIndex === -1) {
    return null;
  }

  const prevRoute = currentIndex > 0 ? flattenedRoutes[currentIndex - 1] : null;
  const nextRoute =
    currentIndex < flattenedRoutes.length - 1
      ? flattenedRoutes[currentIndex + 1]
      : null;

  return (
    <div className="w-[min(calc(100%-2rem),var(--prose-max))] mx-auto my-12 flex justify-between border-t pt-6">
      {prevRoute ? (
        <Button variant="outline" asChild>
          <Link to={prevRoute.path} className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            {prevRoute.name}
          </Link>
        </Button>
      ) : (
        <div /> // Empty div for spacing
      )}
      {nextRoute ? (
        <Button variant="outline" asChild>
          <Link to={nextRoute.path} className="flex items-center gap-2">
            {nextRoute.name}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <div /> // Empty div for spacing
      )}
    </div>
  );
}
