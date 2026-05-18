<script setup>
import { withBase } from 'vitepress'
</script>

<template>
  <div class="landing">
    <div class="landing-bg">
      <div class="landing-orb orb-1"></div>
      <div class="landing-orb orb-2"></div>
      <div class="landing-orb orb-3"></div>
    </div>

    <div class="landing-content">
      <div class="landing-book">
        <img :src="withBase('/hero.svg')" alt="The MLflow Fable Book" class="landing-hero-img" />
      </div>

      <h1 class="landing-title">The MLflow Fable Book</h1>
      <p class="landing-subtitle">21 stories. Every concept. One chocolate cake.</p>

      <div class="landing-stats">
        <div class="stat">
          <span class="stat-number">21</span>
          <span class="stat-label">Fables</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-number">2</span>
          <span class="stat-label">Languages</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-number">17</span>
          <span class="stat-label">Characters</span>
        </div>
      </div>

      <div class="landing-cards">
        <a :href="withBase('/en/')" class="lang-card">
          <span class="lang-flag">🇬🇧</span>
          <span class="lang-name">English</span>
          <span class="lang-hint">Start Reading →</span>
        </a>
        <a :href="withBase('/zh/')" class="lang-card">
          <span class="lang-flag">🇨🇳</span>
          <span class="lang-name">中文</span>
          <span class="lang-hint">开始阅读 →</span>
        </a>
      </div>

      <p class="landing-footer">
        Built with fables and a lot of cake metaphors
      </p>
    </div>
  </div>
</template>

<style scoped>
.landing {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #0f0f1a;
}

.landing-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.landing-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: #667eea;
  top: -100px;
  right: -100px;
  animation: orbFloat1 8s ease-in-out infinite;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: #764ba2;
  bottom: -80px;
  left: -80px;
  animation: orbFloat2 10s ease-in-out infinite;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: #f093fb;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: orbFloat3 7s ease-in-out infinite;
  opacity: 0.2;
}

@keyframes orbFloat1 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-40px, 30px); }
}

@keyframes orbFloat2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, -40px); }
}

@keyframes orbFloat3 {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.2); }
}

.landing-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 40px 24px;
  max-width: 600px;
}

.landing-book {
  margin-bottom: 24px;
}

.landing-hero-img {
  width: 220px;
  height: 220px;
  filter: drop-shadow(0 8px 32px rgba(102, 126, 234, 0.3));
  animation: heroFloat 4s ease-in-out infinite;
}

@keyframes heroFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.landing-title {
  font-size: 42px;
  font-weight: 800;
  background: linear-gradient(135deg, #8b9cf7 0%, #a78bfa 40%, #f0abfc 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 12px;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.landing-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 32px;
  font-weight: 400;
}

.landing-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 40px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 800;
  color: white;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.15);
}

.landing-cards {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 40px;
}

.lang-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 40px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.lang-card:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(102, 126, 234, 0.5);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
}

.lang-flag {
  font-size: 36px;
  margin-bottom: 8px;
}

.lang-name {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
}

.lang-hint {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.2s;
}

.lang-card:hover .lang-hint {
  color: #8b9cf7;
}

.landing-footer {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.25);
  margin: 0;
  font-style: italic;
}
</style>
