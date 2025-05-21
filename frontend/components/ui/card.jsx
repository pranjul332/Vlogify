import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Enhanced Card component with variants, hover effects, and animation options
 */
const cardVariants = cva("rounded-lg border transition-all duration-200", {
  variants: {
    variant: {
      default:
        "border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
      outline: "border-slate-200 bg-transparent dark:border-slate-800",
      primary:
        "border-primary/20 bg-primary/5 text-primary-foreground dark:border-primary/30 dark:bg-primary/10",
      destructive:
        "border-destructive/20 bg-destructive/5 text-destructive-foreground dark:border-destructive/30 dark:bg-destructive/10",
      secondary:
        "border-secondary/20 bg-secondary/5 text-secondary-foreground dark:border-secondary/30 dark:bg-secondary/10",
      accent:
        "border-transparent bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40",
      ghost: "border-transparent shadow-none",
    },
    size: {
      default: "",
      sm: "p-2",
      lg: "p-8",
    },
    hover: {
      true: "hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5",
      scale: "hover:shadow-md hover:scale-[1.01] transition-transform",
      glow: "hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/5",
      none: "",
    },
    animation: {
      fadeIn: "animate-fade-in",
      slideUp: "animate-slide-up",
      pulse: "animate-pulse",
      none: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    hover: "none",
    animation: "none",
  },
});

/**
 * Enhanced Card component with improved styling and features
 */
const Card = React.forwardRef(
  ({ className, variant, size, hover, animation, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, size, hover, animation }),
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

/**
 * Enhanced CardHeader with improved styling and gradient options
 */
const CardHeader = React.forwardRef(
  (
    {
      className,
      gradient = false,
      gradientFrom,
      gradientTo,
      rounded = false,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 p-6",
        rounded && "rounded-t-lg",
        gradient && [
          "bg-gradient-to-r",
          gradientFrom ? `from-${gradientFrom}` : "from-indigo-500",
          gradientTo ? `to-${gradientTo}` : "to-purple-600",
        ],
        gradient && "text-white",
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

/**
 * Enhanced CardTitle with improved typography options
 */
const CardTitle = React.forwardRef(
  ({ className, gradient = false, as = "h3", ...props }, ref) => {
    const Component = as;

    return (
      <Component
        ref={ref}
        className={cn(
          "text-2xl font-semibold leading-none tracking-tight",
          gradient &&
            "bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent",
          className
        )}
        {...props}
      />
    );
  }
);
CardTitle.displayName = "CardTitle";

/**
 * Enhanced CardDescription with improved styling
 */
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-500 dark:text-slate-400", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/**
 * Enhanced CardContent with improved padding options
 */
const CardContent = React.forwardRef(
  ({ className, noPaddingTop = true, padding = "default", ...props }, ref) => {
    const paddingClasses = {
      none: "",
      sm: "px-4 py-3",
      default: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          paddingClasses[padding],
          noPaddingTop && padding === "default" && "pt-0",
          className
        )}
        {...props}
      />
    );
  }
);
CardContent.displayName = "CardContent";

/**
 * Enhanced CardFooter with alignment and border options
 */
const CardFooter = React.forwardRef(
  ({ className, align = "start", bordered = false, ...props }, ref) => {
    const alignmentClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center p-6 pt-0",
          alignmentClasses[align],
          bordered &&
            "border-t border-slate-200 dark:border-slate-800 mt-6 pt-6",
          className
        )}
        {...props}
      />
    );
  }
);
CardFooter.displayName = "CardFooter";

/**
 * New component: CardMedia for images and media content
 */
const CardMedia = React.forwardRef(
  (
    {
      className,
      src,
      alt = "",
      fill = false,
      rounded = false,
      ratio = null,
      ...props
    },
    ref
  ) => {
    const aspectRatioClasses = {
      "1:1": "aspect-square",
      "16:9": "aspect-video",
      "4:3": "aspect-4/3",
      "3:2": "aspect-3/2",
      "2:1": "aspect-2/1",
    };

    return (
      <div
        className={cn(
          "overflow-hidden",
          rounded && "rounded-t-lg",
          ratio && aspectRatioClasses[ratio],
          className
        )}
      >
        <img
          ref={ref}
          src={src}
          alt={alt}
          className={cn(
            "object-cover w-full h-full transition-transform",
            props.hover === "zoom" && "hover:scale-105 duration-500"
          )}
          {...props}
        />
      </div>
    );
  }
);
CardMedia.displayName = "CardMedia";

/**
 * New component: CardActions for button arrays
 */
const CardActions = React.forwardRef(
  ({ className, spacing = "default", direction = "row", ...props }, ref) => {
    const spacingClasses = {
      none: "gap-0",
      sm: "gap-2",
      default: "gap-4",
      lg: "gap-6",
    };

    const directionClasses = {
      row: "flex-row",
      col: "flex-col",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center",
          spacingClasses[spacing],
          directionClasses[direction],
          className
        )}
        {...props}
      />
    );
  }
);
CardActions.displayName = "CardActions";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardMedia,
  CardActions,
};
