// export const bodyExcretion = {
//   // Stool Type
//   stool: [
//     {
//       id: 1,
//       category: "stool",
//       type: "single-choice",
//       gender: ["M", "F"],
//       quesKey: "stool-type",
//       translation: {
//         en: {
//           quesNo: "1",
//           quesName: "What is the type of your stool",
//           options: [
//             {
//               id: 1,
//               label: "Normal",
//               value: "Normal",
//             },
//             {
//               id: 2,
//               label: "Hard",
//               value: "Hard",
//             },
//             {
//               id: 3,
//               label: "Loose",
//               value: "Loose",
//             },
//             { id: 4, label: "Others", value: "Others" },
//           ],
//         },
//         bn: {
//           quesNo: "১",
//           quesName: "আপনার মলের ধরন কী?",
//           options: [
//             {
//               id: 1,
//               label: "স্বাভাবিক",
//               value: "Normal",
//             },
//             {
//               id: 2,
//               label: "কঠিন ",
//               value: "Hard",
//             },
//             {
//               id: 3,
//               label: "পাতলা",
//               value: "Loose",
//             },
//             { id: 4, label: "অন্যান্য", value: "Others" },
//           ],
//         },
//         as: {
//           quesNo: "১",
//           quesName: "আপোনাৰ মলৰ প্ৰকাৰ কি?",
//           options: [
//             {
//               id: 1,
//               label: "স্বাভাৱিক",
//               value: "Normal",
//             },
//             {
//               id: 2,
//               label: "শুকান",
//               value: "Hard",
//             },
//             {
//               id: 3,
//               label: "ঢিলা",
//               value: "Loose",
//             },
//             { id: 4, label: "অন্যান্য", value: "Others" },
//           ],
//         },
//       },
//     },

//     // Stool Odor
//     {
//       id: 2,
//       category: "stool",
//       type: "single-choice",
//       gender: ["M", "F"],
//       quesKey: "stool-odor",
//       info: stoolSmellDescriptions,
//       translation: {
//         en: {
//           quesNo: "2",
//           quesName: "What is the odor of your stool?",
//           options: [
//             {
//               id: 1,
//               label: "Normal",
//               value: "Normal",
//             },
//             {
//               id: 2,
//               label: "Foul or Unusual",
//               value: "Foul",
//             },
//           ],
//         },
//         bn: {
//           quesNo: "২",
//           quesName: "আপনার মলের গন্ধ কেমন?",
//           options: [
//             {
//               id: 1,
//               label: "স্বাভাবিক",
//               value: "Normal",
//             },
//             {
//               id: 2,
//               label: "দুর্গন্ধযুক্ত বা অস্বাভাবিক",
//               value: "Foul",
//             },
//           ],
//         },
//         as: {
//           quesNo: "২",
//           quesName: "আপোনাৰ মলৰ গোন্ধ কেনেকুৱা?",
//           options: [
//             {
//               id: 1,
//               label: "স্বাভাৱিক",
//               value: "Normal",
//             },
//             {
//               id: 2,
//               label: "দুৰ্গন্ধযুক্ত বা অস্বাভাৱিক",
//               value: "Foul",
//             },
//           ],
//         },
//       },
//     },

//     // Stool Frequency
//     {
//       id: 3,
//       category: "stool",
//       type: "single-choice",
//       gender: ["M", "F"],
//       quesKey: "stool-frequency",
//       translation: {
//         en: {
//           quesNo: "3",
//           quesName: "How often do you pass stool?",
//           options: [
//             { id: 1, label: "Regular (No discomfort)", value: "Regular" },
//             { id: 2, label: "Frequent (By urgency)", value: "Frequent" },
//             {
//               id: 3,
//               label: "Infrequent (Difficult to pass)",
//               value: "Infrequent",
//             },
//           ],
//         },
//         bn: {
//           quesNo: "৩",
//           quesName: "আপনি কতবার মল ত্যাগ করেন?",
//           options: [
//             { id: 1, label: "নিয়মিত (কোনো অস্বস্তি নেই)", value: "Regular" },
//             { id: 2, label: "ঘন ঘন (তাড়াতাড়ি)", value: "Frequent" },
//             {
//               id: 3,
//               label: "কদাচিৎ (পাস করতে কঠিন)",
//               value: "Infrequent",
//             },
//           ],
//         },
//         as: {
//           quesNo: "৩",
//           quesName: "আপুনি কিমান সঘনাই মল ত্যাগ কৰে?",
//           options: [
//             { id: 1, label: "নিয়মিত (কোনো অসুবিধা নাই)", value: "Regular" },
//             { id: 2, label: "সঘনাই (তাড়াতাড়ি)", value: "Frequent" },
//             {
//               id: 3,
//               label: "কম (পাছ কৰিবলৈ কঠিন)",
//               value: "Infrequent",
//             },
//           ],
//         },
//       },
//     },

//     // Constipation
//     {
//       id: 4,
//       category: "stool",
//       type: "single-choice",
//       gender: ["M", "F"],
//       quesKey: "stool-constipation",
//       translation: {
//         en: {
//           quesNo: "4",
//           quesName: "Do you have constipation?",
//           options: [
//             { id: 1, label: "Yes", value: "Yes" },
//             { id: 2, label: "No", value: "No" },
//           ],
//         },
//         bn: {
//           quesNo: "৪",
//           quesName: "আপনার কি কোষ্ঠকাঠিন্য আছে?",
//           options: [
//             { id: 1, label: "হ্যাঁ", value: "Yes" },
//             { id: 2, label: "না", value: "No" },
//           ],
//         },
//         as: {
//           quesNo: "৪",
//           quesName: "আপোনাৰ কোষ্ঠকাঠিন্য আছেনে?",
//           options: [
//             { id: 1, label: "হয়", value: "Yes" },
//             { id: 2, label: "নহয়", value: "No" },
//           ],
//         },
//       },
//     },

//     // Blood in Stool
//     {
//       id: 5,
//       category: "stool",
//       type: "single-choice",
//       gender: ["M", "F"],
//       quesKey: "Stool-blood",
//       translation: {
//         en: {
//           quesNo: "5",
//           quesName: "Do you see blood in your stool?",
//           options: [
//             { id: 1, label: "Yes", value: "Yes" },
//             { id: 2, label: "No", value: "No" },
//           ],
//         },
//         bn: {
//           quesNo: "৫",
//           quesName: "আপনার মলে কি রক্ত ​​দেখতে পান?",
//           options: [
//             { id: 1, label: "হ্যাঁ", value: "Yes" },
//             { id: 2, label: "না", value: "No" },
//           ],
//         },
//         as: {
//           quesNo: "৫",
//           quesName: "আপুনি আপোনাৰ মলত তেজ দেখিছেনে?",
//           options: [
//             { id: 1, label: "হয়", value: "Yes" },
//             { id: 2, label: "নহয়", value: "No" },
//           ],
//         },
//       },
//     },
//   ],

