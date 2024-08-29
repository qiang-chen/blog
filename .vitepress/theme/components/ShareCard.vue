<template>
  <div class="shareCard">
    <h1 class="title">
      <span class="shark-txt"> 玉麟 & 阿幺 </span>
    </h1>
    <p class="description">日常记录的博客</p>
  </div>
</template>

<script lang="ts" setup></script>
<style scoped>
.shareCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px;
  text-align: center;
}
.title {
  display: flex;
  align-items: center;
  font-size: 2.2em;
  font-family: "RZGFDHDHJ";
  /* font-weight: bold; */
}
.description {
  margin: 1em 0;
}

@keyframes shark-txt {
  form {
    background-position: -100%;
  }
  to {
    background-position: 200%;
  }
}

.shark-txt {
  height: 2rem;
  line-height: 2rem;
  -webkit-text-fill-color: transparent;
  background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0) 40%,
      rgba(255, 255, 255, 0.7),
      rgba(255, 255, 255, 0) 60%
    ) -100% / 50% no-repeat currentColor;
  -webkit-background-clip: text;
  animation: shark-txt 2s infinite;
}
</style>
