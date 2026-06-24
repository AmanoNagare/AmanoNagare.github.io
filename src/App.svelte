<script lang="ts">
  import { Marked } from 'marked';
  import { blogNetwork } from './data/blogNetwork';

  const marked = new Marked();

  // 初期起動時のページID
  let currentId = $state("entrance");
  
  let currentPage = $derived(blogNetwork[currentId]);
  
  // 文字の入っていない完全な空行を自動的に特大余白のパーツに置換
  let renderedContent = $derived(
    currentPage?.content 
      ? (marked.parse(currentPage.content.replace(/^\s*$/gm, '<div class="cosmic-line-gap"></div>')) as string)
      : ""
  );

  function navigateTo(id: string) {
    currentId = id;
  }
</script>

<main class="cosmos-container">
  <section class="side-column">
    <div class="safe-cosmic-zone">
      {#key currentId}
        {#if currentPage?.leftLinks}
          {#each currentPage.leftLinks as link (link.id)}
            {#if blogNetwork[link.id]}
              <div class="paper-position-mover" style="left: {link.x}%; top: {link.y}%; --speed: {link.speed}s;">
                <div class="paper-rotator" style="--base-rot: {link.r}deg; --rot-speed: {link.rotSpeed}s; --rot-dir: {link.dir};">
                  <button class="floating-paper" onclick={() => navigateTo(link.id)} aria-label="Navigate to hidden page"></button>
                </div>
              </div>
            {/if}
          {/each}
        {/if}
      {/key}
    </div>
  </section>

  <section class="center-content">
    {#key currentId}
      {#if currentPage}
        <article class="main-paper-sheet">
          <h1 class="paper-title">{currentPage.title}</h1>
          <div class="paper-body-content">
            {@html renderedContent}
          </div>
        </article>
      {:else}
        <article class="main-paper-sheet">
          <h1 class="paper-title">404</h1>
          <div class="paper-body-content">
            <p>言葉の断片が見つかりませんでした。別の紙を手繰り寄せてください。</p>
          </div>
        </article>
      {/if}
    {/key}
  </section>

  <section class="side-column">
    <div class="safe-cosmic-zone">
      {#key currentId}
        {#if currentPage?.rightLinks}
          {#each currentPage.rightLinks as link (link.id)}
            {#if blogNetwork[link.id]}
              <div class="paper-position-mover" style="left: {link.x}%; top: {link.y}%; --speed: {link.speed}s;">
                <div class="paper-rotator" style="--base-rot: {link.r}deg; --rot-speed: {link.rotSpeed}s; --rot-dir: {link.dir};">
                  <button class="floating-paper" onclick={() => navigateTo(link.id)} aria-label="Navigate to hidden page"></button>
                </div>
              </div>
            {/if}
          {/each}
        {/if}
      {/key}
    </div>
  </section>
</main>

<style>
  .cosmos-container {
    position: fixed;
    top: 0;
    left: 0;
    display: grid;
    grid-template-columns: 1fr 68vw 1fr;
    width: 100vw;
    height: 100vh;
    background-color: #090d16;
    color: #2b2b2b;
    font-family: 'Georgia', 'Noto Serif JP', serif;
    overflow: hidden;
    margin: 0;
    padding: 0;
    z-index: 9999;
  }

  .side-column {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .safe-cosmic-zone {
    position: absolute;
    left: 20px;
    right: 20px;
    top: 40px;
    bottom: 40px;
  }

  .center-content {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    height: 100vh;
    box-sizing: border-box;
  }

  .main-paper-sheet {
    background-color: #fcfaf2;
    color: #1a1a1a;
    border: none;
    border-radius: 2px;
    padding: 50px 70px;
    width: 100%;
    height: auto;
    max-height: 94vh;
    overflow-y: auto;
    box-shadow: 
      0 35px 80px rgba(0, 0, 0, 0.7), 
      0 2px 20px rgba(0, 0, 0, 0.25);
    box-sizing: border-box;
  }

  .main-paper-sheet::-webkit-scrollbar {
    width: 8px;
  }
  .main-paper-sheet::-webkit-scrollbar-thumb {
    background: #e2dfd5;
    border-radius: 4px;
  }

  .paper-title {
    font-size: 38px; 
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 40px;
    color: #000000;
    border-bottom: 4px solid #e2dfd5;
    padding-bottom: 20px;
    line-height: 1.3;
  }

  .paper-body-content :global(p) {
    font-size: 18px; 
    line-height: 1.9;
    margin-bottom: 32px;
    text-align: justify;
    letter-spacing: 0.03em;
    white-space: pre-wrap; 
  }

  .paper-body-content :global(h3) {
    font-size: 24px; 
    margin-top: 48px;
    margin-bottom: 20px;
    color: #111111;
    font-weight: 600;
  }

  .paper-body-content :global(ul) {
    padding-left: 32px;
    margin-bottom: 32px;
  }

  .paper-body-content :global(li) {
    font-size: 18px;
    margin-bottom: 12px;
    line-height: 1.7;
    white-space: pre-wrap;
  }

  .paper-body-content :global(blockquote) {
    margin: 40px 0;
    padding-left: 24px;
    border-left: 8px solid #d3cfc2;
    color: #444444;
    font-style: italic;
  }

  .paper-body-content :global(img) {
    width: 100%;
    height: auto;
    border-radius: 2px;
    margin: 40px 0;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  }

  .paper-body-content :global(code) {
    font-family: monospace;
    background-color: #f3f0e7;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 15px;
  }

  /* 空行1行につき、画面の高さの 6% 分（6vh）の巨大な虚空を自動マウント */
  .paper-body-content :global(.cosmic-line-gap) {
    display: block;
    height: 6vh; 
    width: 100%;
    content: "";
  }

  .paper-position-mover {
    position: absolute;
    translate: -50% -50%;
    animation: float var(--speed) ease-in-out infinite;
  }

  .paper-rotator {
    display: block;
    animation: cosmic-rot var(--rot-speed) linear infinite;
  }

  .floating-paper {
    background-color: #fcfaf2;
    border: none;
    border-radius: 1px;
    width: 100px;
    height: 140px;
    cursor: pointer;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.55);
    display: block;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s;
  }

  .floating-paper:hover {
    transform: scale(1.06);
    box-shadow: 0 12px 45px rgba(0, 0, 0, 0.85);
    background-color: #ffffff;
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }

  @keyframes cosmic-rot {
    0% { rotate: var(--base-rot); }
    100% { rotate: calc(var(--base-rot) + (360deg * var(--rot-dir))); }
  }
</style>
