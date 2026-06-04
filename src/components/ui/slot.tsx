import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Minimal local Slot — merges this component's props onto a single child
 * element (className is merged, child's own props win). Covers the
 * `<Button asChild><Link/></Button>` pattern without pulling in
 * @radix-ui/react-slot.
 */
export const Slot = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }
>(({ children, className, ...props }, ref) => {
  if (!React.isValidElement(children)) return null;

  const child = children as React.ReactElement<
    Record<string, unknown> & { className?: string }
  >;

  return React.cloneElement(child, {
    ...props,
    ...child.props,
    className: cn(className, child.props.className),
    ref,
  } as Record<string, unknown>);
});
Slot.displayName = "Slot";