//   // Sputum
//   sputum: [
//     {
//       id: 6,
//       category: "sputum",
//       type: "single-choice",
//       gender: ["M", "F"],
//       quesKey: "sputum-color",
//       translation: {
//         en: {
//           quesNo: "6",
//           quesName: "What is the color of your sputum?",
//           options: [
//             { id: 1, label: "White", value: "White" },
//             { id: 2, label: "Yellowish", value: "Yellowish" },
//             { id: 3, label: "Pinkish / Reddish", value: "Pinkish / Reddish" },
//             { id: 4, label: "Greenish", value: "Greenish" },
//             { id: 5, label: "Others", value: "Others" },
//           ],
//         },
//         bn: {
//           quesNo: "৬",
//           quesName: "আপনার কফের রঙ কী?",
//           options: [
//             { id: 1, label: "সাদা", value: "White" },
//             { id: 2, label: "হলুদাভ", value: "Yellowish" },
//             { id: 3, label: "গোলাপি / লালচে", value: "Pinkish / Reddish" },
//             { id: 4, label: "সবুজাব", value: "Greenish" },
//             { id: 5, label: "অন্যান্য", value: "Others" },
//           ],
//         },
//         as: {
//           quesNo: "৬",
//           quesName: "আপোনাৰ কফৰ ৰং কি?",
//           options: [
//             { id: 1, label: "বগা", value: "White" },
//             { id: 2, label: "হালধীয়া", value: "Yellowish" },
//             { id: 3, label: "গোলাপী / ৰঙা", value: "Pinkish / Reddish" },
//             { id: 4, label: "সেউজীয়া", value: "Greenish" },
//             { id: 5, label: "অন্যান্য", value: "Others" },
//           ],
//         },
//       },
//     },
//     {
//       id: 7,
//       category: "sputum",
//       type: "single-choice",
//       gender: ["M", "F"],
//       quesKey: "sputum-blood",
//       translation: {
//         en: {
//           quesNo: "7",
//           quesName: "Is there blood in the sputum?",
//           options: [
//             { id: 1, label: "Yes", value: "Yes" },
//             { id: 2, label: "No", value: "No" },
//           ],
//         },
//         bn: {
//           quesNo: "৭",
//           quesName: "কফে কি রক্ত ​​আছে?",
//           options: [
//             { id: 1, label: "হ্যাঁ", value: "Yes" },
//             { id: 2, label: "না", value: "No" },
//           ],
//         },
//         as: {
//           quesNo: "৭",
//           quesName: "কফত তেজ আছেনে?",
//           options: [
//             { id: 1, label: "হয়", value: "Yes" },
//             { id: 2, label: "নহয়", value: "No" },
//           ],
//         },
//       },
//     },
//     {
//       id: 8,
//       category: "sputum",
//       type: "single-choice",
//       gender: ["M", "F"],
//       quesKey: "sputum-frequency",
//       translation: {
//         en: {
//           quesNo: "8",
//           quesName: "How frequent is the sputum production?",
//           options: [
//             { id: 1, label: "Frequent", value: "Frequent" },
//             { id: 2, label: "Occasional", value: "Occasional" },
//           ],
//         },
//         bn: {
//           quesNo: "৮",
//           quesName: "কত ঘন ঘন কফ উৎপাদন হয়?",
//           options: [
//             { id: 1, label: "ঘন ঘন", value: "Frequent" },
//             { id: 2, label: "মাঝে মাঝে", value: "Occasional" },
//           ],
//         },
//         as: {
//           quesNo: "৮",
//           quesName: "কিমান সঘনাই কফ ওলায়?",
//           options: [
//             { id: 1, label: "সঘনাই", value: "Frequent" },
//             { id: 2, label: "মাজে মাজে", value: "Occasional" },
//           ],
//         },
//       },
//     },
//   ],

//   // Sweat
//   sweat: [
//     {
//       id: 9,
//       category: "sweat",
//       type: "single-choice",
//       gender: ["M", "F"],
//       quesKey: "sweat-amount",
//       translation: {
//         en: {
//           quesNo: "9",
//           quesName: "How much do you sweat?",
//           options: [
//             { id: 1, label: "Minimal", value: "Minimal" },
//             { id: 2, label: "Excessive", value: "Excessive" },
//           ],
//         },
//         bn: {
//           quesNo: "৯",
//           quesName: "আপনি কতটা ঘামেন?",
//           options: [
//             { id: 1, label: "খুব কম", value: "Minimal" },
//             { id: 2, label: "অতিরিক্ত", value: "Excessive" },
//           ],
//         },
//         as: {
//           quesNo: "৯",
//           quesName: "আপুনি কিমান ঘামে?",
//           options: [
//             { id: 1, label: "কম", value: "Minimal" },
//             { id: 2, label: "বেছি", value: "Excessive" },
//           ],
//         },
//       },
//     },
//     {
//       id: 10,
//       category: "sweat",
//       type: "single-choice",
//       gender: ["M", "F"],
//       quesKey: "sweat-location",
//       translation: {
//         en: {
//           quesNo: "10",
//           quesName: "Where do you sweat?",
//           options: [
//             { id: 1, label: "General", value: "General" },
//             {
//               id: 2,
//               label: "Localized (Palms / Face / Feet)",
//               value: "Localized",
//             },
//           ],
//         },
//         bn: {
//           quesNo: "১০",
//           quesName: "আপনার কোথায় ঘাম হয়?",
//           options: [
//             { id: 1, label: "সাধারণ", value: "General" },
//             {
//               id: 2,
//               label: "নির্দিষ্ট স্থানে (হাতের তালু / মুখ / পা)",
//               value: "Localized",
//             },
//           ],
//         },
//         as: {
//           quesNo: "১০",
//           quesName: "আপোনাৰ ক'ত ঘাম ওলায়?",
//           options: [
//             { id: 1, label: "সাধাৰণ", value: "General" },
//             {
//               id: 2,
//               label: "বিশেষ ঠাইত (হাতৰ তলুৱা / মুখ / ভৰি)",
//               value: "Localized",
//             },
//           ],
//         },
//       },
//     },
//     {
//       id: 11,
//       category: "sweat",
//       type: "single-choice",
//       gender: ["M", "F"],
//       quesKey: "sweat-odor",
//       translation: {
//         en: {
//           quesNo: "11",
//           quesName: "What is the odor of your sweat?",
//           options: [
//             { id: 1, label: "Normal", value: "Normal" },
//             { id: 2, label: "Foul-smelling", value: "Foul-smelling" },
//           ],
//         },
//         bn: {
//           quesNo: "১১",
//           quesName: "আপনার ঘামের গন্ধ কেমন?",
//           options: [
//             { id: 1, label: "স্বাভাবিক", value: "Normal" },
//             { id: 2, label: "দুর্গন্ধযুক্ত", value: "Foul-smelling" },
//           ],
//         },
//         as: {
//           quesNo: "১১",
//           quesName: "আপোনাৰ ঘামৰ গোন্ধ কেনেকুৱা?",
//           options: [
//             { id: 1, label: "স্বাভাৱিক", value: "Normal" },
//             { id: 2, label: "দুৰ্গন্ধযুক্ত", value: "Foul-smelling" },
//           ],
//         },
//       },
//     },
//   ],

