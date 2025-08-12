// export const skin = {
//   "my-skin": [
//     {
//       id: 1,
//       type: "single-choice",
//       gender: ["M", "F"],
//       category: "my-skin",
//       quesKey: "mySkinType",
//       translation: {
//         en: {
//           quesNo: "1",
//           quesName: "What is your skin type",
//           options: [
//             { id: 1, label: "Normal Skin", value: "Normal Skin" },
//             { id: 2, label: "Dry", value: "Dry" },
//             { id: 3, label: "Oily", value: "Oily" },
//             { id: 4, label: "Others", value: "Others" },
//           ],
//         },
//         bn: {
//           quesNo: "১",
//           quesName: "আপনার ত্বকের ধরন কী?",
//           options: [
//             { id: 1, label: "স্বাভাবিক ত্বক", value: "Normal Skin" },
//             { id: 2, label: "শুষ্ক", value: "Dry" },
//             { id: 3, label: "তৈলাক্ত", value: "Oily" },
//             { id: 4, label: "অন্যান্য", value: "Others" },
//           ],
//         },
//         as: {
//           quesNo: "১",
//           quesName: "আপোনাৰ ছালৰ প্ৰকাৰ কি?",
//           options: [
//             { id: 1, label: "স্বাভাৱিক ছাল", value: "Normal Skin" },
//             { id: 2, label: "শুকান", value: "Dry" },
//             { id: 3, label: "তেলীয়া", value: "Oily" },
//             { id: 4, label: "আন্য", value: "Others" },
//           ],
//         },
//       },
//     },
//     {
//       id: 2,
//       type: "single-choice",
//       gender: ["M", "F"],
//       category: "my-skin",
//       quesKey: "mySkinColor",
//       translation: {
//         en: {
//           quesNo: "2",
//           quesName: "What is your skin color?",
//           options: [
//             { id: 1, label: "Light (Fair)", value: "Light (Fair)" },
//             { id: 2, label: "Medium Skin", value: "Medium Skin" },
//             { id: 3, label: "Dark Skin", value: "Dark Skin" },
//             { id: 4, label: "Others", value: "Others" },
//           ],
//         },
//         bn: {
//           quesNo: "২",
//           quesName: "আপনার ত্বকের রং কী?",
//           options: [
//             { id: 1, label: "ফর্সা", value: "Light (Fair)" },
//             { id: 2, label: "মাঝারি", value: "Medium Skin" },
//             { id: 3, label: "গাড়ো", value: "Dark Skin" },
//             { id: 4, label: "অন্যান্য", value: "Others" },
//           ],
//         },
//         as: {
//           quesNo: "২",
//           quesName: "আপোনাৰ ছালৰ ৰং কি?",
//           options: [
//             { id: 1, label: "উজ্জ্বল", value: "Light (Fair)" },
//             { id: 2, label: "মধ্যম", value: "Medium Skin" },
//             { id: 3, label: "ডাঠ", value: "Dark Skin" },
//             { id: 4, label: "আন্য", value: "Others" },
//           ],
//         },
//       },
//     },
//     {
//       id: 3,
//       type: "multi-choice",
//       gender: ["M", "F"],
//       category: "my-skin",
//       quesKey: "mySkinSurface",
//       translation: {
//         en: {
//           quesNo: "3",
//           quesName: "Do you have any of the following skin surface conditions?",
//           options: [
//             { id: 1, label: "Dry Skin (Xerosis)", value: "Dry Skin (Xerosis)" },
//             { id: 2, label: "Urticaria (Hives)", value: "Urticaria (Hives)" },
//             { id: 3, label: "Vitiligo", value: "Vitiligo" },
//           ],
//         },
//         bn: {
//           quesNo: "৩",
//           quesName: "আপনার কি নিচের কোনো ত্বকের উপরিভাগের সমস্যা আছে?",
//           options: [
//             { id: 1, label: "শুষ্ক ত্বক (জেরোসিস)", value: "Dry Skin (Xerosis)" },
//             { id: 2, label: "আর্টিকেরিয়া (আঁচিল)", value: "Urticaria (Hives)" },
//             { id: 3, label: "ভিটিলিগো", value: "Vitiligo" },
//           ],
//         },
//         as: {
//           quesNo: "৩",
//           quesName: "আপোনাৰ তলৰ কোনো ছালৰ উপৰিভাগৰ সমস্যা আছে নেকি?",
//           options: [
//             { id: 1, label: "শুকান ছাল (জেৰ'ছিছ)", value: "Dry Skin (Xerosis)" },
//             { id: 2, label: "আর্টিকেৰিয়া (হাইভছ)", value: "Urticaria (Hives)" },
//             { id: 3, label: "ভিটিলিগো", value: "Vitiligo" },
//           ],
//         },
//       },
//     },

