"use client";

import { motion, useInView } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faLanguage,
  faStar,
  faDownload,
  faCog,
  faBook,
  faNewspaper,
  faPenToSquare,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";

const features = [
  {
    icon: faFileAlt,
    title: "PDF 텍스트 추출",
    description: "PDF에서 텍스트를 자동 추출하여 편리하게 활용하세요.",
  },
  {
    icon: faBook,
    title: "사용자 번역 사전",
    description: "나만의 번역 사전을 만들고, 단어를 원하는 대로 번역하세요.",
  },
  {
    icon: faLanguage,
    title: "번역 엔진 비교",
    description:
      "Google, Papago, DeepL의 번역 결과를 한 곳에서 비교하고 최적의 번역을 선택하세요.",
  },
  {
    icon: faNewspaper,
    title: "컬럼 형식 지원",
    description:
      "신문, 논문 등 복잡한 다단 형식 PDF도 문제없이 추출 가능합니다.",
  },

  {
    icon: faBookmark,
    title: "북마크 기능",
    description: "중요한 문장을 북마크에 추가하여 쉽게 찾아볼 수 있습니다.",
  },
  {
    icon: faPenToSquare,
    title: "번역 결과 편집",
    description: "번역된 텍스트를 자유롭게 편집하고 저장할 수 있습니다.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const FeatureDescription = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="py-12 bg-gray-50"
    >
      <div className="max-w-4xl mx-auto px-4">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-gray-800 mb-4"
          >
            나만의 번역을 만드세요.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600"
          >
            답답한 번역은 그만! 특정 용어의 번역 결과를 직접 등록하고 선택하여,
            나에게 딱 맞는 정확한 번역을 경험하세요.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              }}
              className="bg-white p-6 rounded-lg shadow-md transition-shadow duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center mb-4"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4"
                >
                  <FontAwesomeIcon
                    icon={feature.icon}
                    className="text-blue-600 text-xl"
                  />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {feature.title}
                </h3>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-gray-600"
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FeatureDescription;
