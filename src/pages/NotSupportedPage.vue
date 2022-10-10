<template>
  <article :class="$style.pageBackground">
    <div :class="$style.card">
      <header :class="$style.header">
        <!-- @svg("logo-login") -->
      </header>
      <div :class="$style.content">
        <h1 :class="$style.heading">
          Edmond web app is not supported in Internet Explorer browser
        </h1>
        <p :class="$style.disclaimer">
          For best performance, please install one of the following browsers
        </p>

        <ul :class="$style.browsers">
          <li :class="$style.browser">
            <a
              :class="$style.link"
              href="https://www.google.com/chrome/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <!-- @svg("chrome") -->
              <span :class="$style.browserName">Chrome</span>
            </a>
          </li>
          <li :class="$style.browser">
            <a
              :class="$style.link"
              href="https://www.mozilla.org/en-US/firefox/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <!-- @svg("firefox") -->
              <span :class="$style.browserName">Firefox</span>
            </a>
          </li>
          <li :class="$style.browser">
            <a
              :class="$style.link"
              href="https://www.apple.com/safari/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <!-- @svg("safari") -->
              <span :class="$style.browserName">Safari</span>
            </a>
          </li>
          <li :class="$style.browser">
            <a
              :class="$style.link"
              href="https://www.microsoft.com/en-us/edge"
              target="_blank"
              rel="noopener noreferrer"
            >
              <!-- @svg("edge") -->
              <span :class="$style.browserName">Edge</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </article>
</template>

<script>
  export default {};
</script>

<style lang="scss" module>
  @import 'utils';

  .page-background {
    @include public-page-bg;
  }

  .card {
    @include card;
    @include flex-center($flex-direction: column);

    width: 680px;
    height: 495px;

    color: $color-text-main;
  }

  .header {
    @include flex-center;

    margin-bottom: 57px;
  }

  .heading {
    line-height: 32px;

    margin-top: 0;
    margin-bottom: 18px;
  }

  .disclaimer {
    margin-bottom: 55px;
  }

  .content {
    max-width: 400px;
    text-align: center;
  }

  .browsers {
    display: flex;
    justify-content: space-between;

    padding: 0;
  }

  .browser {
    list-style-type: none;
    text-align: center;
  }

  .link {
    text-decoration: none;
    color: inherit;
  }

  .browser-name {
    font-weight: bold;

    display: block;
    margin-top: 15px;
  }
</style>
