<template>
  <div>
    <header :class="$style.header">
      <div :class="$style.tab">
        <div>
          <IconPDF />
          <h4>PDF Preview</h4>
        </div>
        <IconMinus @click="onMinimizeClick" />
      </div>

      <section v-show="!isLoading" :class="$style.subHeader">
        <ButtonGhost
          :class="$style.buttonDownload"
          text="Download PDF"
          :is-loading="isDownloading"
          @click="downloadPDF"
        >
          <template #icon>
            <IconDownload />
          </template>
        </ButtonGhost>
      </section>
    </header>
    <AppLoader
      v-show="isLoading"
      :class="$style.loader"
      loading-text="Generating PDF..."
    />

    <div v-show="!isLoading" id="pageContainer" :class="$style.viewerWrapper">
      <div id="viewer" class="pdfViewer" :class="$style.viewer"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    Vue,
    Component,
    Emit,
    Prop,
    Watch,
    Ref
  } from 'vue-property-decorator';

  import { uniqueId } from 'lodash';

  import IconPDF from '@/assets/images/icons/Misc/ic-24-PDF.svg';
  import IconMinus from '@/assets/images/icons/widget-operators/minus.svg';
  import IconClose from '@/assets/images/icons/close-2px.svg';
  import IconDownload from '@/assets/images/icons/Misc/ic-24-download-2px.svg';

  import ButtonGhost from '@/components/buttons/ButtonGhost.vue';

  import pdfjsLib from 'pdfjs-dist/build/pdf';
  import { PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
  import 'pdfjs-dist/web/pdf_viewer.css';
  import AppLoader from '@/components/app/AppLoader.vue';

  // pdfjsLib.GlobalWorkerOptions.workerSrc =
  //   '../../../node_modules/pdfjs-dist/build/pdf.worker';
  // 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.2.228/build/pdf.worker.min.js';

  @Component({
    components: {
      AppLoader,
      ButtonGhost,
      IconPDF,
      IconMinus,
      IconClose,
      IconDownload
    }
  })
  export default class PdfPreview extends Vue {
    @Prop({
      type: ArrayBuffer
    })
    readonly pdfSource: ArrayBuffer;

    @Prop({
      type: Boolean
    })
    readonly isLoading: boolean;

    @Prop({
      type: Boolean
    })
    readonly isDownloading: boolean;

    id = uniqueId();
    pdfViewer = null;

    @Emit('minimize')
    onMinimizeClick() {
      return;
    }

    @Emit('download')
    downloadPDF() {
      return;
    }

    @Watch('pdfSource')
    async onPdfSourceChange(pdfSource) {
      if (!pdfSource) {
        return;
      }

      const loadingTask = pdfjsLib.getDocument(this.pdfSource);
      const pdf = await loadingTask.promise;

      this.pdfViewer.setDocument(pdf);
    }

    async mounted() {
      await this.$nextTick();

      const container = document.getElementById('pageContainer');
      this.pdfViewer = new PDFViewer({
        container: container
      });
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';
  .header {
    @include column;

    position: sticky;
    top: 0;
    z-index: 1;

    .tab {
      @include row;
      justify-content: space-between;
      background-color: $color-bg-primary-dark;
      color: $color-bg-light;

      padding: 10px 24px;

      h4 {
        margin: 0;
      }

      div {
        @include row;
        align-items: center;
      }

      div > * + * {
        margin-left: 8px;
      }

      > svg {
        cursor: pointer;
      }
    }
  }

  .sub-header {
    padding: 16px 24px;

    border-bottom: 1px solid $color-border-main-light;

    background-color: $color-bg-main-dimmed;
  }

  .button-download {
    margin-left: auto;

    width: 142px;
    height: 40px;
  }

  .viewer-wrapper {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);

    padding: 24px 80px;

    :global(.page) {
      border: none;
      box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
    }

    :global(.page) + :global(.page) {
      margin-top: 24px;
    }
  }

  .loader {
    height: auto;
    margin-top: 164px;
  }
</style>
