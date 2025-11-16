import { useLocation, Link } from 'react-router-dom';
import { routeConfig } from '@/router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className="w-[min(calc(100%-2rem),var(--prose-max))] mx-auto my-12 flex gap-2 flex-wrap justify-between border-t pt-6">
      {prevRoute ? (
        <button
          type="button"
          className={cn(
            'border px-2 py-2 rounded-md transition-[background-color] duration-200 cursor-pointer ',
            'bg-background hover:bg-foreground group'
          )}
        >
          <Link
            to={prevRoute.path}
            className={cn(
              'flex text-xs items-center gap-1 font-medium',
              'transition-[color] duration-200',
              ' group-hover:text-background'
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            {prevRoute.name}
          </Link>
        </button>
      ) : (
        <div /> // Empty div for spacing
      )}
      {nextRoute ? (
        <button
          type="button"
          className={cn(
            'border px-2 py-2 rounded-md transition-[background-color] duration-200 cursor-pointer ',
            'bg-background hover:bg-foreground group'
          )}
        >
          <Link
            to={nextRoute.path}
            className={cn(
              'flex text-xs items-center gap-1 font-medium',
              'transition-[color] duration-200',
              ' group-hover:text-background'
            )}
          >
            {nextRoute.name}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </button>
      ) : (
        <div /> // Empty div for spacing
      )}
    </div>
  );
}