//     {
//       id: 4,
//       type: "single-choice",
//       gender: ["M", "F"],
//       category: "my-skin",
//       quesKey: "skinIssuesConfirmation",
//       translation: {
//         en: {
//           quesNo: "4",
//           quesName: "Do you have any of the skin issue?",
//           options: [
//             { id: 1, label: "Yes", value: "Yes" },
//             { id: 2, label: "No", value: "No" },
//           ],
//         },
//         bn: {
//           quesNo: "৪",
//           quesName: "আপনার কি ত্বকের কোনো সমস্যা আছে?",
//           options: [
//             { id: 1, label: "হ্যাঁ", value: "Yes" },
//             { id: 2, label: "না", value: "No" },
//           ],
//         },
//         as: {
//           quesNo: "৪",
//           quesName: "আপোনাৰ ছালৰ কোনো সমস্যা আছে নেকি?",
//           options: [
//             { id: 1, label: "হয়", value: "Yes" },
//             { id: 2, label: "নহয়", value: "No" },
//           ],
//         },
//       },
//     },
//     // pain

//     {
//       id: 16,
//       category: "my-skin",
//       type: "single-choice",
//       quesKey: "skinIssuesTypePain",
//       showIf: {
//         skinIssuesConfirmation: ["Yes"],
//       },
//       translation: {
//         en: {
//           quesNo: "1",
//           quesName: "Do you have pain?",
//           options: [
//             { id: 1, label: "Yes", value: "Yes" },
//             { id: 2, label: "No", value: "No" },
//           ],
//         },
//         bn: {
//           quesNo: "১",
//           quesName: "আপনার কাফ এ ব্যথা আছে?",
//           options: [
//             { id: 1, label: "হ্যাঁ", value: "Yes" },
//             { id: 2, label: "না", value: "No" },
//           ],
//         },
//         as: {
//           quesNo: "১",
//           quesName: "আপোনাৰ কাফত বিষ আছে নেকি?",
//           options: [
//             { id: 1, label: "হয়", value: "Yes" },
//             { id: 2, label: "নহয়", value: "No" },
//           ],
//         },
//       },
//     },
//     {
//       id: 9,
//       type: "slider",
//       gender: ["M", "F"],
//       category: "my-skin",
//       quesKey: "skinIssuePainIntensity",
//       showIf: {
//         skinIssuesTypePain: ["Yes"],
//       },
//       translation: {
//         en: {
//           quesNo: "9",
//           quesName: "What is the intensity of the pain?",
//           options: [
//             { id: 1, label: "Mild", value: "Mild" },
//             { id: 2, label: "Moderate", value: "Moderate" },
//             { id: 3, label: "Severe", value: "Severe" },
//           ],
//         },
//         bn: {
//           quesNo: "৯",
//           quesName: "ব্যথার তীব্রতা কতটুকু?",
//           options: [
//             { id: 1, label: "হালকা", value: "Mild" },
//             { id: 2, label: "মাঝারি", value: "Moderate" },
//             { id: 3, label: "তীব্র", value: "Severe" },
//           ],
//         },
//         as: {
//           quesNo: "৯",
//           quesName: "বিষৰ প্ৰাবল্য কিমান?",
//           options: [
//             { id: 1, label: "কম", value: "Mild" },
//             { id: 2, label: "মধ্যম", value: "Moderate" },
//             { id: 3, label: "বেছি", value: "Severe" },
//           ],
//         },
//       },
//     },
//     {
//       id: 10,
//       type: "single-choice",
//       gender: ["M", "F"],
//       category: "my-skin",
//       quesKey: "skinIssuePainPattern",
//       showIf: {
//         skinIssuesTypePain: ["Yes"],
//       },
//       translation: {
//         en: {
//           quesNo: "10",
//           quesName: "What is the pattern of the pain?",
//           options: [
//             { id: 1, label: "Continuous", value: "Continuous" },
//             { id: 2, label: "Comes and goes", value: "Comes and goes" },
//             { id: 3, label: "Others", value: "Others" },
//           ],
//         },
//         bn: {
//           quesNo: "১০",
//           quesName: "ব্যথার ধরন কেমন?",
//           options: [
//             { id: 1, label: "ক্রমাগত", value: "Continuous" },
//             { id: 2, label: "আসে আর যায়", value: "Comes and goes" },
//             { id: 3, label: "অন্যান্য", value: "Others" },
//           ],
//         },
//         as: {
//           quesNo: "১০",
//           quesName: "বিষৰ প্ৰকাৰ কেনেকুৱা?",
//           options: [
//             { id: 1, label: "ধাৰাবাহিক", value: "Continuous" },
//             { id: 2, label: "আহে আৰু যায়", value: "Comes and goes" },
//             { id: 3, label: "অন্যান্য", value: "Others" },
//           ],
//         },
//       },
//     },
//     {
//       id: 11,
//       type: "multi-choice",
//       gender: ["M", "F"],
//       category: "my-skin",
//       quesKey: "skinIssuePainTiming",
//       showIf: {
//         skinIssuesTypePain: ["Yes"],
//       },
//       translation: {
//         en: {
//           quesNo: "5",
//           quesName: "When does your pain occur?",
//           options: [
//             { id: 1, label: "During activity", value: "During_Activity" },
//             { id: 2, label: "At rest", value: "At_Rest" },
//             { id: 6, label: "Others", value: "Others" },
//           ],
//         },
//         bn: {
//           quesNo: "৫",
//           quesName: "আপনার ব্যথা কখন হয়?",
//           options: [
//             { id: 1, label: "কার্যকলাপের সময়", value: "During_Activity" },
//             { id: 2, label: "বিশ্রামে", value: "At_Rest" },
//             { id: 6, label: "অন্যান্য", value: "Others" },
//           ],
//         },
//         as: {
//           quesNo: "৫",
//           quesName: "আপোনাৰ বিষ কেতিয়া হয়?",
//           options: [
//             { id: 1, label: "ক্ৰিয়াকলাপৰ সময়ত", value: "During_Activity" },
//             { id: 2, label: "বিশ্ৰামত", value: "At_Rest" },
//             { id: 6, label: "অন্যান্য", value: "Others" },
//           ],
//         },
//       },
//     },

