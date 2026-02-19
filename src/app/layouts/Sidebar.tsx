import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { useUiStore } from '@/app/store/useUIStore';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { Button } from '@/shared/ui/Button';
import { navigation } from '@/shared/constants/navigation';
import { cn } from '@/shared/lib/cn';

export function Sidebar() {
  const { sidebarOpen, sidebarCollapsed, toggleSidebar, toggleSidebarCollapsed, setSidebarCollapsed } =
    useUiStore();
  const location = useLocation();
  const isDesktop = useMediaQuery('(min-width: 1024px)', true);
  const isCollapsed = isDesktop && sidebarCollapsed;

  const initialOpenGroups = useMemo(() => {
    const open: Record<string, boolean> = {};
    for (const item of navigation) {
      if (!item.children?.length) continue;
      const key = item.label;
      open[key] = item.children.some((child) =>
        child.href ? location.pathname.startsWith(child.href) : false
      );
    }
    return open;
  }, [location.pathname]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(initialOpenGroups);

  useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      for (const [key, shouldBeOpen] of Object.entries(initialOpenGroups)) {
        if (shouldBeOpen) next[key] = true;
      }
      return next;
    });
  }, [initialOpenGroups]);

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleMobileNavClick = () => {
    if (!isDesktop && sidebarOpen) {
      toggleSidebar();
    }
  };

  if (!sidebarOpen) return null;

  return (
    <>
      {!isDesktop && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-black/40"
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r border-neutral-200 bg-white shadow-lg lg:static lg:z-auto lg:shrink-0 lg:shadow-none',
          isCollapsed ? 'w-full sm:w-72 lg:w-16' : 'w-full sm:w-72'
        )}
      >
        <div
          className={cn(
            'flex items-center border-b border-neutral-200 py-3',
            isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
          )}
        >
          {!isCollapsed && (
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-neutral-900">INTAN CMS</h2>
            </div>
          )}

          <div
            className={cn(
              'flex gap-1',
              isCollapsed ? 'w-full flex-col items-center' : 'items-center justify-end'
            )}
          >
            <Button
              className="lg:hidden"
              variant="text"
              size="sm"
              isIconOnly
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <X />
            </Button>
            <Button
              className="hidden lg:inline-flex"
              variant="text"
              size="sm"
              isIconOnly
              onClick={toggleSidebarCollapsed}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            </Button>
          </div>
        </div>

        <nav
          className={cn('flex-1 overflow-y-auto py-3', isCollapsed ? 'px-2' : 'px-2')}
          aria-label="Primary"
        >
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const key = item.label;

              if (!item.children?.length) {
                if (!item.href) return null;

              return (
                <li key={key}>
                  <NavLink
                    to={item.href}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center rounded-lg py-2 text-sm font-medium transition-colors',
                        isCollapsed ? 'justify-center px-2' : 'gap-3 px-3',
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                      )
                    }
                    title={isCollapsed ? item.label : undefined}
                    onClick={handleMobileNavClick}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={cn(
                            'h-4 w-4',
                            isActive
                              ? 'text-primary-600'
                              : 'text-neutral-500 group-hover:text-neutral-700'
                          )}
                        />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            }

              const isOpen = Boolean(openGroups[key]);

              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => {
                      if (isCollapsed) {
                        setSidebarCollapsed(false);
                        setOpenGroups((prev) => ({ ...prev, [key]: true }));
                        return;
                      }

                      toggleGroup(key);
                    }}
                    aria-expanded={isOpen}
                    className={cn(
                      'group flex w-full items-center rounded-lg py-2 text-left text-sm font-medium transition-colors',
                      isCollapsed ? 'justify-center px-2' : 'justify-between px-3',
                      'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span
                      className={cn(
                        'flex items-center',
                        isCollapsed ? 'gap-0' : 'min-w-0 gap-3'
                      )}
                    >
                      <Icon className="h-4 w-4 text-neutral-500 group-hover:text-neutral-700" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </span>
                    {!isCollapsed && (
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 text-neutral-400 transition-transform',
                          isOpen && 'rotate-180'
                        )}
                      />
                    )}
                  </button>

                  {!isCollapsed && isOpen && (
                    <ul className="mt-1 space-y-1 border-l border-neutral-200 pl-3">
                      {item.children.map((child) => {
                        if (!child.href) return null;
                        const ChildIcon = child.icon;
                        return (
                          <li key={`${key}:${child.href}`}>
                            <NavLink
                              to={child.href}
                              end={child.end}
                              className={({ isActive }) =>
                                cn(
                                  'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                  isActive
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                                )
                              }
                              onClick={handleMobileNavClick}
                            >
                              {({ isActive }) => (
                                <>
                                  <ChildIcon
                                    className={cn(
                                      'h-4 w-4',
                                      isActive
                                        ? 'text-primary-600'
                                        : 'text-neutral-500 group-hover:text-neutral-700'
                                    )}
                                  />
                                  <span className="truncate">{child.label}</span>
                                </>
                              )}
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