//   // Saliva
//   saliva: [
//     {
//       id: 12,
//       category: "saliva",
//       type: "single-choice",
//       gender: ["M", "F"],
//       quesKey: "saliva-amount",
//       translation: {
//         en: {
//           quesNo: "12",
//           quesName: "What is the amount of your saliva?",
//           options: [
//             { id: 1, label: "Excessive", value: "Excessive" },
//             { id: 2, label: "Dry Mouth", value: "Dry Mouth" },
//           ],
//         },
//         bn: {
//           quesNo: "১২",
//           quesName: "আপনার লালার পরিমাণ কত?",
//           options: [
//             { id: 1, label: "অতিরিক্ত", value: "Excessive" },
//             { id: 2, label: "শুষ্ক মুখ", value: "Dry Mouth" },
//           ],
//         },
//         as: {
//           quesNo: "১২",
//           quesName: "আপোনাৰ লালটিৰ পৰিমাণ কিমান?",
//           options: [
//             { id: 1, label: "অত্যাধিক", value: "Excessive" },
//             { id: 2, label: "শুকান মুখ", value: "Dry Mouth" },
//           ],
//         },
//       },
//     },
//     {
//       id: 13,
//       category: "saliva",
//       type: "single-choice",
//       gender: ["M", "F"],
//       quesKey: "saliva-taste",
//       translation: {
//         en: {
//           quesNo: "13",
//           quesName: "What is the taste of your saliva?",
//           options: [
//             { id: 1, label: "Normal", value: "Normal" },
//             { id: 2, label: "Bitter", value: "Bitter" },
//             { id: 3, label: "Others", value: "Others" },
//           ],
//         },
//         bn: {
//           quesNo: "১৩",
//           quesName: "আপনার লালার স্বাদ কেমন?",
//           options: [
//             { id: 1, label: "স্বাভাবিক", value: "Normal" },
//             { id: 2, label: "তিক্ত", value: "Bitter" },
//             { id: 3, label: "অন্যান্য", value: "Others" },
//           ],
//         },
//         as: {
//           quesNo: "১৩",
//           quesName: "আপোনাৰ লালটিৰ সোৱাদ কেনেকুৱা?",
//           options: [
//             { id: 1, label: "স্বাভাৱিক", value: "Normal" },
//             { id: 2, label: "তিতা", value: "Bitter" },
//             { id: 3, label: "অন্যান্য", value: "Others" },
//           ],
//         },
//       },
//     },
//   ],

//   // Menstrual Flow
//   menstrual: [
//     {
//       id: 14,
//       category: "menstrual",
//       type: "single-choice",
//       gender: ["F"],
//       quesKey: "menstrual-status",
//       translation: {
//         en: {
//           quesNo: "14",
//           quesName: "Do you have menstruation ?",
//           options: [
//             { id: 1, label: "Yes", value: "Yes" },
//             { id: 2, label: "No", value: "No" },
//           ],
//         },
//         bn: {
//           quesNo: "১৪",
//           quesName: "আপনার কি মাসিক হয়?",
//           options: [
//             { id: 1, label: "হ্যাঁ", value: "Yes" },
//             { id: 2, label: "না", value: "No" },
//           ],
//         },
//         as: {
//           quesNo: "১৪",
//           quesName: "আপোনাৰ মাহেকীয়া আছে নে?",
//           options: [
//             { id: 1, label: "হয়", value: "Yes" },
//             { id: 2, label: "নহয়", value: "No" },
//           ],
//         },
//       },
//     },
//     {
//       id: 15,
//       category: "menstrual",
//       type: "single-choice",
//       gender: ["F"],
//       quesKey: "menstrual-amount",
//       showIf: { "menstrual-status": ["Yes"] },
//       translation: {
//         en: {
//           quesNo: "15",
//           quesName: "What is the amount of menstrual flow?",
//           options: [
//             { id: 1, label: "Normal", value: "Normal" },
//             { id: 2, label: "Heavy", value: "Heavy" },
//             { id: 3, label: "Scanty", value: "Scanty" },
//           ],
//         },
//         bn: {
//           quesNo: "১৫",
//           quesName: "মাসিকের প্রবাহের পরিমাণ কত?",
//           options: [
//             { id: 1, label: "স্বাভাবিক", value: "Normal" },
//             { id: 2, label: "প্রচুর", value: "Heavy" },
//             { id: 3, label: "স্বল্প", value: "Scanty" },
//           ],
//         },
//         as: {
//           quesNo: "১৫",
//           quesName: "আপোনাৰ মাহেকীয়া তেজৰ প্ৰবাহৰ পৰিমাণ কিমান?",
//           options: [
//             { id: 1, label: "স্বাভাৱিক", value: "Normal" },
//             { id: 2, label: "বেছি", value: "Heavy" },
//             { id: 3, label: "কম", value: "Scanty" },
//           ],
//         },
//       },
//     },
//     {
//       id: 16,
//       category: "menstrual",
//       type: "single-choice",
//       gender: ["F"],
//       quesKey: "menstrual-duration",
//       showIf: { "menstrual-status": ["Yes"] },

//       translation: {
//         en: {
//           quesNo: "16",
//           quesName: "What is the duration of your menstrual flow?",
//           options: [
//             { id: 1, label: "Normal", value: "Normal" },
//             { id: 2, label: "Prolonged", value: "Prolonged" },
//             { id: 3, label: "Shortened", value: "Shortened" },
//           ],
//         },
//         bn: {
//           quesNo: "১৬",
//           quesName: "আপনার মাসিক প্রবাহের সময়কাল কত?",
//           options: [
//             { id: 1, label: "স্বাভাবিক", value: "Normal" },
//             { id: 2, label: "দীর্ঘায়িত", value: "Prolonged" },
//             { id: 3, label: "হ্রাসপ্রাপ্ত", value: "Shortened" },
//           ],
//         },
//         as: {
//           quesNo: "১৬",
//           quesName: "আপোনাৰ মাহেকীয়া তেজৰ প্ৰবাহৰ সময়সীমা কিমান?",
//           options: [
//             { id: 1, label: "স্বাভাৱিক", value: "Normal" },
//             { id: 2, label: "দীঘলীয়া", value: "Prolonged" },
//             { id: 3, label: "চুটি", value: "Shortened" },
//           ],
//         },
//       },
//     },
//     {
//       id: 17,
//       category: "menstrual",
//       type: "single-choice",
//       gender: ["F"],
//       quesKey: "menstrual-clots",
//       showIf: { "menstrual-status": ["Yes"] },

