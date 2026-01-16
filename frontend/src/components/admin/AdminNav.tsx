/**
 * 관리자 사이드 네비게이션 컴포넌트
 */

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: '/admin/symptoms', label: '증상 관리', icon: '🩺' },
  { path: '/admin/questions', label: '질문 관리', icon: '❓' },
  { path: '/admin/syndromes', label: '변증 관리', icon: '📋' },
  { path: '/admin/herbs', label: '약재 관리', icon: '🌿' },
];

interface AdminNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export default function AdminNav({ currentPath, onNavigate, onLogout }: AdminNavProps) {
  return (
    <nav className="w-64 bg-white border-r border-neutral-200 min-h-screen flex flex-col">
      {/* 로고/타이틀 */}
      <div className="p-6 border-b border-neutral-200">
        <h2 className="text-heading-md text-primary-600 font-bold">한방진단</h2>
        <p className="text-body-sm text-neutral-500">관리자</p>
      </div>

      {/* 네비게이션 메뉴 */}
      <div className="flex-1 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <li key={item.path}>
                <a
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.path);
                  }}
                  className={`flex items-center gap-3 px-6 py-3 text-body-md transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-500 font-semibold'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 로그아웃 버튼 */}
      <div className="p-4 border-t border-neutral-200">
        <button
          onClick={onLogout}
          aria-label="로그아웃"
          className="w-full py-2 px-4 text-body-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span aria-hidden="true">🚪</span>
          <span>로그아웃</span>
        </button>
      </div>
    </nav>
  );
}
