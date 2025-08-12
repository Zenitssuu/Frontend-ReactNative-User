export const translatedSymptomSection = [
  {
    key: "generalSymptoms",
    translations: {
      en: "General Symptoms",
      bn: "সাধারণ উপসর্গ",
      as: "সাধাৰণ লক্ষণ",
    },
    categories: [
      {
        key: "fever",
        translations: {
          en: "Fever",
          bn: "জ্বর",
          as: "জ্বৰ",
        },
        image: require("../../assets/generalSymptoms/fever.png"),
      },
      {
        key: "cough",
        translations: {
          en: "Cough",
          bn: "কাশি",
          as: "কাহ",
        },
        image: require("../../assets/generalSymptoms/cough.png"),
      },
      {
        key: "headache",
        translations: {
          en: "Headache",
          bn: "মাথা ব্যথা",
          as: "মূৰ বিষ",
        },
        image: require("../../assets/generalSymptoms/headache.png"),
      },
      {
        key: "vomiting",
        translations: {
          en: "Vomiting",
          bn: "বমি",
          as: "বমি",
        },
        image: require("../../assets/generalSymptoms/vomiting.png"),
      },
      {
        key: "hair-loss",
        translations: {
          en: "Hair Loss",
          bn: "চুল পড়া",
          as: "চুলি হেৰুৱা",
        },
        image: require("../../assets/generalSymptoms/hair-loss.png"),
      },
      {
        key: "bleeding",
        translations: {
          en: "Bleeding",
          bn: "রক্তপাত",
          as: "ৰক্ত ক্ষৰণ",
        },
        image: require("../../assets/generalSymptoms/bleeding.png"),
      },
      {
        key: "injury",
        translations: {
          en: "Injury",
          bn: "আঘাত",
          as: "আঘাত",
        },
        image: require("../../assets/generalSymptoms/injury.png"),
      },
      {
        key: "burn",
        translations: {
          en: "Burn",
          bn: "দগ্ধ",
          as: "পোৰা",
        },
        image: require("../../assets/generalSymptoms/burn.png"),
      },
    ],
  },

  {
    key: "skin",
    translations: {
      en: "Skin",
      bn: "চামড়া",
      as: "চামৰা",
    },
    categories: [
      {
        key: "my-skin",
        translations: {
          en: "Skin",
          bn: "আমার ত্বক",
          as: "মোৰ ছাল",
        },
        image: require("../../assets/skin/my-skin.png"),
      },
      // {
      //   key: "skin-issues",
      //   translations: {
      //     en: "Skin Issues",
      //     bn: "ত্বকের সমস্যা",
      //     as: "ছালৰ সমস্যা",
      //   },
      //   image: require("../../assets/skin/skin-issues.png"),
      // },
    ],
  },
  {
    key: "bodyParts",
    translations: {
      en: "Body Parts",
      bn: "দেহৰ অংগ",
      as: "দেহৰ অংগ",
    },
    categories: [
      {
        name: "Upper Body",
        translation: {
          en: "Upper Body",
          bn: "ঊর্ধ্বাঙ্গ",
          as: "ঊৰ্ধ্ব দেহ",
        },
        bodyParts: [
          {
            key: "eyes",
            translations: {
              en: "Eyes",
              bn: "চোখ",
              as: "চকু",
            },
            image: require("../../assets/bodyParts/eyes.png"),
          },
          {
            key: "forehead",
            translations: {
              en: "Forehead",
              bn: "কপাল",
              as: "কপাল",
            },
            image: require("../../assets/bodyParts/forehead.png"),
          },
          {
            key: "ears",
            translations: {
              en: "Ears",
              bn: "কান",
              as: "কান",
            },
            image: require("../../assets/bodyParts/ears.png"),
          },
          {
            key: "nose",
            translations: {
              en: "Nose",
              bn: "নাক",
              as: "নাক",
            },
            image: require("../../assets/bodyParts/nose.png"),
          },
          {
            key: "mouth-lips",
            translations: {
              en: "Mouth / Lips",
              bn: "মুখ / ঠোঁট",
              as: "মুখ / ওঠ",
            },
            image: require("../../assets/bodyParts/mouthlip.png"),
          },
          {
            key: "neck",
            translations: {
              en: "Neck",
              bn: "ঘাড়",
              as: "ঘাড়",
            },
            image: require("../../assets/bodyParts/neck.png"),
          },
          {
            key: "upperArm",
            translations: {
              en: "Upper Arm",
              bn: "বাহুর উপরের \nঅংশ",
              as: "বাহুৰ ওপৰৰ \nঅংশ",
            },
            image: require("../../assets/bodyParts/upperArm.png"),
          },
          {
            key: "elbow",
            translations: {
              en: "Elbow",
              bn: "কুঁহি",
              as: "কঁহু",
            },
            image: require("../../assets/bodyParts/elbow.png"),
          },
          {
            key: "forearm",
            translations: {
              en: "Forearm",
              bn: "বাহুর নিম্ন \nভাগ",
              as: "বাহুৰ তলৰ \nঅংশ",
            },
            image: require("../../assets/bodyParts/forearm.png"),
          },
          {
            key: "hands",
            translations: {
              en: "Hands",
              bn: "হাত",
              as: "হাত",
            },
            image: require("../../assets/bodyParts/hands.png"),
          },
          {
            key: "fingers",
            translations: {
              en: "Fingers",
              bn: "আঙ্গুল",
              as: "আঙুলি",
            },
            image: require("../../assets/bodyParts/fingers.png"),
          },
        ],
      },
      {
        name: "Middle Body",
        translation: {
          en: "Middle Body",
          bn: "মধ্য অংশ",
          as: "মধ্য অংশ",
        },

        bodyParts: [
          {
            key: "chest",
            translations: {
              en: "Chest",
              bn: "বক্ষ",
              as: "বক্ষে",
            },
            image: require("../../assets/bodyParts/chest.png"),
          },
          {
            key: "abdomen",
            translations: {
              en: "Abdomen",
              bn: "পেট",
              as: "পেট",
            },
            image: require("../../assets/bodyParts/abdomen.png"),
          },
          {
            key: "upper-back",
            translations: {
              en: "Upper Back",
              bn: "উপরের পিঠ",
              as: "পিঠিৰ ওপৰ \nভাগ",
            },
            image: require("../../assets/bodyParts/upper-back.png"),
          },
          {
            key: "lower-back",
            translations: {
              en: "Lower Back",
              bn: "নিচের পিঠ",
              as: "পিঠিৰ তলৰ \nভাগ",
            },
            image: require("../../assets/bodyParts/lower-back.png"),
          },
        ],
      },
      {
        name: "Lower Body",
        translation: {
          en: "Lower Body",
          bn: "নিম্ন অঙ্গ",
          as: "তলৰ অংগ",
        },

        bodyParts: [
          {
            key: "thigh",
            translations: {
              en: "Thigh",
              bn: "উরু",
              as: "উৰু",
            },
            image: require("../../assets/bodyParts/thigh.png"),
          },
          {
            key: "knee",
            translations: {
              en: "Knee",
              bn: "হাঁটু",
              as: "হাঁহি",
            },
            image: require("../../assets/bodyParts/knee.png"),
          },
          {
            key: "calf",
            translations: {
              en: "Calf",
              bn: "পিণ্ডলী",
              as: "পিণ্ডলী",
            },
            image: require("../../assets/bodyParts/calf.png"),
          },
          {
            key: "ankle",
            translations: {
              en: "Ankle",
              bn: "গোড়ালি",
              as: "গোড়ালি",
            },
            image: require("../../assets/bodyParts/ankle.png"),
          },
          {
            key: "feet",
            translations: {
              en: "Feet",
              bn: "পা",
              as: "ভৰিৰ তল",
            },
            image: require("../../assets/bodyParts/feet.png"),
          },
          {
            key: "toes",
            translations: {
              en: "Toes",
              bn: "পায়ের আঙ্গুল",
              as: "ভৰিৰ আঙুলি",
            },
            image: require("../../assets/bodyParts/toes.png"),
          },
        ],
      },
    ],
  },
  {
    key: "bodyExcretion",
    translations: {
      en: "Body Excretion",
      bn: "দেহ নিঃসরণ",
      as: "দেহ নিঃসৰণ",
    },
    categories: [
      {
        key: "stool",
        translations: {
          en: "Stool",
          bn: "পায়খানা",
          as: "পায়খানা",
        },
        image: require("../../assets/bodyExcretion/stool.png"),
      },
      {
        key: "sputum",
        translations: {
          en: "Sputum",
          bn: "কফ",
          as: "কফ",
        },
        image: require("../../assets/bodyExcretion/sputum.png"),
      },
      {
        key: "sweat",
        translations: {
          en: "Sweat",
          bn: "ঘাম",
          as: "ঘাম",
        },
        image: require("../../assets/bodyExcretion/sweat.png"),
      },
      {
        key: "saliva",
        translations: {
          en: "Saliva",
          bn: "লাল",
          as: "লাল",
        },
        image: require("../../assets/bodyExcretion/saliva.png"),
      },
      {
        key: "menstrual",
        translations: {
          en: "Menstrual",
          bn: "ঋতুচক্র",
          as: "ঋতুস্ৰাৱ",
        },
        image: require("../../assets/bodyExcretion/menstrual.png"),
      },
      {
        key: "urination",
        translations: {
          en: "Urination",
          bn: "মূত্রত্যাগ",
          as: "প্ৰস্ৰাৱ",
        },
        image: require("../../assets/bodyExcretion/urination.png"),
      },
    ],
  },
  {
    key: "others",
    translations: {
      en: "Additional Symptoms",
      bn: "অন্যান্য উপসর্গ",
      as: "অন্য লক্ষণ",
    },
    categories: [
      {
        key: "others",
        translations: {
          en: "Others",
          bn: "অন্যান্য",
          as: "অন্যান্য",
        },
        image: require("../../assets/others/others.png"),
      },
      // {
      //   key: "anxiety",
      //   translations: {
      //     en: "Anxiety",
      //     bn: "উদ্বেগ",
      //     as: "উদ্বিগ্নতা",
      //   },
      //   image: require("../../assets/others/anxiety.png"),
      // },
      // {
      //   key: "concentration",
      //   translations: {
      //     en: "Difficulty Concentrating",
      //     bn: "মনোযোগৰ সমস্যা",
      //     as: "মনোসংযোগত অসুবিধা",
      //   },
      //   image: require("../../assets/others/concentration.png"),
      // },
      // {
      //   key: "stress",
      //   translations: {
      //     en: "Stress",
      //     bn: "চিন্তা",
      //     as: "উত্কণ্ঠা",
      //   },
      //   image: require("../../assets/others/stress.png"),
      // },
      // {
      //   key: "sleep",
      //   translations: {
      //     en: "Sleep Issues",
      //     bn: "ঘুমের সমস্যা",
      //     as: "নিদ্ৰাৰ সমস্যা",
      //   },
      //   image: require("../../assets/others/sleep.png"),
      // },
      // {
      //   key: "loss-of-appetite",
      //   translations: {
      //     en: "Loss of \n Appetite",
      //     bn: "ক্ষুধামন্দা",
      //     as: "ক্ষুধাৰ অভাৱ",
      //   },
      //   image: require("../../assets/others/loss-of-appetite.png"),
      // },
      // {
      //   key: "weight",
      //   translations: {
      //     en: "Weight \n Change",
      //     bn: "",
      //     as: "ওজনত পাৰ্থক্য",
      //   },
      //   image: require("../../assets/others/weight-change.png"),
      // },
      // {
      //   key: "acid-reflux",
      //   translations: {
      //     en: "Acid Reflux",
      //     bn: "অম্লতা",
      //     as: "অম্বল",
      //   },
      //   image: require("../../assets/others/acid-reflux.png"),
      // },
    ],
  },
];
