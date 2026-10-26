'use client';

import React from 'react';
import { LayoutGrid, Sofa, Bed, Utensils, Flower2, Briefcase, LucideIcon } from 'lucide-react';
import { Room } from '@/types/room';

interface Props {
  rooms: Room[];
  selectedRoom: string; // 'all' or room.id
  onSelectRoom: (roomId: string) => void;
  deviceCountsByRoom: Record<string, number>;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Sofa,
  Bed,
  Utensils,
  Flower2,
  Briefcase,
};

export const RoomTabs: React.FC<Props> = ({
  rooms,
  selectedRoom,
  onSelectRoom,
  deviceCountsByRoom,
}) => {
  const totalCount = Object.values(deviceCountsByRoom).reduce((a, b) => a + b, 0);

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none w-full min-w-0">
      {/* 전체 보기 탭 */}
      <button
        onClick={() => onSelectRoom('all')}
        className={`flex items-center space-x-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
          selectedRoom === 'all'
            ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-md'
            : 'theme-bg-card theme-border border theme-text-sub hover:opacity-80'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        <span>전체 기기</span>
        <span
          className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
            selectedRoom === 'all'
              ? 'bg-emerald-700/60 text-white'
              : 'theme-bg-sub theme-text-muted'
          }`}
        >
          {totalCount}
        </span>
      </button>

      {/* 각 방 탭 */}
      {rooms.map((room) => {
        const IconComponent = ICON_MAP[room.icon] || Sofa;
        const count = deviceCountsByRoom[room.id] || 0;
        const isSelected = selectedRoom === room.id;

        return (
          <button
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            className={`flex items-center space-x-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
              isSelected
                ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-md'
                : 'theme-bg-card theme-border border theme-text-sub hover:opacity-80'
            }`}
          >
            <IconComponent className="w-4 h-4" />
            <span>{room.name}</span>
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                isSelected
                  ? 'bg-emerald-700/60 text-white'
                  : 'theme-bg-sub theme-text-muted'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
