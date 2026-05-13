"use client";

import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-[2.5rem] border-4 border-slate-200 p-8 animate-pulse">
      <div className="h-5 bg-slate-200 rounded-xl w-3/4 mb-5" />
      <div className="h-4 bg-slate-100 rounded-xl w-1/2 mb-3" />
      <div className="h-4 bg-slate-100 rounded-xl w-2/3 mb-3" />
      <div className="h-4 bg-slate-100 rounded-xl w-1/3 mb-6" />
      <div className="h-12 bg-slate-200 rounded-2xl w-full" />
    </div>
  );
}

export function SkeletonTable({ rows = 3 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex gap-6 p-6 border-b border-slate-100">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-3 bg-slate-200 rounded w-24" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="flex gap-6 p-6 border-b border-slate-50">
          <div className="h-4 bg-slate-100 rounded-lg w-32" />
          <div className="h-4 bg-slate-100 rounded-lg w-20" />
          <div className="h-4 bg-slate-100 rounded-lg w-28" />
          <div className="h-6 bg-slate-100 rounded-full w-20" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonBookingPanel() {
  return (
    <div className="bg-white border-4 border-slate-200 rounded-[2.5rem] p-10 animate-pulse">
      <div className="h-7 bg-slate-200 rounded-xl w-48 mb-8" />
      {/* Court selector */}
      <div className="flex gap-3 mb-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-slate-100 rounded-2xl w-36" />
        ))}
      </div>
      {/* Date selector */}
      <div className="flex gap-3 mb-8">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <div key={i} className="h-20 bg-slate-100 rounded-[2rem] w-[90px]" />
        ))}
      </div>
      {/* Time grid */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="h-12 bg-slate-100 rounded-2xl" />
        ))}
      </div>
      <div className="h-14 bg-slate-200 rounded-[1.5rem] w-full" />
    </div>
  );
}
