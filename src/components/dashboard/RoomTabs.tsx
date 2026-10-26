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
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none mb-6">
      {/* 전체 보기 탭 */}
      <button
        onClick={() => onSelectRoom('all')}
        className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
          selectedRoom === 'all'
            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md'
            : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        <span>전체 기기</span>
        <span
          className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
            selectedRoom === 'all'
              ? 'bg-zinc-700 dark:bg-zinc-300 text-white dark:text-zinc-900'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
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
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              isSelected
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md'
                : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800'
            }`}
          >
            <IconComponent className="w-4 h-4" />
            <span>{room.name}</span>
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                isSelected
                  ? 'bg-zinc-700 dark:bg-zinc-300 text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
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
