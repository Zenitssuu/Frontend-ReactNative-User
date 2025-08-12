// You could place this in a new file like `utils/durationTranslations.js`
// or within an existing translation utility.

export const getTranslatedDurationChoice = (value, language) => {
  const translations = {
    hours: {
      en: "Hours",
      bn: "ঘন্টা",
      as: "ঘণ্টা",
    },
    days: {
      en: "Days",
      bn: "দিন",
      as: "দিন",
    },
    weeks: {
      en: "Weeks",
      bn: "সপ্তাহ",
      as: "সপ্তাহ",
    },
    months: {
      en: "Months",
      bn: "মাস",
      as: "মাহ",
    },
    years: {
      en: "Years",
      bn: "বছর",
      as: "বছৰ",
    },
  };

  return translations[value]?.[language] || translations[value]?.en || value;
};
