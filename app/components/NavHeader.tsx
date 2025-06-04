import React from 'react';

type NavHeaderProps = {
  activeTab?: 'audience' | 'fields' | 'responses' | 'collaborators';
};

export function NavHeader({ activeTab = 'fields' }: NavHeaderProps) {
  // Mock user data - in a real app this would come from authentication
  const user = {
    id: 'user123',
    name: 'Jane Smith',
    email: 'jane@example.com'
  };

  return (
    <header className="w-full bg-[#f0f0f0] border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        {/* Top row with logo, navigation, and user profile */}
        <div className="flex items-center">
          {/* Logo on the left */}
          <div className="flex items-center mr-8">
            <div className="size-8 mr-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-full">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="font-semibold text-lg">Survey Builder for Teachers</span>
          </div>

          {/* Navigation in the center */}
          <nav className="flex items-center border-b border-transparent flex-grow justify-center">
            <div className={`px-4 py-3 cursor-pointer hover:text-gray-600 ${activeTab === 'audience' ? 'border-b-2 border-black font-medium' : ''}`}>
              Select audience
            </div>
            <div className={`px-4 py-3 cursor-pointer hover:text-gray-600 ${activeTab === 'fields' ? 'border-b-2 border-black font-medium' : ''}`}>
              Add fields
            </div>
            <div className={`px-4 py-3 cursor-pointer hover:text-gray-600 ${activeTab === 'responses' ? 'border-b-2 border-black font-medium' : ''}`}>
              View responses
            </div>
            <div className={`px-4 py-3 cursor-pointer hover:text-gray-600 ${activeTab === 'collaborators' ? 'border-b-2 border-black font-medium' : ''}`}>
              Add collaborators
            </div>
          </nav>

          {/* User info on the right */}
          <div className="flex items-center ml-auto">
            <div className="size-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
              {user.name.charAt(0)}
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium">{user.name}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}