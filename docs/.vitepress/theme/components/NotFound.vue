<script setup>
import { useRouter } from 'vitepress'

const router = useRouter()
</script>

<template>
  <div class="not-found">
    <div class="not-found-icon">🍰</div>
    <h1>404</h1>
    <p class="not-found-message">Maya couldn't find that recipe either.</p>
    <p class="not-found-hint">The page you're looking for doesn't exist — maybe it was moved to Lena's vault?</p>
    <div class="not-found-actions">
      <a href="/en/guide/" class="not-found-btn primary">Read the Fables</a>
      <a href="/" class="not-found-btn">Back to Home</a>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 40px 20px;
}

.not-found-icon {
  font-size: 64px;
  margin-bottom: 8px;
}

.not-found h1 {
  font-size: 72px;
  font-weight: 800;
  color: #667eea;
  margin: 0;
  line-height: 1;
}

.not-found-message {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 16px 0 8px;
}

.dark .not-found-message {
  color: #e0e0e0;
}

.not-found-hint {
  font-size: 15px;
  color: #666;
  margin: 0 0 32px;
}

.dark .not-found-hint {
  color: #999;
}

.not-found-actions {
  display: flex;
  gap: 12px;
}

.not-found-btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s;
  border: 2px solid #667eea;
  color: #667eea;
}

.not-found-btn.primary {
  background: #667eea;
  color: white;
}

.not-found-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
</style>
