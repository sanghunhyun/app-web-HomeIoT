'use client';

import React, { useState } from 'react';
import { Room } from '@/types/room';
import { Plus, Trash2, Save, Sofa, Bed, Utensils, Flower2, Briefcase } from 'lucide-react';
import { authFetch } from '@/lib/api';

interface Props {
  rooms: Room[];
  onRefresh: () => void;
}

const AVAILABLE_ICONS = [
  { id: 'Sofa', label: '거실(소파)' },
  { id: 'Bed', label: '침실(침대)' },
  { id: 'Utensils', label: '주방(식기)' },
  { id: 'Flower2', label: '베란다(화분)' },
  { id: 'Briefcase', label: '서재(가방)' },
];

export const RoomManager: React.FC<Props> = ({ rooms, onRefresh }) => {
  const [roomList, setRoomList] = useState<Room[]>(rooms);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomIcon, setNewRoomIcon] = useState('Sofa');
  const [saving, setSaving] = useState(false);

  const handleAddRoom = () => {
    if (!newRoomName.trim()) return;
    const newId = 'room_' + Date.now();
    const updated = [
      ...roomList,
      {
        id: newId,
        name: newRoomName.trim(),
        icon: newRoomIcon,
        order: roomList.length + 1,
      },
    ];
    setRoomList(updated);
    setNewRoomName('');
  };

  const handleDelete = (id: string) => {
    if (confirm('이 방을 삭제하시겠습니까? 방에 속한 기기는 다른 방으로 옮겨야 합니다.')) {
      setRoomList(roomList.filter((r) => r.id !== id));
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await authFetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rooms: roomList }),
      });
      if (res.ok) {
        alert('방 목록이 저장되었습니다.');
        onRefresh();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="theme-bg-card rounded-3xl theme-border border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold theme-text-main">공간 (방) 관리</h2>
          <p className="text-xs theme-text-muted mt-1">대시보드에 표시할 구역/방을 추가하거나 순서를 변경합니다.</p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm"
        >
          <Save className="w-3.5 h-3.5" />
          <span>전체 저장</span>
        </button>
      </div>

      {/* 새 방 추가 인풋 */}
      <div className="flex flex-wrap items-center gap-2 p-3 theme-bg-sub rounded-2xl mb-5 theme-border border">
        <input
          type="text"
          placeholder="새 방 이름 (예: 아이방, 옷방)"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          className="text-xs p-2.5 rounded-xl theme-border border theme-bg-card theme-text-main flex-1 min-w-[150px]"
        />
        <select
          value={newRoomIcon}
          onChange={(e) => setNewRoomIcon(e.target.value)}
          className="text-xs p-2.5 rounded-xl theme-border border theme-bg-card theme-text-main"
        >
          {AVAILABLE_ICONS.map((i) => (
            <option key={i.id} value={i.id}>
              {i.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddRoom}
          className="flex items-center space-x-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>방 추가</span>
        </button>
      </div>

      {/* 기존 방 리스트 */}
      <div className="space-y-2">
        {roomList.map((room, idx) => (
          <div
            key={room.id}
            className="flex items-center justify-between p-3.5 theme-bg-sub rounded-2xl theme-border border"
          >
            <div className="flex items-center space-x-3">
              <span className="w-6 text-center font-mono text-xs theme-text-muted">{idx + 1}</span>
              <span className="font-semibold text-sm theme-text-main">{room.name}</span>
              <span className="text-xs theme-text-muted font-mono">({room.id})</span>
            </div>

            <button
              onClick={() => handleDelete(room.id)}
              className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
              title="삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
