# 📰 PDF 번역 자동화 웹 애플리케이션

## **📌 프로젝트 소개**
번역이 번거로운 다단(컬럼) 형식의 PDF 문서도 정확하게 분석하고, 사용자 지정 용어를 반영하여 AI 번역을 제공하는 웹 애플리케이션입니다.
텍스트가 여러 단으로 나뉜 PDF 문서도 정확하게 분석 및 정제하여 추출할 수 있으며, Google, Papago, DeepL API를 활용해 자동 번역 후 한눈에 비교할 수 있습니다.
한 줄씩 번역하고 다음 문장으로 자연스럽게 이어지는 구조로 가독성과 사용자 경험을 극대화했습니다.

특히, 사용자가 직접 등록한 전문 용어 사전을 적용하여, 고유명사 및 기술 용어의 일관된 번역이 가능하도록 설계했습니다. 이를 통해 기존 번역기에서 자주 발생하는 전문 용어 오역 문제를 해결하고, 보다 정확한 번역 결과를 제공합니다.

이 프로젝트는 PDF 문서에서 **여러 단(컬럼)으로 구성된 텍스트도 올바르게 분석하여 추출**하고,  
**Google, Papago, DeepL API**를 활용해 자동 번역하는 기능을 제공합니다.  

특히, **사용자가 직접 등록한 전문 용어를 반영하여 보다 일관된 번역이 가능**하도록 설계되었습니다.  
기존 번역기의 한계를 극복하고 **보다 정밀하고 정확한 번역 품질을 보장하는 것이 핵심 목표**입니다.  

🚀 **[👉 배포된 사이트 보기](https://translation-app-lyart.vercel.app/)**  

Next.js 기반으로 개발되었으며, **Vercel을 통해 배포**하여 어디서든 쉽게 접근할 수 있습니다.

---

## **📌 주요 기능**

### **1. 신문·논문 같은 컬럼 형식 PDF도 정확히 분석** 📰
기존 PDF 텍스트 추출 방식은 **신문 기사나 논문처럼 여러 개의 컬럼을 가진 문서를 제대로 처리하지 못하는 문제**가 있었습니다.  
이를 해결하기 위해 **pdf.js와 커스텀 알고리즘을 활용하여 텍스트를 좌표 기반으로 분석**하고, 컬럼을 올바르게 구분하여 추출하는 기능을 구현했습니다.  
✅ **복잡한 레이아웃의 문서도 손실 없이 정확하게 번역할 수 있습니다.**  

### **2. 사용자 지정 전문 용어 등록 기능 (용어집 적용) 📌**
기존 번역기는 **고유명사나 기술 용어를 자동 변환하여 일관성을 유지하기 어려운 문제**가 있습니다.  
이 프로젝트에서는 **사용자가 직접 전문 용어를 등록할 수 있는 기능**을 제공하며, 등록된 용어는 **모든 번역 API에서 원래 형태 그대로 유지**됩니다.  
✅ **기술 문서, 논문, 계약서 번역에서도 일관된 용어 사용이 가능합니다.**  

### **3. AI 번역 API 연동 (Google, Papago, DeepL) & 비교 UI 제공 🔍**
**3가지 번역 엔진을 동시에 호출하여 결과를 비교하는 UI**를 제공합니다.  
각 API별 번역 스타일 차이를 쉽게 확인할 수 있도록 **3단 비교 방식**을 적용했으며,  
**사용자가 원하는 번역을 직접 선택하고 수정할 수 있는 기능도 지원**합니다.  

---

## **📌 추가 기능 및 기술적 특징**

### **🎨 가독성을 고려한 UI/UX 디자인**
✔ 컬럼별 번역 결과가 직관적으로 정리되도록 UI 설계  
✔ Tailwind CSS를 활용한 반응형 디자인 적용  
✔ 기존 번역기보다 효율적으로 내용을 검토하고 편집할 수 있도록 최적화  

### **🚀 Vercel 배포 & 성능 최적화**
✔ Vercel을 통해 배포하여 **빠른 로딩 속도와 최적화된 성능 유지**  
✔ 불필요한 API 호출을 줄이기 위해 **캐싱 전략 적용**  
✔ Next.js **서버 컴포넌트를 활용해 렌더링 성능 개선**  

### ** 번역 저장 및 수정**  
- 사용자가 원하는 번역을 **저장 & 수정 가능**  
- **LocalStorage & Vercel 서버 저장**  

---

## **📌 기술 스택**
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **PDF 처리**: pdf.js, pdf-lib
- **번역 API**: Google Translate API, Papago API, DeepL API
- **배포**: Vercel

---

## **📌 향후 개선 예정 사항**
✔ 번역 결과 내에서 **특정 단어를 클릭하여 용어집에 바로 추가하는 기능**  
✔ OpenAI API를 활용한 **AI 기반 문맥 최적화 번역** 적용  
✔ PDF 내 이미지 OCR 기능 추가  

---

## **📌 프로젝트 결과물**
🖼 **[배포된 웹사이트 바로가기](https://translation-app-lyart.vercel.app/)** 🚀

