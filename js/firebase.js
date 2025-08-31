// js/firebase.js
// تهيئة Firebase — استخدم الكونفيج بتاعك هنا
var firebaseConfig = {
  apiKey: "AIzaSyBajCZMATK21mgaEFcccyhLne4pgdaxMfk",
  authDomain: "dent-35a17.firebaseapp.com",
  databaseURL: "https://dent-35a17-default-rtdb.firebaseio.com",
  projectId: "dent-35a17",
  storageBucket: "dent-35a17.firebasestorage.app",
  messagingSenderId: "416163754700",
  appId: "1:416163754700:web:dec496619e3e6fff3e0869"
};

// تأكد أن SDK محمّل قبل هذا الملف
try {
  firebase.initializeApp(firebaseConfig);
  // نجعل db متاحة كخاصية من window لسهولة الوصول من ملفات أخرى
  window.db = firebase.database();
  console.log("Firebase initialized (project):", firebaseConfig.projectId);
} catch (err) {
  console.error("Firebase init error:", err);
}