//     // itching
//     {
//       id: 19,
//       category: "my-skin",
//       type: "single-choice",
//       quesKey: "skinIssuesTypeItching",
//       showIf: {
//         skinIssuesConfirmation: ["Yes"],
//       },
//       translation: {
//         en: {
//           quesNo: "15",
//           quesName: "Are you experiencing itching?",
//           options: [
//             { id: 1, label: "Yes", value: "Yes" },
//             { id: 2, label: "No", value: "No" },
//           ],
//         },
//         bn: {
//           quesNo: "১৫",
//           quesName: "আপনার চুলকানি হচ্ছে কি?",
//           options: [
//             { id: 1, label: "হ্যাঁ", value: "Yes" },
//             { id: 2, label: "না", value: "No" },
//           ],
//         },
//         as: {
//           quesNo: "১৫",
//           quesName: "আপোনাৰ খুজলি হৈছে নেকি?",
//           options: [
//             { id: 1, label: "হয়", value: "Yes" },
//             { id: 2, label: "নহয়", value: "No" },
//           ],
//         },
//       },
//     },
//     {
//       id: 6,
//       type: "single-choice",
//       gender: ["M", "F"],
//       category: "my-skin",
//       quesKey: "skinIchitingOnset",
//       showIf: {
//         skinIssuesTypeItching: ["Yes"],
//       },
//       translation: {
//         en: {
//           quesNo: "6",
//           quesName: "Was the symptom sudden in onset?",
//           options: [
//             { id: 1, label: "Yes", value: "Yes" },
//             { id: 2, label: "No", value: "No" },
//           ],
//         },
//         bn: {
//           quesNo: "৬",
//           quesName: "লক্ষণ কি হঠাৎ করে শুরু হয়েছিল?",
//           options: [
//             { id: 1, label: "হ্যাঁ", value: "Yes" },
//             { id: 2, label: "না", value: "No" },
//           ],
//         },
//         as: {
//           quesNo: "৬",
//           quesName: "উপসৰ্গ কি হঠাৎ আৰম্ভ হৈছিল?",
//           options: [
//             { id: 1, label: "হয়", value: "Yes" },
//             { id: 2, label: "নহয়", value: "No" },
//           ],
//         },
//       },
//     },
//     {
//       id: 7,
//       type: "single-choice",
//       gender: ["M", "F"],
//       category: "my-skin",
//       quesKey: "skinIchitingDuration",
//       showIf: {
//         skinIssuesTypeItching: ["Yes"],
//       },
//       translation: {
//         en: {
//           quesNo: "7",
//           quesName: "What is the duration of itching?",
//           options: [
//             { id: 1, label: "Short", value: "Short" },
//             { id: 2, label: "Long", value: "Long" },
//           ],
//         },
//         bn: {
//           quesNo: "৭",
//           quesName: "চুলকানির সময়কাল কত?",
//           options: [
//             { id: 1, label: "স্বল্প", value: "Short" },
//             { id: 2, label: "দীর্ঘ", value: "Long" },
//           ],
//         },
//         as: {
//           quesNo: "৭",
//           quesName: "খুজলিৰ সময়সীমা কিমান?",
//           options: [
//             { id: 1, label: "কম", value: "Short" },
//             { id: 2, label: "বেছি", value: "Long" },
//           ],
//         },
//       },
//     },
//     {
//       id: 8,
//       type: "file",
//       gender: ["M", "F"],
//       category: "my-skin",
//       quesKey: "skinIchitingImage",
//       showIf: {
//         skinIssuesTypeItching: ["Yes"],
//       },
//       translation: {
//         en: {
//           quesNo: "8",
//           quesName: "Please upload image",
//           options: [],
//         },
//         bn: {
//           quesNo: "৮",
//           quesName: "ছবি আপলোড করুন",
//           options: [],
//         },
//         as: {
//           quesNo: "৮",
//           quesName: "অনুগ্রহ কৰি ছবি আপলোড কৰক",
//           options: [],
//         },
//       },
//     },

