export const generalPractitioner = {
  // fever
  // fever: [
  //   {
  //     id: 1,
  //     category: "fever",
  //     type: "single-choice",
  //     gender: ["M", "F"],
  //     quesKey: "feverGrade",
  //     translation: {
  //       en: {
  //         quesNo: "1",
  //         quesName: "What is the grade of your fever ?",
  //         options: [
  //           { id: 1, label: "High (Above 103F)", value: "High (Above 103F)" },
  //           {
  //             id: 2,
  //             label: "Mild (Between 99 to 102F)",
  //             value: "Mild (Between 99 to 102F)",
  //           },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "১",
  //         quesName: "তোমার জ্বরের মাত্রা কত?",
  //         options: [
  //           { id: 1, label: "উচ্চ (১০৩°F-এর উপরে)", value: "High (Above 103F)" },
  //           {
  //             id: 2,
  //             label: "নিম্ন (৯৯ থেকে ১০২°F-এর মধ্যে)",
  //             value: "Mild (Between 99 to 102F)",
  //           },
  //         ],
  //       },
  //       as: {
  //         quesNo: "১",
  //         quesName: "তোমাৰ জ্বৰ কিমান ডাঙৰ?",
  //         options: [
  //           { id: 1, label: "উচ্চ (১০৩°F ৰ ওপৰত)", value: "High (Above 103F)" },
  //           {
  //             id: 2,
  //             label: "নিম্ন (৯৯°F ৰ পৰা ১০২°Fলৈকে)",
  //             value: "Mild (Between 99 to 102F)",
  //           },
  //         ],
  //       },
  //     },
  //   },
  //   {
  //     id: 2,
  //     category: "fever",
  //     type: "multi-choice",
  //     gender: ["M", "F"],
  //     quesKey: "feverTiming",
  //     translation: {
  //       en: {
  //         quesNo: "2",
  //         quesName: "What is the timing of your fever ?",
  //         options: [
  //           { id: 1, label: "Whole day", value: "Whole day" },
  //           { id: 2, label: "Morning", value: "Morning" },
  //           { id: 3, label: "Afternoon", value: "Afternoon" },
  //           { id: 4, label: "Night", value: "Night" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "২",
  //         quesName: "তোমার জ্বরের সময় কখন?",
  //         options: [
  //           { id: 1, label: "সারা দিন", value: "Whole day" },
  //           { id: 2, label: "সকাল", value: "Morning" },
  //           { id: 3, label: "দুপুরের পর", value: "Afternoon" },
  //           { id: 4, label: "রাত", value: "Night" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "২",
  //         quesName: "তোমাৰ জ্বৰ কেতিয়া হয়?",
  //         options: [
  //           { id: 1, label: "সম্পূৰ্ণ দিন", value: "Whole day" },
  //           { id: 2, label: "পুৱা", value: "Morning" },
  //           { id: 3, label: "দুপৰীয়া", value: "Afternoon" },
  //           { id: 4, label: "ৰাতি", value: "Night" },
  //         ],
  //       },
  //     },
  //   },
  //   {
  //     id: 3,
  //     category: "fever",
  //     type: "single-choice",
  //     gender: ["M", "F"],
  //     quesKey: "feverMeasured",
  //     translation: {
  //       en: {
  //         quesNo: "3",
  //         quesName: "Did you measure the temperature?",
  //         options: [
  //           { id: 1, label: "Yes", value: "Yes" },
  //           { id: 2, label: "No", value: "No" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "৩",
  //         quesName: "আপনি কি তাপমাত্রা পরিমাপ করেছেন?",
  //         options: [
  //           { id: 1, label: "হ্যাঁ", value: "Yes" },
  //           { id: 2, label: "না", value: "No" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "৩",
  //         quesName: "আপুনি কি তাপমাত্রা পৰিমাপ কৰিছে?",
  //         options: [
  //           { id: 1, label: "হয়", value: "Yes" },
  //           { id: 2, label: "নহয়", value: "No" },
  //         ],
  //       },
  //     },
  //   },
  //   {
  //     id: 4,
  //     category: "fever",
  //     type: "number",
  //     gender: ["M", "F"],
  //     quesKey: "feverTemperatureMeasure",
  //     showIf: { feverMeasured: ["Yes"] },
  //     translation: {
  //       en: {
  //         quesNo: "4",
  //         quesName: "What is the temperature measure ?",
  //       },
  //       bn: {
  //         quesNo: "৪",
  //         quesName: "তাপমাত্রা কত?",
  //       },
  //       as: {
  //         quesNo: "৪",
  //         quesName: "তাপমাত্ৰা কিমান?",
  //       },
  //     },
  //   },
  //   {
  //     id: 5,
  //     category: "fever",
  //     type: "number",
  //     gender: ["M", "F"],
  //     isDuration: true,
  //     quesKey: "feverDuration",
  //     translation: {
  //       en: {
  //         quesNo: "5",
  //         quesName: "How long are you having this fever(in days) ?",
  //       },
  //       bn: {
  //         quesNo: "৫",
  //         quesName: "তোমার জ্বর হচ্ছে কত দিন ধরে (দিনের হিসাবে)?",
  //       },
  //       as: {
  //         quesNo: "৫",
  //         quesName: "তুমি কিমান দিন ধৰি এই জ্বৰত ভুগি আছা? (দিনৰ হিচাপে)",
  //       },
  //     },
  //   },
  // ],

  fever: [
    {
      id: 1,
      category: "fever",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "feverGrade",
      translation: {
        en: {
          quesNo: "1",
          quesName: "Fever grade",
          options: [
            { id: 1, label: "High (Above 103°F)", value: "High (Above 103°F)" },
            { id: 2, label: "Mild ( 99 - 102°F)", value: "Mild ( 99 - 102°F)" },
          ],
        },
        bn: {
          quesNo: "১",
          quesName: "জ্বরের মাত্রা",
          options: [
            { id: 1, label: "উচ্চ (১০৩°F-এর উপরে)", value: "High (Above 103°F)" },
            { id: 2, label: "নিম্ন (৯৯ থেকে ১০২°F-এর মধ্যে)", value: "Mild ( 99 - 102°F)" },
          ],
        },
        as: {
          quesNo: "১",
          quesName: "জ্বৰ কিমান",
          options: [
            { id: 1, label: "উচ্চ (১০৩°F ৰ ওপৰত)", value: "High (Above 103F)" },
            { id: 2, label: "নিম্ন (৯৯°F ৰ পৰা ১০২°Fলৈকে)", value: "Mild ( 99 - 102°F)" },
          ],
        },
      },
    },
    {
      id: 2,
      category: "fever",
      type: "multi-choice",
      gender: ["M", "F"],
      quesKey: "feverTiming",
      translation: {
        en: {
          quesNo: "2",
          quesName: "Fever timing",
          options: [
            { id: 1, label: "Whole day", value: "Whole day" },
            { id: 2, label: "Morning", value: "Morning" },
            { id: 3, label: "Afternoon", value: "Afternoon" },
            { id: 4, label: "Night", value: "Night" },
          ],
        },
        bn: {
          quesNo: "২",
          quesName: "জ্বরের সময়",
          options: [
            { id: 1, label: "সারা দিন", value: "Whole day" },
            { id: 2, label: "সকাল", value: "Morning" },
            { id: 3, label: "দুপুরের পর", value: "Afternoon" },
            { id: 4, label: "রাত", value: "Night" },
          ],
        },
        as: {
          quesNo: "২",
          quesName: "জ্বৰ কেতিয়া",
          options: [
            { id: 1, label: "সম্পূৰ্ণ দিন", value: "Whole day" },
            { id: 2, label: "পুৱা", value: "Morning" },
            { id: 3, label: "দুপৰীয়া", value: "Afternoon" },
            { id: 4, label: "ৰাতি", value: "Night" },
          ],
        },
      },
    },
    {
      id: 3,
      category: "fever",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "feverMeasured",
      translation: {
        en: {
          quesNo: "3",
          quesName: "Measured temperature",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "৩",
          quesName: "তাপমাত্রা পরিমাপ",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "৩",
          quesName: "তাপমাত্রা পৰিমাপ",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
    {
      id: 4,
      category: "fever",
      type: "number",
      gender: ["M", "F"],
      quesKey: "feverTemperatureMeasure",
      showIf: { feverMeasured: ["Yes"] },
      translation: {
        en: {
          quesNo: "4",
          quesName: "Temperature value",
        },
        bn: {
          quesNo: "৪",
          quesName: "তাপমাত্রা কত",
        },
        as: {
          quesNo: "৪",
          quesName: "তাপমাত্ৰা কিমান",
        },
      },
    },
    {
      id: 5,
      category: "fever",
      type: "number",
      gender: ["M", "F"],
      isDuration: true,
      quesKey: "feverDuration",
      translation: {
        en: {
          quesNo: "5",
          quesName: "Fever duration (days)",
        },
        bn: {
          quesNo: "৫",
          quesName: "জ্বর কতদিন",
        },
        as: {
          quesNo: "৫",
          quesName: "জ্বৰ কিমান দিন",
        },
      },
    },
  ],

  // cough
  // cough: [
  //   {
  //     id: 6,
  //     category: "cough",
  //     type: "single-choice",
  //     gender: ["M", "F"],
  //     quesKey: "coughType",
  //     translation: {
  //       en: {
  //         quesNo: "6",
  //         quesName: "What is the type of your cough ?",
  //         options: [
  //           { id: 1, label: "Dry Cough", value: "Dry Cough" },
  //           { id: 2, label: "Wet Cough", value: "Wet Cough" },
  //           { id: 3, label: "Night Cough", value: "Night Cough" },
  //           { id: 4, label: "Others", value: "Others" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "৬",
  //         quesName: "আপনার কাশির ধরণ কী?",
  //         options: [
  //           { id: 1, label: "শুষ্ক কাশি", value: "Dry Cough" },
  //           { id: 2, label: "ভেজা কাশি", value: "Wet Cough" },
  //           { id: 3, label: "রাতের কাশি", value: "Night Cough" },
  //           { id: 4, label: "অন্যান্য", value: "Others" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "৬",
  //         quesName: "আপোনাৰ কাশিৰ প্ৰকাৰ কি?",
  //         options: [
  //           { id: 1, label: "শুকান কাশি", value: "Dry Cough" },
  //           { id: 2, label: "ভিজা কাশি", value: "Wet Cough" },
  //           { id: 3, label: "ৰাতিৰ কাশি", value: "Night Cough" },
  //           { id: 4, label: "আন আন", value: "Others" },
  //         ],
  //       },
  //     },
  //   },
  //   {
  //     id: 7,
  //     category: "cough",
  //     type: "multi-choice",
  //     gender: ["M", "F"],
  //     quesKey: "coughTiming",
  //     translation: {
  //       en: {
  //         quesNo: "7",
  //         quesName: "What is the timing of your cough ?",
  //         options: [
  //           { id: 1, label: "Whole day", value: "Whole day" },
  //           { id: 2, label: "Morning", value: "Morning" },
  //           { id: 3, label: "Afternoon", value: "Afternoon" },
  //           { id: 4, label: "Night", value: "Night" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "৭",
  //         quesName: "আপনার কাশি কখন হয়?",
  //         options: [
  //           { id: 1, label: "সারা দিন", value: "Whole day" },
  //           { id: 2, label: "সকাল", value: "Morning" },
  //           { id: 3, label: "বিকাল", value: "Afternoon" },
  //           { id: 4, label: "রাত", value: "Night" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "৭",
  //         quesName: "আপোনাৰ কাশি কেতিয়া হয়?",
  //         options: [
  //           { id: 1, label: "সারাদিন", value: "Whole day" },
  //           { id: 2, label: "পুৱা", value: "Morning" },
  //           { id: 3, label: "অপৰাহ্ন", value: "Afternoon" },
  //           { id: 4, label: "ৰাতি", value: "Night" },
  //         ],
  //       },
  //     },
  //   },
  //   {
  //     id: 8,
  //     category: "cough",
  //     type: "number", // Corrected from single-choice as it implies a number input
  //     gender: ["M", "F"],
  //     quesKey: "coughDuration",
  //     isDuration: true,

  //     translation: {
  //       en: {
  //         quesNo: "8",
  //         quesName: "How long are you having cough?(in days)",
  //       },
  //       bn: {
  //         quesNo: "৮",
  //         quesName: "আপনি কতদিন ধরে কাশছেন? (দিনে)",
  //       },
  //       as: {
  //         quesNo: "৮",
  //         quesName: "আপুনি কিমান দিন ধৰি কাশি পাইছে? (দিনত)",
  //       },
  //     },
  //   },
  // ],

  cough: [
    {
      id: 6,
      category: "cough",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "coughType",
      translation: {
        en: {
          quesNo: "6",
          quesName: "Cough type",
          options: [
            { id: 1, label: "Dry Cough", value: "Dry Cough" },
            { id: 2, label: "Wet Cough", value: "Wet Cough" },
            { id: 3, label: "Night Time", value: "Night Time" },
            { id: 4, label: "Others", value: "Others" },
          ],
        },
        bn: {
          quesNo: "৬",
          quesName: "কাশির ধরন",
          options: [
            { id: 1, label: "শুষ্ক কাশি", value: "Dry Cough" },
            { id: 2, label: "ভেজা কাশি", value: "Wet Cough" },
            { id: 3, label: "রাতের কাশি", value: "Night Cough" },
            { id: 4, label: "অন্যান্য", value: "Others" },
          ],
        },
        as: {
          quesNo: "৬",
          quesName: "কাশিৰ প্ৰকাৰ",
          options: [
            { id: 1, label: "শুকান কাশি", value: "Dry Cough" },
            { id: 2, label: "ভিজা কাশি", value: "Wet Cough" },
            { id: 3, label: "ৰাতিৰ কাশি", value: "Night Cough" },
            { id: 4, label: "আন আন", value: "Others" },
          ],
        },
      },
    },
    {
      id: 7,
      category: "cough",
      type: "multi-choice",
      gender: ["M", "F"],
      quesKey: "coughTiming",
      translation: {
        en: {
          quesNo: "7",
          quesName: "Cough timing",
          options: [
            { id: 1, label: "Whole day", value: "Whole day" },
            { id: 2, label: "Morning", value: "Morning" },
            { id: 3, label: "Afternoon", value: "Afternoon" },
            { id: 4, label: "Night", value: "Night" },
          ],
        },
        bn: {
          quesNo: "৭",
          quesName: "কাশির সময়",
          options: [
            { id: 1, label: "সারা দিন", value: "Whole day" },
            { id: 2, label: "সকাল", value: "Morning" },
            { id: 3, label: "বিকাল", value: "Afternoon" },
            { id: 4, label: "রাত", value: "Night" },
          ],
        },
        as: {
          quesNo: "৭",
          quesName: "কাশি কেতিয়া",
          options: [
            { id: 1, label: "সারাদিন", value: "Whole day" },
            { id: 2, label: "পুৱা", value: "Morning" },
            { id: 3, label: "অপৰাহ্ন", value: "Afternoon" },
            { id: 4, label: "ৰাতি", value: "Night" },
          ],
        },
      },
    },
    {
      id: 8,
      category: "cough",
      type: "number",
      gender: ["M", "F"],
      quesKey: "coughDuration",
      isDuration: true,
      translation: {
        en: {
          quesNo: "8",
          quesName: "Cough duration (days)",
        },
        bn: {
          quesNo: "৮",
          quesName: "কতদিন ধরে কাশি",
        },
        as: {
          quesNo: "৮",
          quesName: "কিমান দিন কাশি",
        },
      },
    },
  ],

  // 	 headache
  // headache: [
  //   {
  //     id: 9,
  //     category: "headache",
  //     type: "multi-choice",
  //     gender: ["M", "F"],
  //     quesKey: "headachePosition",
  //     translation: {
  //       en: {
  //         quesNo: "9",
  //         quesName: "Where is your headache located?",
  //         options: [
  //           { id: 1, label: "Full head", value: "Full head" },
  //           { id: 2, label: "Forehead", value: "Forehead" },
  //           { id: 3, label: "Back Head", value: "Back Head" },
  //           { id: 4, label: "Left Half", value: "Left Half" },
  //           { id: 5, label: "Right Half", value: "Right Half" },
  //           { id: 6, label: "Don't know", value: "Don't know" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "৯",
  //         quesName: "আপনার মাথাব্যথা কোথায় হচ্ছে?",
  //         options: [
  //           { id: 1, label: "সম্পূর্ণ মাথা", value: "Full head" },
  //           { id: 2, label: "কপাল", value: "Forehead" },
  //           { id: 3, label: "মাথার পিছনে", value: "Back Head" },
  //           { id: 4, label: "বাম পাশে", value: "Left Half" },
  //           { id: 5, label: "ডান পাশে", value: "Right Half" },
  //           { id: 6, label: "জানি না", value: "Don't know" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "৯",
  //         quesName: "আপোনাৰ মুৰ বেয়া ক'ত হৈছে?",
  //         options: [
  //           { id: 1, label: "সমগ্ৰ মুৰ", value: "Full head" },
  //           { id: 2, label: "কপাল", value: "Forehead" },
  //           { id: 3, label: "মুৰৰ পিছফালে", value: "Back Head" },
  //           { id: 4, label: "বাওঁফালে", value: "Left Half" },
  //           { id: 5, label: "সোঁফালে", value: "Right Half" },
  //           { id: 6, label: "জানো নহয়", value: "Don't know" },
  //         ],
  //       },
  //     },
  //   },
  //   {
  //     id: 10,
  //     category: "headache",
  //     type: "multi-choice",
  //     gender: ["M", "F"],
  //     quesKey: "headacheTiming",
  //     translation: {
  //       en: {
  //         quesNo: "10",
  //         quesName: "When does the headache occur?",
  //         options: [
  //           { id: 1, label: "Whole day", value: "Whole day" },
  //           { id: 2, label: "Morning", value: "Morning" },
  //           { id: 3, label: "Afternoon", value: "Afternoon" },
  //           { id: 4, label: "Night", value: "Night" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "১০",
  //         quesName: "মাথাব্যথা কখন হয়?",
  //         options: [
  //           { id: 1, label: "সারা দিন", value: "Whole day" },
  //           { id: 2, label: "সকালে", value: "Morning" },
  //           { id: 3, label: "বিকালে", value: "Afternoon" },
  //           { id: 4, label: "রাতে", value: "Night" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "১০",
  //         quesName: "মুৰবেয়া কেতিয়া হয়?",
  //         options: [
  //           { id: 1, label: "সদায়", value: "Whole day" },
  //           { id: 2, label: "পুৱাতে", value: "Morning" },
  //           { id: 3, label: "অপৰাহ্নত", value: "Afternoon" },
  //           { id: 4, label: "ৰাতিপুৱা", value: "Night" },
  //         ],
  //       },
  //     },
  //   },
  //   {
  //     id: 11,
  //     category: "headache",
  //     type: "single-choice",
  //     gender: ["M", "F"],
  //     quesKey: "headacheFrequency",
  //     translation: {
  //       en: {
  //         quesNo: "11",
  //         quesName: "How often does the headache occur?",
  //         options: [
  //           { id: 1, label: "Very Often", value: "Very Often" },
  //           { id: 2, label: "Sudden", value: "Sudden" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "১১",
  //         quesName: "মাথাব্যথা কত ঘন ঘন হয়?",
  //         options: [
  //           { id: 1, label: "প্রায়ই", value: "Very Often" },
  //           { id: 2, label: "হঠাৎ", value: "Sudden" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "১১",
  //         quesName: "মুৰবেয়া কিমান বেছি বাৰে হয়?",
  //         options: [
  //           { id: 1, label: "সঘনাই", value: "Very Often" },
  //           { id: 2, label: "হঠাতে", value: "Sudden" },
  //         ],
  //       },
  //     },
  //   },
  //   {
  //     id: 12,
  //     category: "headache",
  //     type: "number",
  //     gender: ["M", "F"],
  //     quesKey: "headacheDuration",
  //     isDuration: true,

  //     translation: {
  //       en: {
  //         quesNo: "12",
  //         quesName: "How long are you having headaches (in Days )?",
  //       },
  //       bn: {
  //         quesNo: "১২",
  //         quesName: "আপনার কত দিন ধরে মাথাব্যথা হচ্ছে?",
  //       },
  //       as: {
  //         quesNo: "১২",
  //         quesName: "আপোনাৰ কিমান দিন ধৰি মুৰ বেয়া হৈছে?",
  //       },
  //     },
  //   },
  // ],
  headache: [
    {
      id: 9,
      category: "headache",
      type: "multi-choice",
      gender: ["M", "F"],
      quesKey: "headachePosition",
      translation: {
        en: {
          quesNo: "9",
          quesName: "Location",
          options: [
            { id: 1, label: "Full head", value: "Full head" },
            { id: 2, label: "Forehead", value: "Forehead" },
            { id: 3, label: "Back Head", value: "Back Head" },
            { id: 4, label: "Left Half", value: "Left Half" },
            { id: 5, label: "Right Half", value: "Right Half" },
            { id: 6, label: "Don't know", value: "Don't know" },
          ],
        },
        bn: {
          quesNo: "৯",
          quesName: "কোথায়",
          options: [
            { id: 1, label: "সম্পূর্ণ মাথা", value: "Full head" },
            { id: 2, label: "কপাল", value: "Forehead" },
            { id: 3, label: "মাথার পিছনে", value: "Back Head" },
            { id: 4, label: "বাম পাশে", value: "Left Half" },
            { id: 5, label: "ডান পাশে", value: "Right Half" },
            { id: 6, label: "জানি না", value: "Don't know" },
          ],
        },
        as: {
          quesNo: "৯",
          quesName: "ক'ত",
          options: [
            { id: 1, label: "সমগ্ৰ মুৰ", value: "Full head" },
            { id: 2, label: "কপাল", value: "Forehead" },
            { id: 3, label: "মুৰৰ পিছফালে", value: "Back Head" },
            { id: 4, label: "বাওঁফালে", value: "Left Half" },
            { id: 5, label: "সোঁফালে", value: "Right Half" },
            { id: 6, label: "জানো নহয়", value: "Don't know" },
          ],
        },
      },
    },
    {
      id: 10,
      category: "headache",
      type: "multi-choice",
      gender: ["M", "F"],
      quesKey: "headacheTiming",
      translation: {
        en: {
          quesNo: "10",
          quesName: "Timing",
          options: [
            { id: 1, label: "Whole day", value: "Whole day" },
            { id: 2, label: "Morning", value: "Morning" },
            { id: 3, label: "Afternoon", value: "Afternoon" },
            { id: 4, label: "Night", value: "Night" },
          ],
        },
        bn: {
          quesNo: "১০",
          quesName: "কখন",
          options: [
            { id: 1, label: "সারা দিন", value: "Whole day" },
            { id: 2, label: "সকালে", value: "Morning" },
            { id: 3, label: "বিকালে", value: "Afternoon" },
            { id: 4, label: "রাতে", value: "Night" },
          ],
        },
        as: {
          quesNo: "১০",
          quesName: "কেতিয়া",
          options: [
            { id: 1, label: "সদায়", value: "Whole day" },
            { id: 2, label: "পুৱাতে", value: "Morning" },
            { id: 3, label: "অপৰাহ্নত", value: "Afternoon" },
            { id: 4, label: "ৰাতিপুৱা", value: "Night" },
          ],
        },
      },
    },
    {
      id: 11,
      category: "headache",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "headacheFrequency",
      translation: {
        en: {
          quesNo: "11",
          quesName: "Frequency",
          options: [
            { id: 1, label: "Very Often", value: "Very Often" },
            { id: 2, label: "Sudden", value: "Sudden" },
          ],
        },
        bn: {
          quesNo: "১১",
          quesName: "কতবার",
          options: [
            { id: 1, label: "প্রায়ই", value: "Very Often" },
            { id: 2, label: "হঠাৎ", value: "Sudden" },
          ],
        },
        as: {
          quesNo: "১১",
          quesName: "কিমানবাৰ",
          options: [
            { id: 1, label: "সঘনাই", value: "Very Often" },
            { id: 2, label: "হঠাতে", value: "Sudden" },
          ],
        },
      },
    },
    {
      id: 12,
      category: "headache",
      type: "number",
      gender: ["M", "F"],
      quesKey: "headacheDuration",
      isDuration: true,
      translation: {
        en: {
          quesNo: "12",
          quesName: "Duration (days)",
        },
        bn: {
          quesNo: "১২",
          quesName: "কতদিন",
        },
        as: {
          quesNo: "১২",
          quesName: "কিমান দিন",
        },
      },
    },
  ],

  // 	 vomiting
  // vomiting: [
  //   {
  //     id: 13,
  //     category: "vomiting",
  //     type: "single-choice",
  //     gender: ["M", "F"],
  //     quesKey: "vomitingDuration",

  //     translation: {
  //       en: {
  //         quesNo: "13",
  //         quesName: "What is the duration of your vomiting?",
  //         options: [
  //           {
  //             id: 1,
  //             label: "Less than 1 - 2 Days",
  //             value: "Less than 1 - 2 Days",
  //           },
  //           { id: 2, label: "More than 2 days", value: "More than 2 days" },
  //           { id: 3, label: "Several weeks", value: "Several weeks" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "১৩",
  //         quesName: "আপনার বমির সময়কাল কত?",
  //         options: [
  //           { id: 1, label: "১-২ দিনের কম", value: "Less than 1 - 2 Days" },
  //           { id: 2, label: "২ দিনের বেশি", value: "More than 2 days" },
  //           { id: 3, label: "অনেক সপ্তাহ", value: "Several weeks" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "১৩",
  //         quesName: "আপোনাৰ বমিৰ সময়সীমা কিমান?",
  //         options: [
  //           { id: 1, label: "১-২ দিনতকৈ কম", value: "Less than 1 - 2 Days" },
  //           { id: 2, label: "২ দিনতকৈ বেছি", value: "More than 2 days" },
  //           { id: 3, label: "বহু সপ্তাহ", value: "Several weeks" },
  //         ],
  //       },
  //     },
  //   },
  //   {
  //     id: 14,
  //     category: "vomiting",
  //     type: "single-choice",
  //     gender: ["M", "F"],
  //     quesKey: "vomitingColor",
  //     translation: {
  //       en: {
  //         quesNo: "14",
  //         quesName: "What is the color of your vomit?",
  //         options: [
  //           { id: 1, label: "Clear/White", value: "Clear/White" },
  //           { id: 2, label: "Green/Yellow", value: "Green/Yellow" },
  //           { id: 3, label: "Brown/Black", value: "Brown/Black" },
  //           { id: 4, label: "Red/Pink", value: "Red/Pink" },
  //           { id: 5, label: "Others", value: "Others" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "১৪",
  //         quesName: "আপনার বমির রং কী?",
  //         options: [
  //           { id: 1, label: "স্বচ্ছ/সাদা", value: "Clear/White" },
  //           { id: 2, label: "সবুজ/হলুদ", value: "Green/Yellow" },
  //           { id: 3, label: "বাদামী/কালো", value: "Brown/Black" },
  //           { id: 4, label: "লাল/গোলাপী", value: "Red/Pink" },
  //           { id: 5, label: "অন্যান্য", value: "Others" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "১৪",
  //         quesName: "আপোনাৰ বমিৰ ৰং কি?",
  //         options: [
  //           { id: 1, label: "পৰিষ্কাৰ/বগা", value: "Clear/White" },
  //           { id: 2, label: "সেউজীয়া/হালধীয়া", value: "Green/Yellow" },
  //           { id: 3, label: "বউনা/ক’লা", value: "Brown/Black" },
  //           { id: 4, label: "ৰঙা/গুলাপী", value: "Red/Pink" },
  //           { id: 5, label: "আন আন", value: "Others" },
  //         ],
  //       },
  //     },
  //   },
  //   {
  //     id: 15,
  //     category: "vomiting",
  //     type: "multi-choice",
  //     gender: ["M", "F"],
  //     quesKey: "vomitingContent",
  //     translation: {
  //       en: {
  //         quesNo: "15",
  //         quesName: "What is the content of your vomit?",
  //         options: [
  //           { id: 1, label: "Undigested Food", value: "Undigested Food" },
  //           { id: 2, label: "Digested Food", value: "Digested Food" },
  //           { id: 3, label: "Blood", value: "Blood" },
  //           { id: 4, label: "Others", value: "Others" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "১৫",
  //         quesName: "আপনার বমিতে কী থাকে?",
  //         options: [
  //           { id: 1, label: "অপরিপাকিত খাদ্য", value: "Undigested Food" },
  //           { id: 2, label: "পরিপাকিত খাদ্য", value: "Digested Food" },
  //           { id: 3, label: "রক্ত", value: "Blood" },
  //           { id: 4, label: "অন্যান্য", value: "Others" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "১৫",
  //         quesName: "আপোনাৰ বমিত কি থাকে?",
  //         options: [
  //           { id: 1, label: "অপচোৱা খাদ্য", value: "Undigested Food" },
  //           { id: 2, label: "পচোৱা খাদ্য", value: "Digested Food" },
  //           { id: 3, label: "ৰক্ত", value: "Blood" },
  //           { id: 4, label: "আন আন", value: "Others" },
  //         ],
  //       },
  //     },
  //   },
  //   {
  //     id: 16,
  //     category: "vomiting",
  //     type: "single-choice",
  //     gender: ["M", "F"],
  //     quesKey: "vomitingOccurance",
  //     translation: {
  //       en: {
  //         quesNo: "16",
  //         quesName: "When does the vomiting occur?",
  //         options: [
  //           { id: 1, label: "Any time", value: "Any time" },
  //           { id: 2, label: "After Eating", value: "After Eating" },
  //           { id: 3, label: "Don't know", value: "Don't know" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "১৬",
  //         quesName: "বমি কখন হয়?",
  //         options: [
  //           { id: 1, label: "যেকোনো সময়", value: "Any time" },
  //           { id: 2, label: "খাওয়ার পর", value: "After Eating" },
  //           { id: 3, label: "জানি না", value: "Don't know" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "১৬",
  //         quesName: "বমি কেতিয়া হয়?",
  //         options: [
  //           { id: 1, label: "যিকোনো সময়", value: "Any time" },
  //           { id: 2, label: "ভোজনৰ পাছত", value: "After Eating" },
  //           { id: 3, label: "জানো নে", value: "Don't know" },
  //         ],
  //       },
  //     },
  //   },
  // ],
  vomiting: [
    {
      id: 13,
      category: "vomiting",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "vomitingDuration",
      translation: {
        en: {
          quesNo: "13",
          quesName: "Duration",
          options: [
            { id: 1, label: "Last 2 days", value: "Last 2 days" },
            { id: 2, label: "More than 2 days", value: "More than 2 days" },
            { id: 3, label: "Several weeks", value: "Several weeks" },
          ],
        },
        bn: {
          quesNo: "১৩",
          quesName: "সময়কাল",
          options: [
            { id: 1, label: "গত ২ দিন", value: "Last 2 days" },
            { id: 2, label: "২ দিনের বেশি", value: "More than 2 days" },
            { id: 3, label: "অনেক সপ্তাহ", value: "Several weeks" },
          ],
        },
        as: {
          quesNo: "১৩",
          quesName: "সময়কাল",
          options: [
            { id: 1, label: "শেষ ২ দিন", value: "Last 2 days" },
            { id: 2, label: "২ দিনতকৈ বেছি", value: "More than 2 days" },
            { id: 3, label: "বহু সপ্তাহ", value: "Several weeks" },
          ],
        },
      },
    },
    {
      id: 14,
      category: "vomiting",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "vomitingColor",
      translation: {
        en: {
          quesNo: "14",
          quesName: "Color",
          options: [
            { id: 1, label: "Clear/White", value: "Clear/White" },
            { id: 2, label: "Green/Yellow", value: "Green/Yellow" },
            { id: 3, label: "Brown/Black", value: "Brown/Black" },
            { id: 4, label: "Red/Pink", value: "Red/Pink" },
            { id: 5, label: "Others", value: "Others" },
          ],
        },
        bn: {
          quesNo: "১৪",
          quesName: "রং",
          options: [
            { id: 1, label: "স্বচ্ছ/সাদা", value: "Clear/White" },
            { id: 2, label: "সবুজ/হলুদ", value: "Green/Yellow" },
            { id: 3, label: "বাদামী/কালো", value: "Brown/Black" },
            { id: 4, label: "লাল/গোলাপী", value: "Red/Pink" },
            { id: 5, label: "অন্যান্য", value: "Others" },
          ],
        },
        as: {
          quesNo: "১৪",
          quesName: "ৰং",
          options: [
            { id: 1, label: "পৰিষ্কাৰ/বগা", value: "Clear/White" },
            { id: 2, label: "সেউজীয়া/হালধীয়া", value: "Green/Yellow" },
            { id: 3, label: "বউনা/ক’লা", value: "Brown/Black" },
            { id: 4, label: "ৰঙা/গুলাপী", value: "Red/Pink" },
            { id: 5, label: "আন আন", value: "Others" },
          ],
        },
      },
    },
    {
      id: 15,
      category: "vomiting",
      type: "multi-choice",
      gender: ["M", "F"],
      quesKey: "vomitingContent",
      translation: {
        en: {
          quesNo: "15",
          quesName: "Content",
          options: [
            { id: 1, label: "Undigested Food", value: "Undigested Food" },
            { id: 2, label: "Digested Food", value: "Digested Food" },
            { id: 3, label: "Blood", value: "Blood" },
            { id: 4, label: "Others", value: "Others" },
          ],
        },
        bn: {
          quesNo: "১৫",
          quesName: "কী থাকে",
          options: [
            { id: 1, label: "অপরিপাকিত খাদ্য", value: "Undigested Food" },
            { id: 2, label: "পরিপাকিত খাদ্য", value: "Digested Food" },
            { id: 3, label: "রক্ত", value: "Blood" },
            { id: 4, label: "অন্যান্য", value: "Others" },
          ],
        },
        as: {
          quesNo: "১৫",
          quesName: "কি থাকে",
          options: [
            { id: 1, label: "অপচোৱা খাদ্য", value: "Undigested Food" },
            { id: 2, label: "পচোৱা খাদ্য", value: "Digested Food" },
            { id: 3, label: "ৰক্ত", value: "Blood" },
            { id: 4, label: "আন আন", value: "Others" },
          ],
        },
      },
    },
    {
      id: 16,
      category: "vomiting",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "vomitingOccurance",
      translation: {
        en: {
          quesNo: "16",
          quesName: "Vomiting Timing",
          options: [
            { id: 1, label: "Any time", value: "Any time" },
            { id: 2, label: "After Eating", value: "After Eating" },
            { id: 3, label: "Don't know", value: "Don't know" },
          ],
        },
        bn: {
          quesNo: "১৬",
          quesName: " বমির সময়",
          options: [
            { id: 1, label: "যেকোনো সময়", value: "Any time" },
            { id: 2, label: "খাওয়ার পর", value: "After Eating" },
            { id: 3, label: "জানি না", value: "Don't know" },
          ],
        },
        as: {
          quesNo: "১৬",
          quesName: "বমি কৰাৰ সময়",
          options: [
            { id: 1, label: "যিকোনো সময়", value: "Any time" },
            { id: 2, label: "ভোজনৰ পাছত", value: "After Eating" },
            { id: 3, label: "জানো নে", value: "Don't know" },
          ],
        },
      },
    },
  ],

  // 	 hair loss
  // "hair-loss": [
  //   {
  //     id: 17,
  //     category: "hair-loss",
  //     type: "single-choice",
  //     gender: ["M", "F"],
  //     quesKey: "hairlossConfirmation",
  //     translation: {
  //       en: {
  //         quesNo: "17",
  //         quesName: "Do you have hair loss",
  //         options: [
  //           { id: 1, label: "Yes", value: "Yes" },
  //           { id: 2, label: "No", value: "No" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "১৭",
  //         quesName: "আপনার কি চুল পড়ছে?",
  //         options: [
  //           { id: 1, label: "হ্যাঁ", value: "Yes" },
  //           { id: 2, label: "না", value: "No" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "১৭",
  //         quesName: "আপোনাৰ চুলি পৰিছে নেকি?",
  //         options: [
  //           { id: 1, label: "হয়", value: "Yes" },
  //           { id: 2, label: "নহয়", value: "No" },
  //         ],
  //       },
  //     },
  //   },
  //   {
  //     id: 18,
  //     category: "hair-loss",
  //     type: "multi-choice",
  //     gender: ["M", "F"],
  //     quesKey: "hairlossScalploss",
  //     translation: {
  //       en: {
  //         quesNo: "18",
  //         quesName: "Do you have any scalp issues?",
  //         options: [
  //           { id: 1, label: "Dandruff", value: "Dandruff" },
  //           { id: 2, label: "Itching", value: "Itching" },
  //           { id: 3, label: "Redness", value: "Redness" },
  //           { id: 4, label: "Don't know", value: "Don't know" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "১৮",
  //         quesName: "আপনার কি কোনো স্ক্যাল্পের সমস্যা আছে?",
  //         options: [
  //           { id: 1, label: "খুশকি", value: "Dandruff" },
  //           { id: 2, label: "চুলকানি", value: "Itching" },
  //           { id: 3, label: "লালভাব", value: "Redness" },
  //           { id: 4, label: "জানি না", value: "Don't know" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "১৮",
  //         quesName: "আপোনাৰ মূৰৰ ছালত কিবা সমস্যা আছে নে?",
  //         options: [
  //           { id: 1, label: "চুলি চুলা", value: "Dandruff" },
  //           { id: 2, label: "খৰখৰনি", value: "Itching" },
  //           { id: 3, label: "ৰঙা হোৱা", value: "Redness" },
  //           { id: 4, label: "জানো নহয়", value: "Don't know" },
  //         ],
  //       },
  //     },
  //   },
  // ],
  "hair-loss": [
    {
      id: 17,
      category: "hair-loss",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "hairlossConfirmation",
      translation: {
        en: {
          quesNo: "17",
          quesName: "Hair loss",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "১৭",
          quesName: "চুল পড়ছে",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "১৭",
          quesName: "চুলি পৰিছে",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
    {
      id: 18,
      category: "hair-loss",
      type: "multi-choice",
      gender: ["M", "F"],
      quesKey: "hairlossScalploss",
      translation: {
        en: {
          quesNo: "18",
          quesName: "Scalp issues",
          options: [
            { id: 1, label: "Dandruff", value: "Dandruff" },
            { id: 2, label: "Itching", value: "Itching" },
            { id: 3, label: "Redness", value: "Redness" },
            { id: 4, label: "Don't know", value: "Don't know" },
          ],
        },
        bn: {
          quesNo: "১৮",
          quesName: "স্ক্যাল্প সমস্যা",
          options: [
            { id: 1, label: "খুশকি", value: "Dandruff" },
            { id: 2, label: "চুলকানি", value: "Itching" },
            { id: 3, label: "লালভাব", value: "Redness" },
            { id: 4, label: "জানি না", value: "Don't know" },
          ],
        },
        as: {
          quesNo: "১৮",
          quesName: "মূৰৰ ছাল সমস্যা",
          options: [
            { id: 1, label: "চুলি চুলা", value: "Dandruff" },
            { id: 2, label: "খৰখৰনি", value: "Itching" },
            { id: 3, label: "ৰঙা হোৱা", value: "Redness" },
            { id: 4, label: "জানো নহয়", value: "Don't know" },
          ],
        },
      },
    },
  ],

  // 	 bleeding
  // {
  //   id: 19,
  //   category: "bleeding",
  //   type: "single-choice",
  //   gender: ["M", "F"],
  //   quesKey: "bleedingVisible",
  //   translation: {
  //     en: {
  //       quesNo: "19",
  //       quesName: "Is the bleeding visible",
  //       options: [
  //         { id: 1, label: "Yes", value: "Yes" },
  //         { id: 2, label: "No", value: "No" },
  //       ],
  //     },
  //     bn: {
  //       quesNo: "১৯",
  //       quesName: "রক্তপাত কি দৃশ্যমান",
  //       options: [
  //         { id: 1, label: "হ্যাঁ", value: "Yes" },
  //         { id: 2, label: "না", value: "No" },
  //       ],
  //     },
  //     as: {
  //       quesNo: "১৯",
  //       quesName: "ৰক্তপাত কি দৃষ্টিগোচৰ?",
  //       options: [
  //         { id: 1, label: "হয়", value: "Yes" },
  //         { id: 2, label: "নহয়", value: "No" },
  //       ],
  //     },
  //   },
  // },
  // bleeding: [
  //   {
  //     id: 20,
  //     category: "bleeding",
  //     type: "file",
  //     quesKey: "bleedingLocation",
  //     gender: ["M", "F"],
  //     // showIf: {"bleeding-visible" : ["Yes"]},
  //     translation: {
  //       en: {
  //         quesNo: "20",
  //         quesName: "Please specify the location of bleeding (link to body pic if available)",
  //       },
  //       bn: {
  //         quesNo: "২০",
  //         quesName:
  //           "অনুগ্রহ করে রক্তপাতের স্থান উল্লেখ করুন (যদি শরীরের চিত্র থাকে, তাহলে লিঙ্ক দিন)",
  //       },
  //       as: {
  //         quesNo: "২০",
  //         quesName:
  //           "অনুগ্ৰহ কৰি ৰক্তপাতৰ স্থান উল্লেখ কৰক (যদি শৰীৰৰ ফটো উপলব্ধ থাকে তেন্তে লিংক দিয়ক)",
  //       },
  //     },
  //   },
  //   {
  //     id: 21,
  //     category: "bleeding",
  //     type: "single-choice",
  //     gender: ["M", "F"],
  //     quesKey: "bleedingBloodlossAmount",
  //     translation: {
  //       en: {
  //         quesNo: "21",
  //         quesName: "What is the amount of blood loss?",
  //         options: [
  //           { id: 1, label: "Heavy", value: "Heavy" },
  //           { id: 2, label: "Moderate", value: "Moderate" },
  //           { id: 3, label: "Spotting", value: "Spotting" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "২১",
  //         quesName: "রক্তপাতের পরিমাণ কত?",
  //         options: [
  //           { id: 1, label: "ভারী", value: "Heavy" },
  //           { id: 2, label: "মাঝারি", value: "Moderate" },
  //           { id: 3, label: "হালকা দাগ", value: "Spotting" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "২১",
  //         quesName: "ৰক্ত ক্ষয়ৰ পৰিমাণ কিমান?",
  //         options: [
  //           { id: 1, label: "বেছি", value: "Heavy" },
  //           { id: 2, label: "মধ্যম", value: "Moderate" },
  //           { id: 3, label: "চুটা-চুটা", value: "Spotting" },
  //         ],
  //       },
  //     },
  //   },
  //   {
  //     id: 22,
  //     category: "bleeding",
  //     type: "single-choice",
  //     gender: ["M", "F"],
  //     quesKey: "bleedingDifficultyToStop",
  //     translation: {
  //       en: {
  //         quesNo: "22",
  //         quesName: "Is the bleeding difficult to stop?",
  //         options: [
  //           { id: 1, label: "Yes", value: "Yes" },
  //           { id: 2, label: "No", value: "No" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "২২",
  //         quesName: "রক্তপাত বন্ধ করা কি কঠিন?",
  //         options: [
  //           { id: 1, label: "হ্যাঁ", value: "Yes" },
  //           { id: 2, label: "না", value: "No" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "২২",
  //         quesName: "ৰক্তপাত বন্ধ কৰা কঠিন নে?",
  //         options: [
  //           { id: 1, label: "হয়", value: "Yes" },
  //           { id: 2, label: "নহয়", value: "No" },
  //         ],
  //       },
  //     },
  //   },
  //   {
  //     id: 23,
  //     category: "bleeding",
  //     type: "number",
  //     gender: ["M", "F"],
  //     quesKey: "bleedingDuration",
  //     translation: {
  //       en: {
  //         quesNo: "23",
  //         quesName: "For how long have you been bleeding? (Approximate time)",
  //       },
  //       bn: {
  //         quesNo: "২৩",
  //         quesName: "আপনি কতক্ষণ ধরে রক্তপাত করছেন? (আনুমানিক সময়)",
  //       },
  //       as: {
  //         quesNo: "২৩",
  //         quesName: "আপুনি কিমান সময় ধৰি ৰক্তপাত কৰি আছে? (আনুমানিক সময়)",
  //       },
  //     },
  //   },
  // ],

  // 	 injury
  bleeding: [
    {
      id: 20,
      category: "bleeding",
      type: "file",
      quesKey: "bleedingLocation",
      gender: ["M", "F"],
      translation: {
        en: {
          quesNo: "20",
          quesName: "Bleeding location",
        },
        bn: {
          quesNo: "২০",
          quesName: "রক্তপাত কোথায়",
        },
        as: {
          quesNo: "২০",
          quesName: "ৰক্তপাত ক'ত",
        },
      },
    },
    {
      id: 21,
      category: "bleeding",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "bleedingBloodlossAmount",
      translation: {
        en: {
          quesNo: "21",
          quesName: "Blood loss amount",
          options: [
            { id: 1, label: "Heavy", value: "Heavy" },
            { id: 2, label: "Moderate", value: "Moderate" },
            { id: 3, label: "Spotting", value: "Spotting" },
          ],
        },
        bn: {
          quesNo: "২১",
          quesName: "রক্তপাত কত",
          options: [
            { id: 1, label: "ভারী", value: "Heavy" },
            { id: 2, label: "মাঝারি", value: "Moderate" },
            { id: 3, label: "হালকা দাগ", value: "Spotting" },
          ],
        },
        as: {
          quesNo: "২১",
          quesName: "ৰক্ত ক্ষয় কিমান",
          options: [
            { id: 1, label: "বেছি", value: "Heavy" },
            { id: 2, label: "মধ্যম", value: "Moderate" },
            { id: 3, label: "চুটা-চুটা", value: "Spotting" },
          ],
        },
      },
    },
    {
      id: 22,
      category: "bleeding",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "bleedingDifficultyToStop",
      translation: {
        en: {
          quesNo: "22",
          quesName: "Difficult to stop",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "২২",
          quesName: "বন্ধ করা কঠিন",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "২২",
          quesName: "বন্ধ কৰা কঠিন",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
    {
      id: 23,
      category: "bleeding",
      type: "number",
      gender: ["M", "F"],
      quesKey: "bleedingDuration",
      translation: {
        en: {
          quesNo: "23",
          quesName: "Bleeding duration in mins",
        },
        bn: {
          quesNo: "২৩",
          quesName: "রক্তপাত কতক্ষণ (মিনিটত)",
        },
        as: {
          quesNo: "২৩",
          quesName: "ৰক্তপাত কিমান সময় (মিনিটে)",
        },
      },
    },
  ],

  // injury: [
  //   {
  //     id: 24,
  //     category: "injury",
  //     type: "date",
  //     gender: ["M", "F"],
  //     quesKey: "injuryDate",
  //     translation: {
  //       en: {
  //         quesNo: "24",
  //         quesName: "When did the injury occur? (Date/Time)",
  //       },
  //       bn: {
  //         quesNo: "২৪",
  //         quesName: "চোট কখন লেগেছে? (তারিখ/সময়)",
  //       },
  //       as: {
  //         quesNo: "২৪",
  //         quesName: "আঘাত কেতিয়া হৈছিল? (তাৰিখ/সময়)",
  //       },
  //     },
  //   },
  //   {
  //     id: 25,
  //     category: "injury",
  //     type: "single-choice",
  //     gender: ["M", "F"],
  //     quesKey: "injuryPain",
  //     translation: {
  //       en: {
  //         quesNo: "25",
  //         quesName: "Is there any pain?",
  //         options: [
  //           { id: 1, label: "Yes", value: "Yes" },
  //           { id: 2, label: "No", value: "No" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "২৫",
  //         quesName: "চোটে কি ব্যথা হচ্ছে?",
  //         options: [
  //           { id: 1, label: "হ্যাঁ", value: "Yes" },
  //           { id: 2, label: "না", value: "No" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "২৫",
  //         quesName: "আঘাতত বিষ হৈছে নে?",
  //         options: [
  //           { id: 1, label: "হয়", value: "Yes" },
  //           { id: 2, label: "নহয়", value: "No" },
  //         ],
  //       },
  //     },
  //   },
  //   {
  //     id: 26,
  //     category: "injury",
  //     type: "slider",
  //     quesKey: "injuryPainIntensity",
  //     gender: ["M", "F"],
  //     showIf: { injuryPain: ["Yes"] }, // Corrected dependency to new ID 25
  //     translation: {
  //       en: {
  //         quesNo: "26",
  //         quesName: "What is the intensity of pain?",
  //         options: [
  //           { id: 1, label: "Low", value: "Low" },
  //           { id: 2, label: "Medium", value: "Medium" },
  //           { id: 3, label: "High", value: "High" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "২৬",
  //         quesName: "ব্যথার তীব্রতা কত?",
  //         options: [
  //           { id: 1, label: "কম", value: "Low" },
  //           { id: 2, label: "মাঝারি", value: "Medium" },
  //           { id: 3, label: "বেশি", value: "High" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "২৬",
  //         quesName: "বিষৰ তীব্ৰতা কিমান?",
  //         options: [
  //           { id: 1, label: "কম", value: "Low" },
  //           { id: 2, label: "মধ্যম", value: "Medium" },
  //           { id: 3, label: "বেছি", value: "High" },
  //         ],
  //       },
  //     },
  //   },
  //   {
  //     id: 27,
  //     category: "injury",
  //     type: "single-choice",
  //     gender: ["M", "F"],
  //     quesKey: "injurySwelling",
  //     translation: {
  //       en: {
  //         quesNo: "27",
  //         quesName: "Is there any swelling?",
  //         options: [
  //           { id: 1, label: "Yes", value: "Yes" },
  //           { id: 2, label: "No", value: "No" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "২৭",
  //         quesName: "চোটে কি ফোলা আছে?",
  //         options: [
  //           { id: 1, label: "হ্যাঁ", value: "Yes" },
  //           { id: 2, label: "না", value: "No" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "২৭",
  //         quesName: "আঘাতত ফুলি উঠিছে নে?",
  //         options: [
  //           { id: 1, label: "হয়", value: "Yes" },
  //           { id: 2, label: "নহয়", value: "No" },
  //         ],
  //       },
  //     },
  //   },
  //   {
  //     id: 28,
  //     category: "injury",
  //     type: "single-choice",
  //     gender: ["M", "F"],
  //     quesKey: "injuryBleeding",
  //     translation: {
  //       en: {
  //         quesNo: "28",
  //         quesName: "Is there any bleeding?",
  //         options: [
  //           { id: 1, label: "Yes", value: "Yes" },
  //           { id: 2, label: "No", value: "No" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "২৮",
  //         quesName: "চোটে কি রক্তপাত হচ্ছে?",
  //         options: [
  //           { id: 1, label: "হ্যাঁ", value: "Yes" },
  //           { id: 2, label: "না", value: "No" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "২৮",
  //         quesName: "আঘাতত ৰক্তপাত হৈছে নে?",
  //         options: [
  //           { id: 1, label: "হয়", value: "Yes" },
  //           { id: 2, label: "নহয়", value: "No" },
  //         ],
  //       },
  //     },
  //   },
  //   {
  //     id: 29,
  //     category: "injury",
  //     type: "single-choice",
  //     gender: ["M", "F"],
  //     quesKey: "injuryMobilityIssues",
  //     translation: {
  //       en: {
  //         quesNo: "29",
  //         quesName: "Are you facing any mobility issues?",
  //         options: [
  //           { id: 1, label: "Yes", value: "Yes" },
  //           { id: 2, label: "No", value: "No" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "২৯",
  //         quesName: "আপনার চলাফেরায় কোনো সমস্যা হচ্ছে কি?",
  //         options: [
  //           { id: 1, label: "হ্যাঁ", value: "Yes" },
  //           { id: 2, label: "না", value: "No" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "২৯",
  //         quesName: "আপোনাৰ চলাফিলাত কোনো অসুবিধা হৈছে নে?",
  //         options: [
  //           { id: 1, label: "হয়", value: "Yes" },
  //           { id: 2, label: "নহয়", value: "No" },
  //         ],
  //       },
  //     },
  //   },
  //   {
  //     id: 30,
  //     category: "injury",
  //     type: "file",
  //     gender: ["M", "F"],
  //     quesKey: "injuryImage",
  //     translation: {
  //       en: {
  //         quesNo: "30",
  //         quesName: "Please upload or select an image of the injury (if available)",
  //       },
  //       bn: {
  //         quesNo: "৩০",
  //         quesName: "অনুগ্রহ করে চোটের ছবি আপলোড করুন বা নির্বাচন করুন (যদি থাকে)",
  //       },
  //       as: {
  //         quesNo: "৩০",
  //         quesName: "অনুগ্ৰহ কৰি আঘাতৰ ছবি আপল'ড কৰক বা নিৰ্বাচন কৰক (যদি উপলব্ধ থাকে)",
  //       },
  //     },
  //   },
  //   {
  //     id: 31,
  //     category: "injury",
  //     type: "input-text",
  //     gender: ["M", "F"],
  //     quesKey: "injuryCause",
  //     translation: {
  //       en: {
  //         quesNo: "31",
  //         quesName: "How did the injury happen?",
  //       },
  //       bn: {
  //         quesNo: "৩১",
  //         quesName: "চোট কিভাবে লেগেছে?",
  //       },
  //       as: {
  //         quesNo: "৩১",
  //         quesName: "আঘাত কেনেকৈ হৈছিল?",
  //       },
  //     },
  //   },
  // ],

  // 	 burning
  injury: [
    {
      id: 24,
      category: "injury",
      type: "date",
      gender: ["M", "F"],
      quesKey: "injuryDate",
      translation: {
        en: {
          quesNo: "24",
          quesName: "Injury date",
        },
        bn: {
          quesNo: "২৪",
          quesName: "আঘাতের তারিখ",
        },
        as: {
          quesNo: "২৪",
          quesName: "আঘাতৰ তাৰিখ",
        },
      },
    },
    {
      id: 25,
      category: "injury",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "injuryPain",
      translation: {
        en: {
          quesNo: "25",
          quesName: "Pain",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "২৫",
          quesName: "ব্যথা",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "২৫",
          quesName: "বিষ",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
    {
      id: 26,
      category: "injury",
      type: "slider",
      quesKey: "injuryPainIntensity",
      gender: ["M", "F"],
      showIf: { injuryPain: ["Yes"] },
      translation: {
        en: {
          quesNo: "26",
          quesName: "Pain intensity",
          options: [
            { id: 1, label: "Low", value: "Low" },
            { id: 2, label: "Medium", value: "Medium" },
            { id: 3, label: "High", value: "High" },
          ],
        },
        bn: {
          quesNo: "২৬",
          quesName: "ব্যথার মাত্রা",
          options: [
            { id: 1, label: "কম", value: "Low" },
            { id: 2, label: "মাঝারি", value: "Medium" },
            { id: 3, label: "বেশি", value: "High" },
          ],
        },
        as: {
          quesNo: "২৬",
          quesName: "বিষৰ মাত্রা",
          options: [
            { id: 1, label: "কম", value: "Low" },
            { id: 2, label: "মধ্যম", value: "Medium" },
            { id: 3, label: "বেছি", value: "High" },
          ],
        },
      },
    },
    {
      id: 27,
      category: "injury",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "injurySwelling",
      translation: {
        en: {
          quesNo: "27",
          quesName: "Swelling",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "২৭",
          quesName: "ফোলা",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "২৭",
          quesName: "ফুলি উঠিছে",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
    {
      id: 28,
      category: "injury",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "injuryBleeding",
      translation: {
        en: {
          quesNo: "28",
          quesName: "Bleeding",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "২৮",
          quesName: "রক্তপাত",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "২৮",
          quesName: "ৰক্তপাত",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
    {
      id: 29,
      category: "injury",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "injuryMobilityIssues",
      translation: {
        en: {
          quesNo: "29",
          quesName: "Mobility issues",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "২৯",
          quesName: "চলাফেরা সমস্যা",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "২৯",
          quesName: "চলাফিলা অসুবিধা",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
    {
      id: 30,
      category: "injury",
      type: "file",
      gender: ["M", "F"],
      quesKey: "injuryImage",
      translation: {
        en: {
          quesNo: "30",
          quesName: "Injury image",
        },
        bn: {
          quesNo: "৩০",
          quesName: "চোটের ছবি",
        },
        as: {
          quesNo: "৩০",
          quesName: "আঘাতৰ ছবি",
        },
      },
    },
    {
      id: 31,
      category: "injury",
      type: "input-text",
      gender: ["M", "F"],
      quesKey: "injuryCause",
      translation: {
        en: {
          quesNo: "31",
          quesName: "How injury happened",
        },
        bn: {
          quesNo: "৩১",
          quesName: "কিভাবে চোট",
        },
        as: {
          quesNo: "৩১",
          quesName: "কেনেকৈ আঘাত",
        },
      },
    },
  ],

  // burn: [
  //   {
  //     id: 32,
  //     category: "burn",
  //     type: "single-choice",
  //     gender: ["M", "F"],
  //     quesKey: "burnPain",
  //     translation: {
  //       en: {
  //         quesNo: "32",
  //         quesName: "Is there any pain due to the burn?",
  //         options: [
  //           { id: 1, label: "Yes", value: "Yes" },
  //           { id: 2, label: "No", value: "No" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "৩২",
  //         quesName: "পোড়ার কারণে কি ব্যথা হচ্ছে?",
  //         options: [
  //           { id: 1, label: "হ্যাঁ", value: "Yes" },
  //           { id: 2, label: "না", value: "No" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "৩২",
  //         quesName: "জ্বলাই থকাৰ বাবে কি বিষ হৈছে?",
  //         options: [
  //           { id: 1, label: "হয়", value: "Yes" },
  //           { id: 2, label: "নহয়", value: "No" },
  //         ],
  //       },
  //     },
  //   },
  //   {
  //     id: 33,
  //     category: "burn",
  //     type: "single-choice",
  //     gender: ["M", "F"],
  //     quesKey: "burnSwelling",
  //     translation: {
  //       en: {
  //         quesNo: "33",
  //         quesName: "Is there any swelling due to the burn?",
  //         options: [
  //           { id: 1, label: "Yes", value: "Yes" },
  //           { id: 2, label: "No", value: "No" },
  //         ],
  //       },
  //       bn: {
  //         quesNo: "৩৩",
  //         quesName: "পোড়ার কারণে কি ফোলা আছে?",
  //         options: [
  //           { id: 1, label: "হ্যাঁ", value: "Yes" },
  //           { id: 2, label: "না", value: "No" },
  //         ],
  //       },
  //       as: {
  //         quesNo: "৩৩",
  //         quesName: "জ্বলাই থকাৰ বাবে কি ফুলি উঠিছে?",
  //         options: [
  //           { id: 1, label: "হয়", value: "Yes" },
  //           { id: 2, label: "নহয়", value: "No" },
  //         ],
  //       },
  //     },
  //   },
  //   {
  //     id: 34,
  //     category: "burn",
  //     type: "file",
  //     gender: ["M", "F"],
  //     quesKey: "burnImage",
  //     translation: {
  //       en: {
  //         quesNo: "34",
  //         quesName: "Please upload or select an image of the burn (if available)",
  //       },
  //       bn: {
  //         quesNo: "৩৪",
  //         quesName: "অনুগ্রহ করে পোড়ার ছবি আপলোড করুন বা নির্বাচন করুন (যদি থাকে)",
  //       },
  //       as: {
  //         quesNo: "৩৪",
  //         quesName: "অনুগ্ৰহ কৰি জ্বলা ঠাইৰ ছবি আপল'ড কৰক বা নিৰ্বাচন কৰক (যদি উপলব্ধ থাকে)",
  //       },
  //     },
  //   },
  // ],
  burn: [
    {
      id: 32,
      category: "burn",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "burnPain",
      translation: {
        en: {
          quesNo: "32",
          quesName: "Burn pain",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "৩২",
          quesName: "পোড়া ব্যথা",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "৩২",
          quesName: "জ্বলা বিষ",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
    {
      id: 33,
      category: "burn",
      type: "single-choice",
      gender: ["M", "F"],
      quesKey: "burnSwelling",
      translation: {
        en: {
          quesNo: "33",
          quesName: "Burn swelling",
          options: [
            { id: 1, label: "Yes", value: "Yes" },
            { id: 2, label: "No", value: "No" },
          ],
        },
        bn: {
          quesNo: "৩৩",
          quesName: "পোড়া ফোলা",
          options: [
            { id: 1, label: "হ্যাঁ", value: "Yes" },
            { id: 2, label: "না", value: "No" },
          ],
        },
        as: {
          quesNo: "৩৩",
          quesName: "জ্বলা ফুলি উঠিছে",
          options: [
            { id: 1, label: "হয়", value: "Yes" },
            { id: 2, label: "নহয়", value: "No" },
          ],
        },
      },
    },
    {
      id: 34,
      category: "burn",
      type: "file",
      gender: ["M", "F"],
      quesKey: "burnImage",
      translation: {
        en: {
          quesNo: "34",
          quesName: "Burn area image",
        },
        bn: {
          quesNo: "৩৪",
          quesName: "দগ্ধ এলাকার ছবি",
        },
        as: {
          quesNo: "৩৪",
          quesName: "দগ্ধ অঞ্চলৰ ছবি",
        },
      },
    },
  ],
};
