// ==UserScript==
// @name         B站直播间 点赞点亮粉丝牌
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  B站web直播间一键点赞点亮粉丝勋章，强制单小圆按钮，兼容blanc极简页
// @author       You
// @match        https://live.bilibili.com/*
// ==/UserScript==
(function() {
    'use strict';
    const BTN_ID = "tm-like-medal-btn";

    function getRoomId() {
        const path = location.pathname;
        const match = path.match(/(\d+)(?:[?#\/]|$)/);
        if (!match) return null;
        const roomid = parseInt(match[1], 10);
        return isNaN(roomid) ? null : roomid;
    }

    async function sendLike() {
        const roomid = getRoomId();
        if (!roomid) {
            alert("❌ 获取房间号失败！当前地址：" + location.href);
            return;
        }

        const likeBtn = document.querySelector(".like-btn");
        if (!likeBtn) {
            alert("❌ 找不到点赞按钮 .like-btn！请确认直播间已开播。");
            return;
        }

        console.log(`开始模拟点赞，房间号:${roomid}`);
        const target = 30;

        for (let i = 1; i <= target; i++) {
            likeBtn.click();
            console.log(`已点赞 ${i}/${target}`);
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        alert(`✅ 点赞完成 ${target}次！\n⚠️前提：直播间正在直播，且你已拥有该主播粉丝团勋章。`);
    }

    // 先删除旧按钮，再新建，保证页面永远最多1个按钮
    function addButton() {
        const oldBtn = document.getElementById(BTN_ID);
        if (oldBtn) oldBtn.remove();

        const btn = document.createElement("button");
        btn.id = BTN_ID;
        btn.innerText = "🔥";
        btn.title = "一键点赞点亮粉丝牌";

        btn.style = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999;
            width: 36px;
            height: 36px;
            padding: 0;
            background: #fb7299;
            color: #fff;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            line-height: 36px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(251,114,153,.45);
        `;

        btn.onclick = sendLike;
        document.body.appendChild(btn);
    }

    // 初始化
    addButton();
    let oldHref = location.href;
    setInterval(() => {
        if (location.href !== oldHref) {
            oldHref = location.href;
            console.log("检测到直播间切换，重建按钮");
            setTimeout(addButton, 800);
        }
    }, 500);

})();