//     // swelling

//     {
//       id: 17,
//       category: "my-skin",
//       type: "single-choice",
//       quesKey: "skinIssuesTypeSwelling",
//       showIf: {
//         skinIssuesConfirmation: ["Yes"],
//       },
//       translation: {
//         en: {
//           quesNo: "7",
//           quesName: "Do you have swelling",
//           options: [
//             { id: 1, label: "Yes", value: "Yes" },
//             { id: 2, label: "No", value: "No" },
//           ],
//         },
//         bn: {
//           quesNo: "৭",
//           quesName: "আপনার ফোলা আছে?",
//           options: [
//             { id: 1, label: "হ্যাঁ", value: "Yes" },
//             { id: 2, label: "না", value: "No" },
//           ],
//         },
//         as: {
//           quesNo: "৭",
//           quesName: "আপোনাৰ ফুলা আছে নেকি?",
//           options: [
//             { id: 1, label: "হয়", value: "Yes" },
//             { id: 2, label: "নহয়", value: "No" },
//           ],
//         },
//       },
//     },
//     {
//       id: 12,
//       type: "single-choice",
//       gender: ["M", "F"],
//       category: "my-skin",
//       quesKey: "skinIssueSwellingVisibility",
//       showIf: {
//         skinIssuesTypeSwelling: ["Yes"],
//       },
//       translation: {
//         en: {
//           quesNo: "12",
//           quesName: "Is the symptom visible?",
//           options: [
//             { id: 1, label: "Yes", value: "Yes" },
//             { id: 2, label: "No", value: "No" },
//           ],
//         },
//         bn: {
//           quesNo: "১২",
//           quesName: "লক্ষণটি কি দৃশ্যমান?",
//           options: [
//             { id: 1, label: "হ্যাঁ", value: "Yes" },
//             { id: 2, label: "না", value: "No" },
//           ],
//         },
//         as: {
//           quesNo: "১২",
//           quesName: "উপসৰ্গটো কি চকুত পৰে?",
//           options: [
//             { id: 1, label: "হয়", value: "Yes" },
//             { id: 2, label: "নহয়", value: "No" },
//           ],
//         },
//       },
//     },
//     {
//       id: 13,
//       type: "file",
//       gender: ["M", "F"],
//       category: "my-skin",
//       quesKey: "skinIssueSwellingImage",
//       showIf: {
//         skinIssueSwellingVisibility: ["Yes"],
//       },
//       translation: {
//         en: {
//           quesNo: "13",
//           quesName: "Please upload the image.",
//           options: [],
//         },
//         bn: {
//           quesNo: "১৩",
//           quesName: "ছবি আপলোড করুন।",
//           options: [],
//         },
//         as: {
//           quesNo: "১৩",
//           quesName: "অনুগ্রহ কৰি ছবি আপলোড কৰক।",
//           options: [],
//         },
//       },
//     },

