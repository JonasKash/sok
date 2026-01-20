"use client";

import React, { useState } from 'react';
import { cn } from '../../lib/utils';

// Define the type for a single category item
export interface Category {
  id: string | number;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  featured?: boolean;
}

// Define the props for the CategoryList component
export interface CategoryListProps {
  title: string;
  subtitle?: string;
  categories: Category[];
  headerIcon?: React.ReactNode;
  className?: string;
}

export const CategoryList = ({
  title,
  subtitle,
  categories,
  headerIcon,
  className,
}: CategoryListProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | number | null>(null);

  return (
    <div className={cn("w-full bg-transparent text-white", className)}>
      <div className="max-w-4xl mx-auto">
        {/* Header Section - Only show if title or subtitle provided */}
        {(title || subtitle || headerIcon) && (
          <div className="text-center mb-12 md:mb-16">
            {headerIcon && (
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600/80 to-blue-500 mb-6 text-white">
                {headerIcon}
              </div>
            )}
            {title && (
              <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-white">{title}</h1>
            )}
            {subtitle && (
              <h2 className="text-4xl md:text-5xl font-bold text-slate-400">{subtitle}</h2>
            )}
          </div>
        )}

        {/* Categories List */}
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative group"
              onMouseEnter={() => setHoveredItem(category.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={category.onClick}
            >
              <div
                className={cn(
                  "relative overflow-hidden border bg-[#111111]/80 backdrop-blur-sm transition-all duration-300 ease-in-out cursor-pointer rounded-2xl",
                  // Hover state styles
                  hoveredItem === category.id
                    ? 'h-auto min-h-[120px] sm:h-32 border-blue-600 shadow-xl shadow-blue-900/30 bg-[#111111] py-4'
                    : 'h-auto min-h-[100px] sm:h-24 border-slate-700/50 hover:border-blue-600/50 py-3 sm:py-0'
                )}
              >
                {/* Corner brackets that appear on hover */}
                {hoveredItem === category.id && (
                  <>
                    <div className="absolute top-3 left-3 w-6 h-6">
                      <div className="absolute top-0 left-0 w-4 h-0.5 bg-blue-500" />
                      <div className="absolute top-0 left-0 w-0.5 h-4 bg-blue-500" />
                    </div>
                    <div className="absolute bottom-3 right-3 w-6 h-6">
                      <div className="absolute bottom-0 right-0 w-4 h-0.5 bg-blue-500" />
                      <div className="absolute bottom-0 right-0 w-0.5 h-4 bg-blue-500" />
                    </div>
                  </>
                )}

                {/* Content */}
                <div className="flex items-center justify-between h-full px-4 sm:px-6 md:px-8">
                  <div className="flex-1 flex items-center gap-3 sm:gap-4">
                    {/* Icon/Emoji on the left */}
                    {category.icon && (
                      <div className={cn(
                        "text-2xl sm:text-3xl transition-transform duration-300 flex-shrink-0",
                        hoveredItem === category.id ? 'scale-110' : 'scale-100'
                      )}>
                        {category.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={cn(
                          "font-bold transition-colors duration-300 break-words",
                          category.featured ? 'text-lg sm:text-xl md:text-2xl lg:text-3xl' : 'text-base sm:text-lg md:text-xl lg:text-2xl',
                          hoveredItem === category.id ? 'text-blue-400' : 'text-white'
                        )}
                      >
                        {category.title}
                      </h3>
                      {category.subtitle && (
                        <p
                          className={cn(
                            "mt-1 transition-colors duration-300 text-xs sm:text-sm md:text-base break-words",
                            hoveredItem === category.id ? 'text-slate-300' : 'text-slate-400'
                          )}
                        >
                          {category.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Arrow icon appears on the right on hover */}
                  {hoveredItem === category.id && (
                    <div className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

