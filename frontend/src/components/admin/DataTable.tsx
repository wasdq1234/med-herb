/**
 * 관리자용 데이터 테이블 컴포넌트
 */

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, item: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onAdd: () => void;
  addButtonLabel?: string;
  emptyMessage?: string;
  isLoading?: boolean;
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
  onAdd,
  addButtonLabel = '추가',
  emptyMessage = '데이터가 없습니다',
  isLoading = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent mb-4" />
        <p className="text-body-md text-neutral-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* 헤더 */}
      <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
        <h3 className="text-heading-sm text-neutral-900">
          총 {data.length}개
        </h3>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg text-body-sm font-semibold hover:bg-primary-600 transition-colors"
        >
          {addButtonLabel}
        </button>
      </div>

      {/* 테이블 */}
      {data.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-body-md text-neutral-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className="px-4 py-3 text-left text-body-sm font-semibold text-neutral-700"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-body-sm font-semibold text-neutral-700">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                  {columns.map((column) => {
                    const value = (item as Record<string, unknown>)[String(column.key)];
                    return (
                      <td key={String(column.key)} className="px-4 py-3 text-body-md text-neutral-700">
                        {column.render ? column.render(value, item) : String(value ?? '-')}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="px-3 py-1 text-body-sm text-primary-600 hover:bg-primary-50 rounded transition-colors"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="px-3 py-1 text-body-sm text-error-600 hover:bg-error-50 rounded transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