//     // rash
//     {
//       id: 18,
//       category: "my-skin",
//       type: "single-choice",
//       quesKey: "skinIssuesTypeRash",
//       showIf: {
//         skinIssuesConfirmation: ["Yes"],
//       },
//       translation: {
//         en: {
//           quesNo: "11",
//           quesName: "Do you have a rash or bruising on the affected area?",
//           options: [
//             { id: 1, label: "Yes", value: "Yes" },
//             { id: 2, label: "No", value: "No" },
//           ],
//         },
//         bn: {
//           quesNo: "১১",
//           quesName: "আক্রান্ত স্থানে আপনার ফুসকুড়ি বা কালশিরা আছে কি?",
//           options: [
//             { id: 1, label: "হ্যাঁ", value: "Yes" },
//             { id: 2, label: "না", value: "No" },
//           ],
//         },
//         as: {
//           quesNo: "১১",
//           quesName: "আঘাতপ্ৰাপ্ত ঠাইত আপোনাৰ ফোহা বা ৰঙচুৱা দাগ আছে নেকি?",
//           options: [
//             { id: 1, label: "হয়", value: "Yes" },
//             { id: 2, label: "নহয়", value: "No" },
//           ],
//         },
//       },
//     },
//     {
//       id: 14,
//       type: "single-choice",
//       gender: ["M", "F"],
//       category: "my-skin",
//       quesKey: "skinIssueRashBruisingVisibility",
//       showIf: {
//         skinIssuesTypeRash: ["Yes"],
//       },
//       translation: {
//         en: {
//           quesNo: "14",
//           quesName: "Is the rash/bruising visible?",
//           options: [
//             { id: 1, label: "Yes", value: "Yes" },
//             { id: 2, label: "No", value: "No" },
//           ],
//         },
//         bn: {
//           quesNo: "১৪",
//           quesName: "র‍্যাশ/আঘাতের দাগ কি দৃশ্যমান?",
//           options: [
//             { id: 1, label: "হ্যাঁ", value: "Yes" },
//             { id: 2, label: "না", value: "No" },
//           ],
//         },
//         as: {
//           quesNo: "১৪",
//           quesName: "ৰেচ/আঘাতৰ চিন চকুত পৰে নেকি?",
//           options: [
//             { id: 1, label: "হয়", value: "Yes" },
//             { id: 2, label: "নহয়", value: "No" },
//           ],
//         },
//       },
//     },
//     {
//       id: 15,
//       type: "file",
//       gender: ["M", "F"],
//       category: "my-skin",
//       quesKey: "skinIssueRashBruisingImage",
//       showIf: {
//         skinIssueRashBruisingVisibility: ["Yes"],
//       },
//       translation: {
//         en: {
//           quesNo: "15",
//           quesName: "Please upload the image.",
//           options: [],
//         },
//         bn: {
//           quesNo: "১৫",
//           quesName: "ছবি আপলোড করুন।",
//           options: [],
//         },
//         as: {
//           quesNo: "১৫",
//           quesName: "অনুগ্রহ কৰি ছবি আপলোড কৰক।",
//           options: [],
//         },
//       },
//     },
//   ],
// };

