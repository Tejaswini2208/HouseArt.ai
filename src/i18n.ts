import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  te: {
    translation: {
      app_name: "హోమ్ ఆర్ట్ (HomeArt)",
      tagline: "AI హోమ్ ఇంటీరియర్ డిజైన్",
      explore: "అన్వేషించండి",
      bedroom: "బెడ్రూమ్",
      kitchen: "వంటగది",
      hall: "హాల్",
      false_ceiling: "ఫాల్స్ సీలింగ్",
      wardrobe: "వార్డ్రోబ్",
      indian_traditional: "భారతీయ సాంప్రదాయం",
      pooja_room: "పూజ గది",
      courtyard: "ముంగిలి",
      ethnic_decor: "ఎత్నిక్ డెకర్",
      ceilings: "సీలింగ్స్",
      search_placeholder: "ఇంటీరియర్ ఐడియాల కోసం వెతకండి...",
      ai_chat: "AI సహాయకుడు",
      ai_analyzer: "AI రూమ్ ఎనలైజర్",
      save: "సేవ్ చేయండి",
      saved: "సేవ్ చేయబడింది",
      download: "డౌన్‌లోడ్",
      upload_image: "చిత్రాన్ని అప్‌లోడ్ చేయండి",
      analyzing: "విశ్లేషిస్తోంది...",
      chatbot_welcome: "నమస్కారం! నేను మీకు ఎలా సహాయపడగలను?",
      trending: "ట్రెండింగ్",
      loading: "లోడ్ అవుతోంది...",
      no_results: "ఫలితాలు లేవు."
    }
  },
  en: {
    translation: {
      app_name: "HomeArt",
      tagline: "Premium AI Interior Vision",
      explore: "Explore",
      bedroom: "Bedroom",
      kitchen: "Kitchen",
      hall: "Living Room",
      false_ceiling: "False Ceiling",
      wardrobe: "Wardrobe",
      indian_traditional: "Indian Traditional",
      pooja_room: "Pooja Room",
      courtyard: "Traditional Courtyard",
      ethnic_decor: "Ethnic Decor",
      ceilings: "Ceilings",
      search_placeholder: "Search for interior ideas...",
      ai_chat: "AI Assistant",
      ai_analyzer: "Room Analyzer",
      save: "Save",
      saved: "Saved",
      download: "Download",
      upload_image: "Upload Image",
      analyzing: "Analyzing...",
      chatbot_welcome: "Hello! How can I help you today?",
      trending: "Trending",
      loading: "Loading...",
      no_results: "No results found."
    }
  },
  hi: {
    translation: {
      app_name: "होमआर्ट (HomeArt)",
      tagline: "AI होम इंटीरियर डिजाइन",
      explore: "एक्सप्लोर करें",
      bedroom: "बेडरूम",
      kitchen: "रसोई",
      hall: "हॉल",
      false_ceiling: "फॉल्स सीलिंग",
      wardrobe: "वार्डरोब",
      indian_traditional: "भारतीय पारंपरिक",
      pooja_room: "पूजा कक्ष",
      courtyard: "पारंपरिक आंगन",
      ethnic_decor: "एथनिक डेकोर",
      ceilings: "छत डिजाइन (Ceilings)",
      search_placeholder: "इंटीरियर आइडिया खोजें...",
      ai_chat: "AI सहायक",
      ai_analyzer: "रूम एनालाइजर",
      save: "सेव करें",
      saved: "सेव किया गया",
      download: "डाउनलोड",
      upload_image: "इमेज अपलोड करें",
      analyzing: "विश्लेषण कर रहा है...",
      chatbot_welcome: "नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?",
      trending: "ट्रेंडिंग"
    }
  }
  // Adding more languages here would be ideal, but starting with these three
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en', // Changed from 'te' to 'en'
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
