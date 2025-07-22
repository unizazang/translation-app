'use client'

import { useState, useEffect, useCallback } from 'react'
import PdfUploader from '@/components/PdfUploader'
import LanguageSelector from '@/components/LanguageSelector'
import TranslationCard from '@/components/TranslationCard'
import DownloadButton from '@/components/DownloadButton'
import SentenceList from '@/components/SentenceList'
import ProperNounManager from '@/components/ProperNounManager'
import SavedTranslations from '@/components/SavedTranslations'
import SidebarSection from '@/components/SidebarSection'
import SidebarProgress from '@/components/SidebarProgress'

import { useTextProcessing } from '@/hooks/useTextProcessing'
import { useTranslation } from '@/hooks/useTranslation'
import { useProperNoun } from '@/hooks/useProperNoun'

import { PdfPageData } from '@/lib/pdfProcessor'
import { TranslatedTextBlock } from '@/lib/pdfLayout'

export const dynamic = 'force-dynamic'

export default function Home() {
  const [pdfText, setPdfText] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [targetLanguage, setTargetLanguage] = useState('ko')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTranslating, setIsTranslating] = useState(false)
  const [isPdfUploaded, setIsPdfUploaded] = useState(false)
  const [isTranslateButtonVisible, setIsTranslateButtonVisible] = useState(true)
  const [translatedBlocks, setTranslatedBlocks] = useState<TranslatedTextBlock[][]>([])
  const [skippedIndexes, setSkippedIndexes] = useState<Set<number>>(new Set())
  const [translatedIndexes, setTranslatedIndexes] = useState<Set<number>>(new Set())
  const [starredIndexes, setStarredIndexes] = useState<Set<number>>(new Set())
  const [completedIndexes, setCompletedIndexes] = useState<Set<number>>(new Set())
  const [shouldAutoTranslate, setShouldAutoTranslate] = useState(false)
  const [pdfPages, setPdfPages] = useState<PdfPageData[][]>([])
  const [openSection, setOpenSection] = useState<'sentence' | 'saved' | 'dictionary' | null>('sentence')

  const { properNouns } = useProperNoun()
  const { groupedSentences, processText } = useTextProcessing()
  const {
    translations: translationContext,
    translateText,
    saveTranslation,
    updateTranslation,
    savedTranslations,
    copyAllTranslations,
    autoMove,
    setAutoMove,
    setTargetLanguage: setTranslationTargetLanguage,
    setTranslations: setTranslationContextTranslations,
  } = useTranslation()

  const handleSentenceSelect = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const handleToggleStar = useCallback((index: number) => {
    setStarredIndexes((prev) => {
      const newSet = new Set(prev)
      newSet.has(index) ? newSet.delete(index) : newSet.add(index)
      return newSet
    })
  }, [])

  const handleTextExtracted = (extractedText: PdfPageData[][]) => {
    setPdfPages(extractedText)
    const extractedString = extractedText
      .map((page) => page.map((block) => block.text).join(' '))
      .join('\n\n')
    setPdfText(extractedString)
    processText(extractedString)
    setCurrentIndex(0)
    setIsPdfUploaded(true)

    const initialTranslatedBlocks = extractedText.map((page) =>
      page.map((block) => ({
        text: block.text,
        x: block.x,
        y: block.y,
        width: block.width || 0,
        height: block.height || 0,
        translatedText: block.text,
      }))
    )
    setTranslatedBlocks(initialTranslatedBlocks)
  }

  const handleTranslate = useCallback(
    async (index: number) => {
      setIsTranslating(true)
      await translateText(
        groupedSentences[index].join(' '),
        selectedLanguage,
        index,
        properNouns
      )
      setIsTranslating(false)
    },
    [groupedSentences, properNouns, selectedLanguage, translateText]
  )

  const handleSkip = () => {
    setSkippedIndexes((prev) => new Set([...prev, currentIndex]))
    if (currentIndex < groupedSentences.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < groupedSentences.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setShouldAutoTranslate(true)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setShouldAutoTranslate(true)
    }
  }

  const handleTranslationSave = () => {
    if (translationContext.google) {
      saveTranslation(translationContext.google, groupedSentences[currentIndex].join(' '))
      setTranslatedIndexes((prev) => new Set([...prev, currentIndex]))
      setCompletedIndexes((prev) => new Set([...prev, currentIndex]))
    }
  }

  useEffect(() => {
    if (groupedSentences.length > 0 && shouldAutoTranslate && currentIndex < groupedSentences.length) {
      handleTranslate(currentIndex)
      setShouldAutoTranslate(false)
    }
  }, [currentIndex, shouldAutoTranslate, groupedSentences, handleTranslate])

  const toggleSection = (section: typeof openSection) => {
    setOpenSection((prev) => (prev === section ? null : section))
  }

  const totalPages = pdfPages.length
  let currentPage = 1
  let totalSentencesBeforeCurrentPage = 0
  let currentPageSentences = 0
  let currentSentenceInPage = 0

  for (let i = 0; i < pdfPages.length; i++) {
    const pageSentences = pdfPages[i][0]?.textBlocks?.length || 0
    if (currentIndex < totalSentencesBeforeCurrentPage + pageSentences) {
      currentPage = i + 1
      currentPageSentences = pageSentences
      currentSentenceInPage = currentIndex - totalSentencesBeforeCurrentPage + 1
      break
    }
    totalSentencesBeforeCurrentPage += pageSentences
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      {/* 왼쪽: 메인 번역 작업 */}
      <div className="flex-1 flex flex-col bg-white/80 p-8 overflow-hidden rounded-r-3xl shadow-2xl border-r border-gray-100">
        <div className="flex justify-center mb-6">
          <LanguageSelector
            onSelectSourceLanguage={setSelectedLanguage}
            onSelectTargetLanguage={(lang) => {
              setTargetLanguage(lang)
              setTranslationTargetLanguage(lang)
            }}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          {!isPdfUploaded ? (
            <div className="flex-1 flex items-center justify-center">
              <PdfUploader onTextExtracted={handleTextExtracted} />
            </div>
          ) : (
            <>
              <div className="flex-1 min-h-0">
                <TranslationCard
                  originalText={groupedSentences[currentIndex]?.join(' ') || ''}
                  translations={translationContext}
                  onSave={handleTranslationSave}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  isTranslating={isTranslating}
                  isStarred={starredIndexes.has(currentIndex)}
                  onToggleStar={() => handleToggleStar(currentIndex)}
                  onSkip={handleSkip}
                  onTranslate={() => handleTranslate(currentIndex)} 
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* 오른쪽: 사이드바 */}
      <div className="bg-white/90 border-l border-gray-100 shadow-2xl w-[420px] h-screen overflow-y-auto flex flex-col rounded-l-3xl">
        {isPdfUploaded && (
          <SidebarProgress
            totalPages={totalPages}
            currentPage={currentPage}
            totalSentences={currentPageSentences}
            currentSentenceInPage={currentSentenceInPage}
            currentIndex={currentIndex}
          />
        )}

        <SidebarSection
          title="문장 목록"
          isOpen={openSection === 'sentence'}
          onToggle={() => toggleSection('sentence')}
          scrollable
        >
          <div className="pr-2 custom-scrollbar">
            <SentenceList
              currentIndex={currentIndex}
              onSentenceSelect={handleSentenceSelect}
              groupedSentences={groupedSentences}
              skippedIndexes={skippedIndexes}
              translatedIndexes={translatedIndexes}
              starredIndexes={starredIndexes}
              onToggleStar={handleToggleStar}
            />
          </div>
        </SidebarSection>

        <SidebarSection
          title="저장된 번역"
          isOpen={openSection === 'saved'}
          onToggle={() => toggleSection('saved')}
        >
          <SavedTranslations
            savedTranslations={savedTranslations}
            onCopyAll={copyAllTranslations}
            updateTranslation={updateTranslation}
          />
        </SidebarSection>

        <SidebarSection
          title="사용자 사전"
          isOpen={openSection === 'dictionary'}
          onToggle={() => toggleSection('dictionary')}
        >
          <ProperNounManager />
        </SidebarSection>
      </div>
    </div>
  )
}
