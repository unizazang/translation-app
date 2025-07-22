'use client'

import { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

interface SidebarSectionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
  scrollable?: boolean  // ✅ 추가: 내부 스크롤 여부
}

export default function SidebarSection({
  title,
  isOpen,
  onToggle,
  children,
  scrollable = false,
}: SidebarSectionProps) {
  return (
    <div className="border-b last:border-b-0 flex-shrink-0">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 transition"
      >
        <span className="font-semibold text-gray-800">{title}</span>
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="text-gray-600"
        />
      </button>

      {isOpen && (
        <div
          className={`p-4 bg-white ${
            scrollable ? 'max-h-[calc(100vh-16rem)] overflow-y-auto' : ''
          }`}
        >
          {children}
        </div>
      )}
    </div>
  )
}