//       translation: {
//         en: {
//           quesNo: "17",
//           quesName: "Are there any clots?",
//           options: [
//             { id: 1, label: "None", value: "None" },
//             { id: 2, label: "Small", value: "Small" },
//             { id: 3, label: "Large", value: "Large" },
//           ],
//         },
//         bn: {
//           quesNo: "১৭",
//           quesName: "কোনো জমাট আছে কি?",
//           options: [
//             { id: 1, label: "নেই", value: "None" },
//             { id: 2, label: "ছোট", value: "Small" },
//             { id: 3, label: "বড়", value: "Large" },
//           ],
//         },
//         as: {
//           quesNo: "১৭",
//           quesName: "কোনো তেজ গোট মৰা দেখিছেনে?",
//           options: [
//             { id: 1, label: "নাই", value: "None" },
//             { id: 2, label: "সৰু", value: "Small" },
//             { id: 3, label: "ডাঙৰ", value: "Large" },
//           ],
//         },
//       },
//     },
//   ],

//   //urination
//   urination: [
//     {
//       id: 18,
//       category: "urination",
//       type: "single-choice",
//       gender: ["M", "F"],
//       quesKey: "urine-frequency",
//       translation: {
//         en: {
//           quesNo: "6",
//           quesName: "How frequent is your urination?",
//           options: [
//             { id: 1, label: "Normal (6–8 times/day)", value: "Normal" },
//             { id: 2, label: "High (More than 8 times/day)", value: "High" },
//             { id: 3, label: "Less (Less than 5 times/day)", value: "Less" },
//           ],
//         },
//         bn: {
//           quesNo: "৬",
//           quesName: "আপনার প্রস্রাবের ফ্রিকোয়েন্সি কত?",
//           options: [
//             { id: 1, label: "স্বাভাবিক (৬-৮ বার/দিন)", value: "Normal" },
//             { id: 2, label: "বেশি (৮ বারের বেশি/দিন)", value: "High" },
//             { id: 3, label: "কম (৫ বারের কম/দিন)", value: "Less" },
//           ],
//         },
//         as: {
//           quesNo: "৬",
//           quesName: "আপুনি কিমান সঘনাই প্ৰস্ৰাৱ কৰে?",
//           options: [
//             { id: 1, label: "স্বাভাৱিক (দিনত ৬-৮ বাৰ)", value: "Normal" },
//             { id: 2, label: "বেছি (দিনত ৮ বাৰতকৈ বেছি)", value: "High" },
//             { id: 3, label: "কম (দিনত ৫ বাৰতকৈ কম)", value: "Less" },
//           ],
//         },
//       },
//     },
//     {
//       id: 19,
//       category: "urination",
//       type: "single-choice",
//       gender: ["M", "F"],
//       quesKey: "urine-color",
//       translation: {
//         en: {
//           quesNo: "7",
//           quesName: "What is the color of your urine?",
//           options: [
//             { id: 1, label: "Normal (Pale Yellow to Amber)", value: "Normal" },
//             { id: 2, label: "Dark Yellow / Brown", value: "Dark" },
//             { id: 3, label: "Red / Pink", value: "Red" },
//             { id: 4, label: "Others", value: "Others" },
//           ],
//         },
//         bn: {
//           quesNo: "৭",
//           quesName: "আপনার প্রস্রাবের রঙ কী?",
//           options: [
//             {
//               id: 1,
//               label: "স্বাভাবিক (হালকা হলুদ থেকে অ্যাম্বার)",
//               value: "Normal",
//             },
//             { id: 2, label: "গাঢ় হলুদ / বাদামী", value: "Dark" },
//             { id: 3, label: "লাল / গোলাপী", value: "Red" },
//             { id: 4, label: "অন্যান্য", value: "Others" },
//           ],
//         },
//         as: {
//           quesNo: "৭",
//           quesName: "আপোনাৰ প্ৰস্ৰাৱৰ ৰং কি?",
//           options: [
//             {
//               id: 1,
//               label: "স্বাভাৱিক (পাতল হালধীয়াৰ পৰা এম্বাৰ)",
//               value: "Normal",
//             },
//             { id: 2, label: "গাঢ় হালধীয়া / মটীয়া", value: "Dark" },
//             { id: 3, label: "ৰঙা / গোলাপী", value: "Red" },
//             { id: 4, label: "অন্যান্য", value: "Others" },
//           ],
//         },
//       },
//     },
//     {
//       id: 20,
//       category: "urination",
//       type: "single-choice",
//       gender: ["M", "F"],
//       quesKey: "urine-odor",
//       translation: {
//         en: {
//           quesNo: "8",
//           quesName: "What is the odor of your urine?",
//           options: [
//             { id: 1, label: "Normal (Mild / Non-Offensive)", value: "Normal" },
//             { id: 2, label: "Strong", value: "Strong" },
//             { id: 3, label: "Others", value: "Others" },
//           ],
//         },
//         bn: {
//           quesNo: "৮",
//           quesName: "আপনার প্রস্রাবের গন্ধ কেমন?",
//           options: [
//             { id: 1, label: "স্বাভাবিক (হালকা / আপত্তিকর নয়)", value: "Normal" },
//             { id: 2, label: "তীব্র", value: "Strong" },
//             { id: 3, label: "অন্যান্য", value: "Others" },
//           ],
//         },
//         as: {
//           quesNo: "৮",
//           quesName: "আপোনাৰ প্ৰস্ৰাৱৰ গোন্ধ কেনেকুৱা?",
//           options: [
//             { id: 1, label: "স্বাভাৱিক (মৃদু / আপত্তিজনক নহয়)", value: "Normal" },
//             { id: 2, label: "তীব্ৰ", value: "Strong" },
//             { id: 3, label: "অন্যান্য", value: "Others" },
//           ],
//         },
//       },
//     },
//     {
//       id: 21,
//       category: "urination",
//       type: "single-choice",
//       gender: ["M", "F"],
//       quesKey: "urine-discomfort",
//       translation: {
//         en: {
//           quesNo: "9",
//           quesName: "Do you experience pain or discomfort while urinating?",
//           options: [
//             { id: 1, label: "Yes", value: "Yes" },
//             { id: 2, label: "No", value: "No" },
//           ],
//         },
//         bn: {
//           quesNo: "৯",
//           quesName: "প্রস্রাব করার সময় কি আপনার ব্যথা বা অস্বস্তি হয়?",
//           options: [
//             { id: 1, label: "হ্যাঁ", value: "Yes" },
//             { id: 2, label: "না", value: "No" },
//           ],
//         },
//         as: {
//           quesNo: "৯",
//           quesName: "প্ৰস্ৰাৱ কৰোঁতে আপুনি বিষ বা অস্বস্তি অনুভৱ কৰে নে?",
//           options: [
//             { id: 1, label: "হয়", value: "Yes" },
//             { id: 2, label: "নহয়", value: "No" },
//           ],
//         },
//       },
//     },
//     {
//       id: 22,
//       category: "urination",
//       type: "single-choice",
//       gender: ["M", "F"],
//       quesKey: "urine-control",
//       translation: {
//         en: {
//           quesNo: "10",
//           quesName: "Are you able to control your urination?",
//           options: [
//             { id: 1, label: "Yes", value: "Yes" },
//             { id: 2, label: "No", value: "No" },
//           ],
//         },
//         bn: {
//           quesNo: "১০",
//           quesName: "আপনি কি আপনার প্রস্রাব নিয়ন্ত্রণ করতে পারেন?",
//           options: [
//             { id: 1, label: "হ্যাঁ", value: "Yes" },
//             { id: 2, label: "না", value: "No" },
//           ],
//         },
//         as: {
//           quesNo: "১০",
//           quesName: "আপুনি প্ৰস্ৰাৱ নিয়ন্ত্ৰণ কৰিব পাৰেনে?",
//           options: [
//             { id: 1, label: "হয়", value: "Yes" },
//             { id: 2, label: "নহয়", value: "No" },
//           ],
//         },
//       },
//     },
//   ],
// };