export const skin = {
  "my-skin": [
    {
      id: 1,
      type: "single-choice",
      gender: ["M", "F"],
      category: "my-skin",
      quesKey: "mySkinType",
      translation: {
        en: {
          quesNo: "1",
          quesName: "Skin type",
          options: [
            { id: 1, label: "Normal Skin", value: "Normal Skin" },
            { id: 2, label: "Dry", value: "Dry" },
            { id: 3, label: "Oily", value: "Oily" },
            { id: 4, label: "Others", value: "Others" },
          ],
        },
        bn: {
          quesNo: "১",
          quesName: "ত্বকের ধরন",
          options: [
            { id: 1, label: "স্বাভাবিক", value: "Normal Skin" },
            { id: 2, label: "শুষ্ক", value: "Dry" },
            { id: 3, label: "তৈলাক্ত", value: "Oily" },
            { id: 4, label: "অন্যান্য", value: "Others" },
          ],
        },
        as: {
          quesNo: "১",
          quesName: "ছালৰ প্ৰকাৰ",
          options: [
            { id: 1, label: "স্বাভাৱিক", value: "Normal Skin" },
            { id: 2, label: "শুকান", value: "Dry" },
            { id: 3, label: "তেলীয়া", value: "Oily" },
            { id: 4, label: "আন্য", value: "Others" },
          ],
        },
      },
    },
    {
      id: 2,
      type: "single-choice",
      gender: ["M", "F"],
      category: "my-skin",
      quesKey: "mySkinColor",
      translation: {
        en: {
          quesNo: "2",
          quesName: "Skin color",
          options: [
            { id: 1, label: "Light", value: "Light (Fair)" },
            { id: 2, label: "Medium", value: "Medium Skin" },
            { id: 3, label: "Dark", value: "Dark Skin" },
            { id: 4, label: "Others", value: "Others" },
          ],
        },
        bn: {
          quesNo: "২",
          quesName: "ত্বকের রং",
          options: [
            { id: 1, label: "ফর্সা", value: "Light (Fair)" },
            { id: 2, label: "মাঝারি", value: "Medium Skin" },
            { id: 3, label: "গাড়ো", value: "Dark Skin" },
            { id: 4, label: "অন্যান্য", value: "Others" },
          ],
        },
        as: {
          quesNo: "২",
          quesName: "ছালৰ ৰং",
          options: [
            { id: 1, label: "উজ্জ্বল", value: "Light (Fair)" },
            { id: 2, label: "মধ্যম", value: "Medium Skin" },
            { id: 3, label: "ডাঠ", value: "Dark Skin" },
            { id: 4, label: "আন্য", value: "Others" },
          ],
        },
      },
    },
    // {
    //   id: 3,
    //   type: "multi-choice",
    //   gender: ["M", "F"],
    //   category: "my-skin",
    //   quesKey: "mySkinSurface",
    //   translation: {
    //     en: {
    //       quesNo: "3",
    //       quesName: "Skin surface issue",
    //       options: [
    //         { id: 1, label: "Dry", value: "Dry Skin (Xerosis)" },
    //         { id: 2, label: "Hives", value: "Urticaria (Hives)" },
    //         { id: 3, label: "Vitiligo", value: "Vitiligo" },
    //       ],
    //     },
    //     bn: {
    //       quesNo: "৩",
    //       quesName: "ত্বকের উপর সমস্যা",
    //       options: [
    //         { id: 1, label: "শুষ্ক", value: "Dry Skin (Xerosis)" },
    //         { id: 2, label: "আঁচিল", value: "Urticaria (Hives)" },
    //         { id: 3, label: "ভিটিলিগো", value: "Vitiligo" },
    //       ],
    //     },
    //     as: {
    //       quesNo: "৩",
    //       quesName: "ছালৰ ওপৰ সমস্যা",
    //       options: [
    //         { id: 1, label: "শুকান", value: "Dry Skin (Xerosis)" },
    //         { id: 2, label: "হাইভছ", value: "Urticaria (Hives)" },
    //         { id: 3, label: "ভিটিলিগো", value: "Vitiligo" },
    //       ],
    //     },
    //   },
    // },
    {
      id: 4,
      type: "single-choice",
      gender: ["M", "F"],
      category: "my-skin",
      quesKey: "skinIssuesConfirmation",
      translation: {
        en: {
          quesNo: "4",
          quesName: "Skin problem",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "৪",
          quesName: "ত্বকের সমস্যা",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "৪",
          quesName: "ছালৰ সমস্যা",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
    // pain
    {
      id: 16,
      category: "my-skin",
      type: "single-choice",
      quesKey: "skinIssuesTypePain",
      showIf: {
        skinIssuesConfirmation: ["Yes"],
      },
      translation: {
        en: {
          quesNo: "1",
          quesName: "Pain",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "১",
          quesName: "ব্যথা",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "১",
          quesName: "বিষ",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
    {
      id: 9,
      type: "slider",
      gender: ["M", "F"],
      category: "my-skin",
      quesKey: "skinIssuePainIntensity",
      showIf: {
        skinIssuesTypePain: ["Yes"],
      },
      translation: {
        en: {
          quesNo: "9",
          quesName: "Pain level",
          options: [
            { id: 1, label: "Mild", value: "Mild" },
            { id: 2, label: "Moderate", value: "Moderate" },
            { id: 3, label: "Severe", value: "Severe" },
          ],
        },
        bn: {
          quesNo: "৯",
          quesName: "ব্যথার মাত্রা",
          options: [
            { id: 1, label: "হালকা", value: "Mild" },
            { id: 2, label: "মাঝারি", value: "Moderate" },
            { id: 3, label: "তীব্র", value: "Severe" },
          ],
        },
        as: {
          quesNo: "৯",
          quesName: "বিষৰ মাত্রা",
          options: [
            { id: 1, label: "কম", value: "Mild" },
            { id: 2, label: "মধ্যম", value: "Moderate" },
            { id: 3, label: "বেছি", value: "Severe" },
          ],
        },
      },
    },
    {
      id: 10,
      type: "single-choice",
      gender: ["M", "F"],
      category: "my-skin",
      quesKey: "skinIssuePainPattern",
      showIf: {
        skinIssuesTypePain: ["Yes"],
      },
      translation: {
        en: {
          quesNo: "10",
          quesName: "Pain pattern",
          options: [
            { id: 1, label: "Continuous", value: "Continuous" },
            { id: 2, label: "Comes and goes", value: "Comes and goes" },
            { id: 3, label: "Others", value: "Others" },
          ],
        },
        bn: {
          quesNo: "১০",
          quesName: "ব্যথার ধরন",
          options: [
            { id: 1, label: "ক্রমাগত", value: "Continuous" },
            { id: 2, label: "আসে যায়", value: "Comes and goes" },
            { id: 3, label: "অন্যান্য", value: "Others" },
          ],
        },
        as: {
          quesNo: "১০",
          quesName: "বিষৰ ধৰণ",
          options: [
            { id: 1, label: "ধাৰাবাহিক", value: "Continuous" },
            { id: 2, label: "আহে যায়", value: "Comes and goes" },
            { id: 3, label: "অন্যান্য", value: "Others" },
          ],
        },
      },
    },
    {
      id: 11,
      type: "multi-choice",
      gender: ["M", "F"],
      category: "my-skin",
      quesKey: "skinIssuePainTiming",
      showIf: {
        skinIssuesTypePain: ["Yes"],
      },
      translation: {
        en: {
          quesNo: "5",
          quesName: "Pain when",
          options: [
            { id: 1, label: "Activity", value: "During_Activity" },
            { id: 2, label: "Rest", value: "At_Rest" },
            { id: 6, label: "Others", value: "Others" },
          ],
        },
        bn: {
          quesNo: "৫",
          quesName: "ব্যথা কখন",
          options: [
            { id: 1, label: "কার্যকলাপে", value: "During_Activity" },
            { id: 2, label: "বিশ্রামে", value: "At_Rest" },
            { id: 6, label: "অন্যান্য", value: "Others" },
          ],
        },
        as: {
          quesNo: "৫",
          quesName: "বিষ কেতিয়া",
          options: [
            { id: 1, label: "ক্ৰিয়াকলাপে", value: "During_Activity" },
            { id: 2, label: "বিশ্ৰামত", value: "At_Rest" },
            { id: 6, label: "অন্যান্য", value: "Others" },
          ],
        },
      },
    },
    // itching
    {
      id: 19,
      category: "my-skin",
      type: "single-choice",
      quesKey: "skinIssuesTypeItching",
      showIf: {
        skinIssuesConfirmation: ["Yes"],
      },
      translation: {
        en: {
          quesNo: "15",
          quesName: "Itching",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "১৫",
          quesName: "চুলকানি",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "১৫",
          quesName: "খুজলি",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
    {
      id: 6,
      type: "single-choice",
      gender: ["M", "F"],
      category: "my-skin",
      quesKey: "skinIchitingOnset",
      showIf: {
        skinIssuesTypeItching: ["Yes"],
      },
      translation: {
        en: {
          quesNo: "6",
          quesName: "Sudden start",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "৬",
          quesName: "হঠাৎ শুরু",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "৬",
          quesName: "হঠাৎ আৰম্ভ",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
    {
      id: 7,
      type: "single-choice",
      gender: ["M", "F"],
      category: "my-skin",
      quesKey: "skinIchitingDuration",
      showIf: {
        skinIssuesTypeItching: ["Yes"],
      },
      translation: {
        en: {
          quesNo: "7",
          quesName: "Itching duration",
          options: [
            { id: 1, label: "Short", value: "Short" },
            { id: 2, label: "Long", value: "Long" },
          ],
        },
        bn: {
          quesNo: "৭",
          quesName: "চুলকানির সময়",
          options: [
            { id: 1, label: "স্বল্প", value: "Short" },
            { id: 2, label: "দীর্ঘ", value: "Long" },
          ],
        },
        as: {
          quesNo: "৭",
          quesName: "খুজলিৰ সময়",
          options: [
            { id: 1, label: "কম", value: "Short" },
            { id: 2, label: "বেছি", value: "Long" },
          ],
        },
      },
    },
    {
      id: 8,
      type: "file",
      gender: ["M", "F"],
      category: "my-skin",
      quesKey: "skinIchitingImage",
      showIf: {
        skinIssuesTypeItching: ["Yes"],
      },
      translation: {
        en: {
          quesNo: "8",
          quesName: "Upload image",
          options: [],
        },
        bn: {
          quesNo: "৮",
          quesName: "ছবি আপলোড",
          options: [],
        },
        as: {
          quesNo: "৮",
          quesName: "ছবি আপলোড কৰক",
          options: [],
        },
      },
    },
    // swelling
    {
      id: 17,
      category: "my-skin",
      type: "single-choice",
      quesKey: "skinIssuesTypeSwelling",
      showIf: {
        skinIssuesConfirmation: ["Yes"],
      },
      translation: {
        en: {
          quesNo: "7",
          quesName: "Swelling",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "৭",
          quesName: "ফোলা",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "৭",
          quesName: "ফুলা",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
    {
      id: 12,
      type: "single-choice",
      gender: ["M", "F"],
      category: "my-skin",
      quesKey: "skinIssueSwellingVisibility",
      showIf: {
        skinIssuesTypeSwelling: ["Yes"],
      },
      translation: {
        en: {
          quesNo: "12",
          quesName: "Visible",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "১২",
          quesName: "দৃশ্যমান",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "১২",
          quesName: "চকুত পৰে",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
    {
      id: 13,
      type: "file",
      gender: ["M", "F"],
      category: "my-skin",
      quesKey: "skinIssueSwellingImage",
      showIf: {
        skinIssueSwellingVisibility: ["Yes"],
      },
      translation: {
        en: {
          quesNo: "13",
          quesName: "Upload image",
          options: [],
        },
        bn: {
          quesNo: "১৩",
          quesName: "ছবি আপলোড",
          options: [],
        },
        as: {
          quesNo: "১৩",
          quesName: "ছবি আপলোড কৰক",
          options: [],
        },
      },
    },
    // rash
    {
      id: 18,
      category: "my-skin",
      type: "single-choice",
      quesKey: "skinIssuesTypeRash",
      showIf: {
        skinIssuesConfirmation: ["Yes"],
      },
      translation: {
        en: {
          quesNo: "11",
          quesName: "Rash or bruise",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "১১",
          quesName: "ফুসকুড়ি বা কালশিরা",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "১১",
          quesName: "ফোহা বা দাগ",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
    {
      id: 14,
      type: "single-choice",
      gender: ["M", "F"],
      category: "my-skin",
      quesKey: "skinIssueRashBruisingVisibility",
      showIf: {
        skinIssuesTypeRash: ["Yes"],
      },
      translation: {
        en: {
          quesNo: "14",
          quesName: "Rash/bruise visible",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "১৪",
          quesName: "দাগ দৃশ্যমান",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "১৪",
          quesName: "চিন চকুত পৰে",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
    {
      id: 15,
      type: "file",
      gender: ["M", "F"],
      category: "my-skin",
      quesKey: "skinIssueRashBruisingImage",
      showIf: {
        skinIssueRashBruisingVisibility: ["Yes"],
      },
      translation: {
        en: {
          quesNo: "15",
          quesName: "Upload image",
          options: [],
        },
        bn: {
          quesNo: "১৫",
          quesName: "ছবি আপলোড",
          options: [],
        },
        as: {
          quesNo: "১৫",
          quesName: "ছবি আপলোড কৰক",
          options: [],
        },
      },
    },
  ],
};
