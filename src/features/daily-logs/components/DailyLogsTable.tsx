import { format } from 'date-fns';
import { Edit, Trash2, Eye } from 'lucide-react';
import type { DailyLog } from '../types';
import {
  getCategoryLabel,
  getPriorityLabel,
  getStatusLabel,
  getPriorityColor,
  getStatusColor,
} from '../utils/helpers';

interface DailyLogsTableProps {
  logs: DailyLog[];
  onEdit: (log: DailyLog) => void;
  onDelete: (log: DailyLog) => void;
  onView?: (log: DailyLog) => void;
}

export function DailyLogsTable({ logs, onEdit, onDelete, onView }: DailyLogsTableProps) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-b from-neutral-50 to-white">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
            <Eye className="w-8 h-8 text-neutral-400" />
          </div>
        </div>
        <p className="text-ait-body-lg-semibold text-neutral-900 mb-2">No logs found</p>
        <p className="text-ait-body-md-regular text-neutral-500">
          Create your first daily log to get started
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-neutral-50 to-white border-b-2 border-neutral-200">
          <tr>
            <th className="px-6 py-4 text-left text-ait-body-sm-semibold text-neutral-700 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-4 text-left text-ait-body-sm-semibold text-neutral-700 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-4 text-left text-ait-body-sm-semibold text-neutral-700 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-4 text-left text-ait-body-sm-semibold text-neutral-700 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-4 text-left text-ait-body-sm-semibold text-neutral-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-right text-ait-body-sm-semibold text-neutral-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-100">
          {logs.map((log) => (
            <tr
              key={log.id}
              className="hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent transition-all duration-200 group"
            >
              <td className="px-6 py-4 text-ait-body-md-regular text-neutral-900 whitespace-nowrap">
                {format(log.date, 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4">
                <div className="max-w-xs">
                  <p className="text-ait-body-md-semibold text-neutral-900 truncate">
                    {log.title}
                  </p>
                  <p className="text-ait-caption-md-regular text-neutral-500 truncate mt-1">
                    {log.description}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4 text-ait-body-md-regular text-neutral-700 whitespace-nowrap">
                {getCategoryLabel(log.category)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-ait-caption-md-semibold border ${getPriorityColor(
                    log.priority
                  )}`}
                >
                  {getPriorityLabel(log.priority)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-ait-caption-md-semibold border ${getStatusColor(
                    log.status
                  )}`}
                >
                  {getStatusLabel(log.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-1">
                  {onView && (
                    <button
                      onClick={() => onView(log)}
                      className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 hover:shadow-sm"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(log)}
                      className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 hover:shadow-sm"
                      title="Edit log"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {/* <button
                    onClick={() => onEdit(log)}
                    className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 hover:shadow-sm"
                    title="Edit log"
                  >
                    <Edit className="w-4 h-4" />
                  </button> */}
                  <button
                    onClick={() => onDelete(log)}
                    className="p-2 text-neutral-500 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-all duration-200 hover:shadow-sm"
                    title="Delete log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