// export const stoolDescriptions = {
//   en: [
//     "Normal: Brown, well-formed, and smooth",
//     "Hard: Small, dry, and difficult to pass",
//     "Loose:Watery or loose consistency",
//   ],
//   bn: [
//     "স্বাভাবিক: বাদামী, ভাল গঠিত এবং মসৃণ",
//     "স্বাভাবিক: ছোট, শুকনো এবং বের করতে কঠিন",
//     "পাতলা: পানি জাতীয় বা ঢিলা প্রকৃতির",
//   ],
//   as: [
//     "স্বাভাৱিক: বগা, ভাল গঠন থকা আৰু মচকোৱা",
//     "শুকান: সৰু, শুকান আৰু ওলাবলৈ কঠিন",
//     "ঢিলা: পানীযুক্ত বা ঢিলা স্বভাৱৰ",
//   ],
// };

// export const stoolSmellDescriptions = {
//   en: ["Normal:Typical smell, not overly offensive", "Foul or Unusual:Strong and unpleasant odor"],
//   bn: [
//     "স্বাভাবিক: স্বাভাবিক গন্ধ, খুব বেশি অস্বস্তিকর নয়",
//     "দুর্গন্ধযুক্ত বা অস্বাভাবিক: তীব্র এবং অপ্রিয় গন্ধ",
//   ],
//   as: [
//     "স্বাভাৱিক: সাধাৰণ গন্ধ, অতিপাত বেয়া নহয়",
//     "দুৰ্গন্ধযুক্ত বা অস্বাভাৱিক: বেছি তীব্ৰ আৰু বেয়া গন্ধ",
//   ],

//   // en: "Strong and unpleasant odor",
//   // bn: "তীব্র এবং অপ্রিয় গন্ধ",
//   // as: "বেছি তীব্ৰ আৰু বেয়া গন্ধ",
// };

