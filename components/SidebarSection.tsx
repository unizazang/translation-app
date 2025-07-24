'use client'

import { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

interface SidebarSectionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
  scrollable?: boolean
}

export default function SidebarSection({
  title,
  isOpen,
  onToggle,
  children,
  scrollable = false,
}: SidebarSectionProps) {
  return (
    <div className="mb-3 overflow-hidden bg-white">
      {/* 섹션 헤더 */}
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center px-5 py-2 bg-white hover:bg-gray-100 transition"
      >
        <span className="font-semibold text-base text-gray-800">{title}</span>
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="text-gray-500"
        />
      </button>

      {/* 섹션 콘텐츠 */}
      {isOpen && (
        <div
          className={`px-5 py-4 bg-white text-sm ${
            scrollable ? 'max-h-[calc(100vh-16rem)] overflow-y-auto custom-scrollbar' : ''
          }`}
        >
          {children}
        </div>
      )}
    </div>
  )
}
