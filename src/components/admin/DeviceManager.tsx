'use client';

import React, { useState } from 'react';
import { Device, DeviceType } from '@/types/device';
import { Room } from '@/types/room';
import { Eye, EyeOff, Save, CheckCircle2 } from 'lucide-react';

interface Props {
  devices: Device[];
  rooms: Room[];
  onRefresh: () => void;
}

const DEVICE_TYPES: { label: string; value: DeviceType }[] = [
  { label: '조명', value: 'light' },
  { label: '에어컨 / 난방', value: 'air_conditioner' },
  { label: '스마트 플러그', value: 'smart_plug' },
  { label: '온습도/공기질 센서', value: 'sensor' },
  { label: '도어 / 창문 센서', value: 'door_sensor' },
  { label: 'CCTV / 홈캠', value: 'camera' },
  { label: '스마트 TV', value: 'tv' },
  { label: '로봇청소기', value: 'robot_vacuum' },
];

export const DeviceManager: React.FC<Props> = ({ devices, rooms, onRefresh }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  const startEdit = (device: Device) => {
    setEditingId(device.id);
    setFormData({
      customName: device.name,
      roomId: device.roomId,
      overrideType: device.type,
      visible: device.visible,
      order: device.order,
    });
  };

  const saveEdit = async (deviceId: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          mapping: formData,
        }),
      });
      if (res.ok) {
        setSavedSuccess(deviceId);
        setTimeout(() => setSavedSuccess(null), 2500);
        setEditingId(null);
        onRefresh();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">기기 매핑 & 표시 관리</h2>
          <p className="text-xs text-zinc-500 mt-1">
            가족 구성원에게 보여줄 이름, 배치할 방, 기기 종류 및 표시 여부를 설정합니다.
          </p>
        </div>
        <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full font-semibold text-zinc-600 dark:text-zinc-300">
          총 {devices.length}대 기기
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800 text-xs font-semibold text-zinc-500">
              <th className="pb-3 px-3">기기 ID / 플랫폼</th>
              <th className="pb-3 px-3">표시 이름</th>
              <th className="pb-3 px-3">배치된 방</th>
              <th className="pb-3 px-3">기기 종류</th>
              <th className="pb-3 px-3">일반 표시</th>
              <th className="pb-3 px-3">순서</th>
              <th className="pb-3 px-3 text-right">설정</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {devices.map((device) => {
              const isEditing = editingId === device.id;
              const isSuccess = savedSuccess === device.id;

              return (
                <tr key={device.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors">
                  {/* 기기 ID / 플랫폼 */}
                  <td className="py-3 px-3">
                    <p className="font-mono text-xs text-zinc-800 dark:text-zinc-200">{device.id}</p>
                    <span className="text-[10px] uppercase font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded">
                      {device.platform}
                    </span>
                  </td>

                  {/* 표시 이름 */}
                  <td className="py-3 px-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.customName}
                        onChange={(e) => setFormData({ ...formData, customName: e.target.value })}
                        className="w-full text-xs p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                      />
                    ) : (
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">{device.name}</span>
                    )}
                  </td>

                  {/* 배치된 방 */}
                  <td className="py-3 px-3">
                    {isEditing ? (
                      <select
                        value={formData.roomId}
                        onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                        className="text-xs p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                      >
                        {rooms.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
                        {rooms.find((r) => r.id === device.roomId)?.name || device.roomId}
                      </span>
                    )}
                  </td>

                  {/* 기기 종류 */}
                  <td className="py-3 px-3">
                    {isEditing ? (
                      <select
                        value={formData.overrideType}
                        onChange={(e) => setFormData({ ...formData, overrideType: e.target.value })}
                        className="text-xs p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                      >
                        {DEVICE_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs text-zinc-500">
                        {DEVICE_TYPES.find((t) => t.value === device.type)?.label || device.type}
                      </span>
                    )}
                  </td>

                  {/* 일반 사용자에게 표시 여부 */}
                  <td className="py-3 px-3">
                    {isEditing ? (
                      <button
                        onClick={() => setFormData({ ...formData, visible: !formData.visible })}
                        className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-semibold ${
                          formData.visible
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-zinc-100 text-zinc-500'
                        }`}
                      >
                        {formData.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{formData.visible ? '표시' : '숨김'}</span>
                      </button>
                    ) : (
                      <span
                        className={`inline-flex items-center space-x-1 text-xs px-2 py-0.5 rounded-full ${
                          device.visible
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {device.visible ? '표시' : '숨김'}
                      </span>
                    )}
                  </td>

                  {/* 순서 */}
                  <td className="py-3 px-3">
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                        className="w-14 text-xs p-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-center"
                      />
                    ) : (
                      <span className="text-xs text-zinc-400 font-mono">{device.order}</span>
                    )}
                  </td>

                  {/* 액션 */}
                  <td className="py-3 px-3 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => saveEdit(device.id)}
                          disabled={saving}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center space-x-1 shadow-sm"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>저장</span>
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end space-x-2">
                        {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-bounce" />}
                        <button
                          onClick={() => startEdit(device)}
                          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-1"
                        >
                          수정
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