export const bodyExcretion = {
  // Stool Type
  stool: [
    {
      id: 1,
      category: "stool",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "stool-type",
      translation: {
        en: {
          quesNo: "1",
          quesName: "Stool type",
          options: [
            {
              id: 1,
              label: "Normal",
              value: "Normal",
            },
            {
              id: 2,
              label: "Hard",
              value: "Hard",
            },
            {
              id: 3,
              label: "Loose",
              value: "Loose",
            },
            { id: 4, label: "Others", value: "Others" },
          ],
        },
        bn: {
          quesNo: "১",
          quesName: " মলের ধরন কী",
          options: [
            {
              id: 1,
              label: "স্বাভাবিক",
              value: "Normal",
            },
            {
              id: 2,
              label: "কঠিন ",
              value: "Hard",
            },
            {
              id: 3,
              label: "পাতলা",
              value: "Loose",
            },
            { id: 4, label: "অন্যান্য", value: "Others" },
          ],
        },
        as: {
          quesNo: "১",
          quesName: " মলৰ প্ৰকাৰ কি",
          options: [
            {
              id: 1,
              label: "স্বাভাৱিক",
              value: "Normal",
            },
            {
              id: 2,
              label: "শুকান",
              value: "Hard",
            },
            {
              id: 3,
              label: "ঢিলা",
              value: "Loose",
            },
            { id: 4, label: "অন্যান্য", value: "Others" },
          ],
        },
      },
    },

    // Stool Odor
    {
      id: 2,
      category: "stool",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "stool-odor",
      info: stoolSmellDescriptions,
      translation: {
        en: {
          quesNo: "2",
          quesName: "Stool odor ",
          options: [
            {
              id: 1,
              label: "Normal",
              value: "Normal",
            },
            {
              id: 2,
              label: "Foul or Unusual",
              value: "Foul",
            },
          ],
        },
        bn: {
          quesNo: "২",
          quesName: "মলের গন্ধ কেমন",
          options: [
            {
              id: 1,
              label: "স্বাভাবিক",
              value: "Normal",
            },
            {
              id: 2,
              label: "দুর্গন্ধযুক্ত বা অস্বাভাবিক",
              value: "Foul",
            },
          ],
        },
        as: {
          quesNo: "২",
          quesName: "মলৰ গোন্ধ কেনেকুৱা",
          options: [
            {
              id: 1,
              label: "স্বাভাৱিক",
              value: "Normal",
            },
            {
              id: 2,
              label: "দুৰ্গন্ধযুক্ত বা অস্বাভাৱিক",
              value: "Foul",
            },
          ],
        },
      },
    },

    // Stool Frequency
    {
      id: 3,
      category: "stool",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "stool-frequency",
      translation: {
        en: {
          quesNo: "3",
          quesName: "Stool frequency",
          options: [
            { id: 1, label: "Regular (No discomfort)", value: "Regular" },
            { id: 2, label: "Frequent (By urgency)", value: "Frequent" },
            {
              id: 3,
              label: "Infrequent (Difficult to pass)",
              value: "Infrequent",
            },
          ],
        },
        bn: {
          quesNo: "৩",
          quesName: "কতবার মল ত্যাগ করেন",
          options: [
            { id: 1, label: "নিয়মিত (কোনো অস্বস্তি নেই)", value: "Regular" },
            { id: 2, label: "ঘন ঘন (তাড়াতাড়ি)", value: "Frequent" },
            {
              id: 3,
              label: "কদাচিৎ (পাস করতে কঠিন)",
              value: "Infrequent",
            },
          ],
        },
        as: {
          quesNo: "৩",
          quesName: "কিমান সঘনাই মল ত্যাগ কৰে",
          options: [
            { id: 1, label: "নিয়মিত (কোনো অসুবিধা নাই)", value: "Regular" },
            { id: 2, label: "সঘনাই (তাড়াতাড়ি)", value: "Frequent" },
            {
              id: 3,
              label: "কম (পাছ কৰিবলৈ কঠিন)",
              value: "Infrequent",
            },
          ],
        },
      },
    },

    // Constipation
    {
      id: 4,
      category: "stool",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "stool-constipation",
      translation: {
        en: {
          quesNo: "4",
          quesName: "Constipation",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "৪",
          quesName: "কোষ্ঠকাঠিন্য আছে",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "৪",
          quesName: "কোষ্ঠকাঠিন্য আছেনে",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },

    // Blood in Stool
    {
      id: 5,
      category: "stool",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "Stool-blood",
      translation: {
        en: {
          quesNo: "5",
          quesName: "Blood in stool",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "৫",
          quesName: "মলে কি রক্ত ​​দেখতে পান",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "৫",
          quesName: "আপোনাৰ মলত তেজ দেখিছেনে",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
  ],

  // Sputum
  sputum: [
    {
      id: 6,
      category: "sputum",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "sputum-color",
      translation: {
        en: {
          quesNo: "6",
          quesName: "Sputum color",
          options: [
            { id: 1, label: "White", value: "White" },
            { id: 2, label: "Yellowish", value: "Yellowish" },
            { id: 3, label: "Pinkish / Reddish", value: "Pinkish / Reddish" },
            { id: 4, label: "Greenish", value: "Greenish" },
            { id: 5, label: "Others", value: "Others" },
          ],
        },
        bn: {
          quesNo: "৬",
          quesName: "কফের রঙ কী",
          options: [
            { id: 1, label: "সাদা", value: "White" },
            { id: 2, label: "হলুদাভ", value: "Yellowish" },
            { id: 3, label: "গোলাপি / লালচে", value: "Pinkish / Reddish" },
            { id: 4, label: "সবুজাব", value: "Greenish" },
            { id: 5, label: "অন্যান্য", value: "Others" },
          ],
        },
        as: {
          quesNo: "৬",
          quesName: "কফৰ ৰং কি",
          options: [
            { id: 1, label: "বগা", value: "White" },
            { id: 2, label: "হালধীয়া", value: "Yellowish" },
            { id: 3, label: "গোলাপী / ৰঙা", value: "Pinkish / Reddish" },
            { id: 4, label: "সেউজীয়া", value: "Greenish" },
            { id: 5, label: "অন্যান্য", value: "Others" },
          ],
        },
      },
    },
    {
      id: 7,
      category: "sputum",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "sputum-blood",
      translation: {
        en: {
          quesNo: "7",
          quesName: "Blood in sputum",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "৭",
          quesName: "কফে কি রক্ত ​​আছে",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "৭",
          quesName: "কফত তেজ আছেনে",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
    {
      id: 8,
      category: "sputum",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "sputum-frequency",
      translation: {
        en: {
          quesNo: "8",
          quesName: "Sputum frequency",
          options: [
            { id: 1, label: "Frequent", value: "Frequent" },
            { id: 2, label: "Occasional", value: "Occasional" },
          ],
        },
        bn: {
          quesNo: "৮",
          quesName: "কত ঘন ঘন কফ উৎপাদন হয়",
          options: [
            { id: 1, label: "ঘন ঘন", value: "Frequent" },
            { id: 2, label: "মাঝে মাঝে", value: "Occasional" },
          ],
        },
        as: {
          quesNo: "৮",
          quesName: "কিমান সঘনাই কফ ওলায়",
          options: [
            { id: 1, label: "সঘনাই", value: "Frequent" },
            { id: 2, label: "মাজে মাজে", value: "Occasional" },
          ],
        },
      },
    },
  ],

  // Sweat
  sweat: [
    {
      id: 9,
      category: "sweat",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "sweat-amount",
      translation: {
        en: {
          quesNo: "9",
          quesName: "Sweat amount",
          options: [
            { id: 1, label: "Minimal", value: "Minimal" },
            { id: 2, label: "Excessive", value: "Excessive" },
          ],
        },
        bn: {
          quesNo: "৯",
          quesName: "কতটা ঘামেন",
          options: [
            { id: 1, label: "খুব কম", value: "Minimal" },
            { id: 2, label: "অতিরিক্ত", value: "Excessive" },
          ],
        },
        as: {
          quesNo: "৯",
          quesName: "কিমান ঘামে",
          options: [
            { id: 1, label: "কম", value: "Minimal" },
            { id: 2, label: "বেছি", value: "Excessive" },
          ],
        },
      },
    },
    {
      id: 10,
      category: "sweat",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "sweat-location",
      translation: {
        en: {
          quesNo: "10",
          quesName: "Sweat location",
          options: [
            { id: 1, label: "General", value: "General" },
            {
              id: 2,
              label: "Localized (Palms / Face / Feet)",
              value: "Localized",
            },
          ],
        },
        bn: {
          quesNo: "১০",
          quesName: "কোথায় ঘাম হয়",
          options: [
            { id: 1, label: "সাধারণ", value: "General" },
            {
              id: 2,
              label: "নির্দিষ্ট স্থানে (হাতের তালু / মুখ / পা)",
              value: "Localized",
            },
          ],
        },
        as: {
          quesNo: "১০",
          quesName: "ক'ত ঘাম ওলায়",
          options: [
            { id: 1, label: "সাধাৰণ", value: "General" },
            {
              id: 2,
              label: "বিশেষ ঠাইত (হাতৰ তলুৱা / মুখ / ভৰি)",
              value: "Localized",
            },
          ],
        },
      },
    },
    {
      id: 11,
      category: "sweat",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "sweat-odor",
      translation: {
        en: {
          quesNo: "11",
          quesName: "Sweat odor",
          options: [
            { id: 1, label: "Normal", value: "Normal" },
            { id: 2, label: "Foul-smelling", value: "Foul-smelling" },
          ],
        },
        bn: {
          quesNo: "১১",
          quesName: "ঘামের গন্ধ কেমন",
          options: [
            { id: 1, label: "স্বাভাবিক", value: "Normal" },
            { id: 2, label: "দুর্গন্ধযুক্ত", value: "Foul-smelling" },
          ],
        },
        as: {
          quesNo: "১১",
          quesName: "ঘামৰ গোন্ধ কেনেকুৱা",
          options: [
            { id: 1, label: "স্বাভাৱিক", value: "Normal" },
            { id: 2, label: "দুৰ্গন্ধযুক্ত", value: "Foul-smelling" },
          ],
        },
      },
    },
  ],

  // Saliva
  saliva: [
    {
      id: 12,
      category: "saliva",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "saliva-amount",
      translation: {
        en: {
          quesNo: "12",
          quesName: "Saliva amount",
          options: [
            { id: 1, label: "Excessive", value: "Excessive" },
            { id: 2, label: "Dry Mouth", value: "Dry Mouth" },
          ],
        },
        bn: {
          quesNo: "১২",
          quesName: "লালার পরিমাণ কত",
          options: [
            { id: 1, label: "অতিরিক্ত", value: "Excessive" },
            { id: 2, label: "শুষ্ক মুখ", value: "Dry Mouth" },
          ],
        },
        as: {
          quesNo: "১২",
          quesName: "লালটিৰ পৰিমাণ কিমান",
          options: [
            { id: 1, label: "অত্যাধিক", value: "Excessive" },
            { id: 2, label: "শুকান মুখ", value: "Dry Mouth" },
          ],
        },
      },
    },
    {
      id: 13,
      category: "saliva",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "saliva-taste",
      translation: {
        en: {
          quesNo: "13",
          quesName: "Saliva Taste",
          options: [
            { id: 1, label: "Normal", value: "Normal" },
            { id: 2, label: "Bitter", value: "Bitter" },
            { id: 3, label: "Others", value: "Others" },
          ],
        },
        bn: {
          quesNo: "১৩",
          quesName: "লালার স্বাদ কেমন",
          options: [
            { id: 1, label: "স্বাভাবিক", value: "Normal" },
            { id: 2, label: "তিক্ত", value: "Bitter" },
            { id: 3, label: "অন্যান্য", value: "Others" },
          ],
        },
        as: {
          quesNo: "১৩",
          quesName: "লালটিৰ সোৱাদ কেনেকুৱা",
          options: [
            { id: 1, label: "স্বাভাৱিক", value: "Normal" },
            { id: 2, label: "তিতা", value: "Bitter" },
            { id: 3, label: "অন্যান্য", value: "Others" },
          ],
        },
      },
    },
  ],

  // Menstrual Flow
  menstrual: [
    {
      id: 14,
      category: "menstrual",
      type: "single-choice",
      gender: ["F"],
      quesKey: "menstrual-status",
      translation: {
        en: {
          quesNo: "14",
          quesName: "Menstruation status",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "১৪",
          quesName: "মাসিক হয়",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "১৪",
          quesName: "মাহেকীয়া আছে নে",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
    {
      id: 15,
      category: "menstrual",
      type: "single-choice",
      gender: ["F"],
      quesKey: "menstrual-amount",
      showIf: { "menstrual-status": ["Yes"] },
      translation: {
        en: {
          quesNo: "15",
          quesName: "Menstrual flow amount",
          options: [
            { id: 1, label: "Normal", value: "Normal" },
            { id: 2, label: "Heavy", value: "Heavy" },
            { id: 3, label: "Scanty", value: "Scanty" },
          ],
        },
        bn: {
          quesNo: "১৫",
          quesName: "মাসিকের প্রবাহ",
          options: [
            { id: 1, label: "স্বাভাবিক", value: "Normal" },
            { id: 2, label: "প্রচুর", value: "Heavy" },
            { id: 3, label: "স্বল্প", value: "Scanty" },
          ],
        },
        as: {
          quesNo: "১৫",
          quesName: "মাহেকীয়া তেজৰ প্ৰবাহ ",
          options: [
            { id: 1, label: "স্বাভাৱিক", value: "Normal" },
            { id: 2, label: "বেছি", value: "Heavy" },
            { id: 3, label: "কম", value: "Scanty" },
          ],
        },
      },
    },
    {
      id: 16,
      category: "menstrual",
      type: "single-choice",
      gender: ["F"],
      quesKey: "menstrual-duration",
      showIf: { "menstrual-status": ["Yes"] },

      translation: {
        en: {
          quesNo: "16",
          quesName: "Duration of menstrual flow",
          options: [
            { id: 1, label: "Normal", value: "Normal" },
            { id: 2, label: "Prolonged", value: "Prolonged" },
            { id: 3, label: "Shortened", value: "Shortened" },
          ],
        },
        bn: {
          quesNo: "১৬",
          quesName: "মাসিক প্রবাহের সময়কাল কত",
          options: [
            { id: 1, label: "স্বাভাবিক", value: "Normal" },
            { id: 2, label: "দীর্ঘায়িত", value: "Prolonged" },
            { id: 3, label: "হ্রাসপ্রাপ্ত", value: "Shortened" },
          ],
        },
        as: {
          quesNo: "১৬",
          quesName: "মাহেকীয়া তেজৰ প্ৰবাহৰ সময়সীমা কিমান",
          options: [
            { id: 1, label: "স্বাভাৱিক", value: "Normal" },
            { id: 2, label: "দীঘলীয়া", value: "Prolonged" },
            { id: 3, label: "চুটি", value: "Shortened" },
          ],
        },
      },
    },
    {
      id: 17,
      category: "menstrual",
      type: "single-choice",
      gender: ["F"],
      quesKey: "menstrual-clots",
      showIf: { "menstrual-status": ["Yes"] },

      translation: {
        en: {
          quesNo: "17",
          quesName: "Clots in flow",
          options: [
            { id: 1, label: "None", value: "None" },
            { id: 2, label: "Small", value: "Small" },
            { id: 3, label: "Large", value: "Large" },
          ],
        },
        bn: {
          quesNo: "১৭",
          quesName: "জমাট আছে কি",
          options: [
            { id: 1, label: "নেই", value: "None" },
            { id: 2, label: "ছোট", value: "Small" },
            { id: 3, label: "বড়", value: "Large" },
          ],
        },
        as: {
          quesNo: "১৭",
          quesName: "তেজ গোট মৰা দেখিছেনে",
          options: [
            { id: 1, label: "নাই", value: "None" },
            { id: 2, label: "সৰু", value: "Small" },
            { id: 3, label: "ডাঙৰ", value: "Large" },
          ],
        },
      },
    },
  ],

  //urination
  urination: [
    {
      id: 18,
      category: "urination",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "urine-frequency",
      translation: {
        en: {
          quesNo: "6",
          quesName: "Urine frequency",
          options: [
            { id: 1, label: "Normal (6–8 times/day)", value: "Normal" },
            { id: 2, label: "High (More than 8 times/day)", value: "High" },
            { id: 3, label: "Less (Less than 5 times/day)", value: "Less" },
          ],
        },
        bn: {
          quesNo: "৬",
          quesName: "প্রস্রাবের ফ্রিকোয়েন্সি কত",
          options: [
            { id: 1, label: "স্বাভাবিক (৬-৮ বার/দিন)", value: "Normal" },
            { id: 2, label: "বেশি (৮ বারের বেশি/দিন)", value: "High" },
            { id: 3, label: "কম (৫ বারের কম/দিন)", value: "Less" },
          ],
        },
        as: {
          quesNo: "৬",
          quesName: "কিমান সঘনাই প্ৰস্ৰাৱ কৰে",
          options: [
            { id: 1, label: "স্বাভাৱিক (দিনত ৬-৮ বাৰ)", value: "Normal" },
            { id: 2, label: "বেছি (দিনত ৮ বাৰতকৈ বেছি)", value: "High" },
            { id: 3, label: "কম (দিনত ৫ বাৰতকৈ কম)", value: "Less" },
          ],
        },
      },
    },
    {
      id: 19,
      category: "urination",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "urine-color",
      translation: {
        en: {
          quesNo: "7",
          quesName: "Urine color",
          options: [
            { id: 1, label: "Normal (Pale Yellow to Amber)", value: "Normal" },
            { id: 2, label: "Dark Yellow / Brown", value: "Dark" },
            { id: 3, label: "Red / Pink", value: "Red" },
            { id: 4, label: "Others", value: "Others" },
          ],
        },
        bn: {
          quesNo: "৭",
          quesName: "প্রস্রাবের রঙ কী",
          options: [
            {
              id: 1,
              label: "স্বাভাবিক (হালকা হলুদ থেকে অ্যাম্বার)",
              value: "Normal",
            },
            { id: 2, label: "গাঢ় হলুদ / বাদামী", value: "Dark" },
            { id: 3, label: "লাল / গোলাপী", value: "Red" },
            { id: 4, label: "অন্যান্য", value: "Others" },
          ],
        },
        as: {
          quesNo: "৭",
          quesName: "প্ৰস্ৰাৱৰ ৰং কি",
          options: [
            {
              id: 1,
              label: "স্বাভাৱিক (পাতল হালধীয়াৰ পৰা এম্বাৰ)",
              value: "Normal",
            },
            { id: 2, label: "গাঢ় হালধীয়া / মটীয়া", value: "Dark" },
            { id: 3, label: "ৰঙা / গোলাপী", value: "Red" },
            { id: 4, label: "অন্যান্য", value: "Others" },
          ],
        },
      },
    },
    {
      id: 20,
      category: "urination",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "urine-odor",
      translation: {
        en: {
          quesNo: "8",
          quesName: "Urine odor",
          options: [
            { id: 1, label: "Normal (Mild / Non-Offensive)", value: "Normal" },
            { id: 2, label: "Strong", value: "Strong" },
            { id: 3, label: "Others", value: "Others" },
          ],
        },
        bn: {
          quesNo: "৮",
          quesName: "প্রস্রাবের গন্ধ কেমন",
          options: [
            { id: 1, label: "স্বাভাবিক (হালকা / আপত্তিকর নয়)", value: "Normal" },
            { id: 2, label: "তীব্র", value: "Strong" },
            { id: 3, label: "অন্যান্য", value: "Others" },
          ],
        },
        as: {
          quesNo: "৮",
          quesName: "প্ৰস্ৰাৱৰ গোন্ধ কেনেকুৱা",
          options: [
            { id: 1, label: "স্বাভাৱিক (মৃদু / আপত্তিজনক নহয়)", value: "Normal" },
            { id: 2, label: "তীব্ৰ", value: "Strong" },
            { id: 3, label: "অন্যান্য", value: "Others" },
          ],
        },
      },
    },
    {
      id: 21,
      category: "urination",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "urine-discomfort",
      translation: {
        en: {
          quesNo: "9",
          quesName: "Urination pain",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "৯",
          quesName: "প্রস্রাব করার সময় কি আপনার ব্যথা বা অস্বস্তি হয়",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "৯",
          quesName: "প্ৰস্ৰাৱ কৰোঁতে আপুনি বিষ বা অস্বস্তি অনুভৱ কৰে নে",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
    {
      id: 22,
      category: "urination",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "urine-control",
      translation: {
        en: {
          quesNo: "10",
          quesName: "Urine control",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "১০",
          quesName: "প্রস্রাব নিয়ন্ত্রণ করতে পারেন",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "১০",
          quesName: "প্ৰস্ৰাৱ নিয়ন্ত্ৰণ কৰিব পাৰেনে",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
  ],
};

export const stoolDescriptions = {
  en: [
    "Normal: Brown, well-formed, and smooth",
    "Hard: Small, dry, and difficult to pass",
    "Loose:Watery or loose consistency",
  ],
  bn: [
    "স্বাভাবিক: বাদামী, ভাল গঠিত এবং মসৃণ",
    "স্বাভাবিক: ছোট, শুকনো এবং বের করতে কঠিন",
    "পাতলা: পানি জাতীয় বা ঢিলা প্রকৃতির",
  ],
  as: [
    "স্বাভাৱিক: বগা, ভাল গঠন থকা আৰু মচকোৱা",
    "শুকান: সৰু, শুকান আৰু ওলাবলৈ কঠিন",
    "ঢিলা: পানীযুক্ত বা ঢিলা স্বভাৱৰ",
  ],
};

export const stoolSmellDescriptions = {
  en: ["Normal:Typical smell, not overly offensive", "Foul or Unusual:Strong and unpleasant odor"],
  bn: [
    "স্বাভাবিক: স্বাভাবিক গন্ধ, খুব বেশি অস্বস্তিকর নয়",
    "দুর্গন্ধযুক্ত বা অস্বাভাবিক: তীব্র এবং অপ্রিয় গন্ধ",
  ],
  as: [
    "স্বাভাৱিক: সাধাৰণ গন্ধ, অতিপাত বেয়া নহয়",
    "দুৰ্গন্ধযুক্ত বা অস্বাভাৱিক: বেছি তীব্ৰ আৰু বেয়া গন্ধ",
  ],

  // en: "Strong and unpleasant odor",
  // bn: "তীব্র এবং অপ্রিয় গন্ধ",
  // as: "বেছি তীব্ৰ আৰু বেয়া গন্ধ",
};
