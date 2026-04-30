const music = document.getElementById("bgm"),
      btn = document.getElementById("musicBtn"),
      cd = document.getElementById("cdImg"),
      charSection = document.getElementById("charSection"),
      mainBg = document.getElementById("mainBg"),
      infoLeft = document.getElementById("infoLeft"),
      infoRight = document.getElementById("infoRight"),
      toTop = document.getElementById("toTop");

let started = false, playing = false;
let topTimer = null;

// 音樂播放/暫停邏輯
btn.addEventListener("click", (e) => {
    e.stopPropagation(); 
    if (!started) {
        // 第一次點擊載入音樂路徑
        music.src = "https://raw.githubusercontent.com/LitViolet/yanarius-violet/main/bgm/yana.v_web_bgm.mp3";
        music.play().then(() => {
            music.volume = 0.5; started = true; playing = true;
            btn.classList.add("playing"); 
            cd.src = "https://raw.githubusercontent.com/LitViolet/yanarius-violet/main/images/cd.png";
        }).catch(err => console.log("播放被瀏覽器阻擋:", err));
        return;
    }
    if (playing) { 
        music.pause(); 
        cd.src = "https://raw.githubusercontent.com/LitViolet/yanarius-violet/main/images/cdbox.png"; 
        btn.classList.remove("playing"); 
    } else { 
        music.play(); 
        cd.src = "https://raw.githubusercontent.com/LitViolet/yanarius-violet/main/images/cd.png"; 
        btn.classList.add("playing"); 
    }
    playing = !playing;
});

// 手機端 Back to Top 按鈕顯示邏輯
function showTopButton() {
    if (window.innerWidth <= 768) {
        toTop.classList.add("show");
        if (topTimer) clearTimeout(topTimer);
        topTimer = setTimeout(() => {
            toTop.classList.remove("show");
        }, 2000); 
    }
}

document.addEventListener("click", showTopButton);
window.addEventListener("scroll", showTopButton, { passive: true });

// 滾動動畫邏輯
function handleScrollAnimation() {
    if (!charSection) return;
    
    const rect = charSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    // 計算當前 Section 相對於視窗中心的進度
    const rawProgress = (rect.top + rect.height / 2 - windowHeight / 2) / windowHeight;
    const progress = Math.max(-1, Math.min(1, rawProgress)); 
    const absProgress = Math.abs(progress);

    // 主圖縮放與透明度
    mainBg.style.setProperty('--bg-scale', 1.1 - absProgress * 0.3);
    mainBg.style.setProperty('--bg-opacity', 1 - absProgress * 1.5);

    // 左右資訊盒位移
    if (window.innerWidth > 768) {
        infoLeft.style.setProperty('--left-x', `${progress * -300}px`);
        infoRight.style.setProperty('--right-x', `${progress * 300}px`);
    } else {
        infoLeft.style.setProperty('--mobile-x-left', `${progress * -150}%`);
        infoRight.style.setProperty('--mobile-x-right', `${progress * 150}%`);
    }

    // 資訊盒透明度與縮放
    const boxOpacity = 1 - absProgress * 2.5;
    const boxScale = (window.innerWidth <= 768) ? 1 : 1 - absProgress * 0.3;
    
    [infoLeft, infoRight].forEach(box => {
        box.style.setProperty('--box-opacity', boxOpacity);
        box.style.setProperty('--box-scale', boxScale);
    });
}

window.addEventListener("scroll", handleScrollAnimation, { passive: true });
window.addEventListener("resize", handleScrollAnimation);

// 回到頂部點擊事件
toTop.addEventListener("click", (e) => {
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.innerWidth <= 768) {
        toTop.classList.remove("show");
        if (topTimer) clearTimeout(topTimer);
    }
});

// 初始化執行一次
handleScrollAnimation();