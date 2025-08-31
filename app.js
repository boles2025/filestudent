// js/app.js
// وظائف مشتركة تنتظر توفر window.db
function whenDbReady(fn) {
  if (window.db) return fn();
  setTimeout(() => whenDbReady(fn), 100);
}

/* === صفحة العميل (index.html) === */
whenDbReady(() => {
  const getBtn = document.getElementById('getNumberBtn');
  const myNum = document.getElementById('myNumber');
  const printBtn = document.getElementById('printBtn');

  if (getBtn) {
    getBtn.addEventListener('click', () => {
      // زيادة آمنة لآخر رقم
      db.ref('queue/lastNumber').transaction(curr => (curr || 0) + 1, (err, committed, snap) => {
        if (err) return console.error("Tx error:", err);
        if (!committed) return console.warn("Tx not committed");
        const num = snap.val();
        myNum.innerText = `رقمك: ${num}`;
        // خزّن تذكرة (اختياري)
        db.ref(`queue/tickets/${num}`).set({ number: num, createdAt: Date.now() })
          .catch(e => console.error("save ticket error", e));
        printBtn.style.display = 'inline-block';
        printBtn.onclick = () => {
          const w = window.open('', '_blank', 'width=400,height=300');
          w.document.write(`<div style="font-size:48px;text-align:center;margin-top:80px">رقمك: <b>${num}</b></div>`);
          w.print();
          w.close();
        };
      });
    });
  }

  // صفحة display تعمل على عرض currentNumber
  const displayEl = document.getElementById('displayNumber');
  if (displayEl) {
    db.ref('queue/currentNumber').on('value', snap => {
      displayEl.innerText = snap.val() || 0;
    });
  }

  // صفحة الأدمن
  const adminCur = document.getElementById('adminCurrent');
  const adminLast = document.getElementById('adminLast');
  const nextBtn = document.getElementById('adminNextBtn');
  const resetBtn = document.getElementById('adminResetBtn');

  if (adminCur) {
    db.ref('queue/currentNumber').on('value', s => adminCur.innerText = s.val() || 0);
  }
  if (adminLast) {
    db.ref('queue/lastNumber').on('value', s => adminLast.innerText = s.val() || 0);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', async () => {
      // نأخذ آخر رقم ثم نزيد currentNumber بواحد (لا يتجاوز lastNumber)
      const lastSnap = await db.ref('queue/lastNumber').once('value');
      const last = lastSnap.val() || 0;
      db.ref('queue/currentNumber').transaction(cur => {
        cur = cur || 0;
        return (cur < last) ? cur + 1 : cur; // لا نتخطى اخر رقم
      }, (err, committed, snap) => {
        if (err) return console.error(err);
        if (!committed) return console.log("لا يوجد أرقام جديدة");
        console.log("Now showing:", snap.val());
      });
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (!confirm('هل تريد إعادة تعيين الطابور (سيتم مسح الأرقام)؟')) return;
      db.ref('queue').set({ currentNumber: 0, lastNumber: 0 })
        .then(() => alert('تمت إعادة التعيين'))
        .catch(e => console.error(e));
    });
  }
});
