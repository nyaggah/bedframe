import { createGlobalStyle } from 'styled-components/macro'
import { IntroAnimation } from './Utility.Style'

const GlobalStyles = createGlobalStyle`
/* @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap'); */
/* cyrillic-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa0ZL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2ZL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+1F00-1FFF;
}
/* greek */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1pL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0370-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2pL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa25L7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa0ZL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2ZL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+1F00-1FFF;
}
/* greek */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1pL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0370-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2pL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa25L7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa0ZL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2ZL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+1F00-1FFF;
}
/* greek */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1pL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0370-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2pL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa25L7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa0ZL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2ZL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+1F00-1FFF;
}
/* greek */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1pL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0370-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2pL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa25L7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa0ZL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2ZL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+1F00-1FFF;
}
/* greek */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1pL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0370-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2pL7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa25L7W0Q5n-wU.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}



:root {
  /* 
    // Layout
    // --------------------------------------- 
    */
  --max-layout-width: 1200px;
  
  /* 
    // Iframe 
    // --------------------------------------- 
    */
  --iframe-background-color: #fff;
  
  --iframe-opacity: 0; // initial opacity

  --iframe-width: 600px;
  --iframe-min-width: 600px;
  --iframe-max-width: 960px;
  
  --iframe-height: 80vh;
  --iframe-min-height: 80vh;
  --iframe-max-height: 80vh;

  --iframe-border-radius: 12px;
  --iframe-z-index: 9999999;
  --iframe-box-shadow: 0 1px 1px hsl(0deg 0% 0% / 0.075),
    0 2px 2px hsl(0deg 0% 0% / 0.075), 0 4px 4px hsl(0deg 0% 0% / 0.075),
    0 8px 8px hsl(0deg 0% 0% / 0.075), 0 16px 16px hsl(0deg 0% 0% / 0.075);

  --iframe-intro-animation: ${IntroAnimation} 0.2s 0.1s forwards cubic-bezier(0.2, 0.8, 0.2, 1);

  /* 
    // Colors
    // --------------------------------------- 
    */
  --primary-color: #212121;
  --secondary-color: #8795a2;
  --highlight-color: var(--brand-purp);
  --background-color: #fff;

  /* 
    // Elements
    // --------------------------------------- 
    */
  --border-color: #e9ebee;
  --border-style: solid;
  --border-width: 1px;
  --border-radius: 0;

  --border: var(--border-width) var(--border-style) var(--border-color);
  /* 
    // Hyperlinks
    // --------------------------------------- 
    */
  --hyperlink-color: #7a46fc;
  --brand-purp: #7a46fc;

  /* 
    // Buttons
    // --------------------------------------- 
    */
  --btn-bg-color: #5b5d5f;
  --btn-bg-color-primary: #53d3d8;
  --btn-bg-color-positive: #5fcf80;
  --btn-bg-color-negative: #6fc;
  --btn-bg-color-neutral: #5b5d5f;

  /* 
    // ---------------------------------------
    // --------------------------------------- 
    // TYPOGRAPHY
    // ---------------------------------------
    // --------------------------------------- 
    */
  /* 
    // Define: Sans Serif Font families
    // --------------------------------------- 
    */
  --inter: 'Inter';
  --system: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI';
  /* system-ui, -apple-system, BlinkMacSystemFont, */
  --helvetica: 'Helvetica Neue', Helvetica;
  --lato: 'Lato';

  /* 
    // Define: Serif Font families
    // --------------------------------------- 
    */
  --lora: 'Lora';
  --baskerville: 'Libre Baskerville';

  /* 
    // Define: Slab Serif font families
    // --------------------------------------- 
    */
  --adelle: 'adelle';

  /* 
    // Define: Monospaced Font families
    // --------------------------------------- 
    */
  --pt-mono: 'PT Mono';

  /* 
    // Define: Font Stacks
    // --------------------------------------- 
    */
  --sans-serif: var(--inter), var(--system), var(--helvetica), sans-serif;
  --serif: var(--lora), Georgia, 'Times New Roman', Times, serif;
  --monospace: Courier, var(--pt-mono), Monaco, Consolas, 'Andale Mono',
    'DejaVu Sans Mono', monospace;

  /* 
    // Define: Font Sizes
    // --------------------------------------- 
    */
  --font-size: 0.875em;
  /* 14px; //1em; // 16px */
  --line-height: calc(var(--font-size) * 1.5);
  /* 1.6em; //--font-size * 1.5; */
  /* --unitless-line-height:   calc(var(--line-height) / (var(--line-height) * 0 + 1)); // Strip units from line-height: https://developer.mozilla.org/en-US/docs/Web/CSS/line-height#Prefer_unitless_numbers_for_line-height_values */
  /* --unitless-line-height:   calc(1.5 * 1.1); */
  --unitless-line-height: calc(var(--line-height) * 1.1);
  --vertical-spacing: 0.5em;

  /* 
    // Heading Font Sizes
    // --------------------------------------- 
    */
  --h1-font-size: calc(var(--font-size) * 2.25);
  --h2-font-size: calc(var(--font-size) * 1.5);
  --h3-font-size: calc(var(--font-size) * 1.15);
  --h4-font-size: calc(var(--font-size) * 1.05);
  --h5-font-size: var(--font-size);
  --h6-font-size: var(--font-size);

  /* 
    // Forms
    // --------------------------------------- 
    */
  --input-background: var(--background-color);
  --input-border: var(--border-color);

  /* 
    // Presentation
    // --------------------------------------- 
    */
  --box-shadow: rgb(0 0 0 / 12%) 0px 1px 1px 0px,
    rgb(61 59 53 / 16%) 0px 0px 0px 1px, rgb(61 59 53 / 8%) 0px 2px 5px 0px;


    /* @media (prefers-color-scheme: dark) {
      body {
        filter: invert(1) hue-rotate(180deg) !important;
        background-color: rgb(30, 30, 30) !important;
      }
    }      */
}



// --------------------------------------------

html {
  height: 100%;
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
}

html,
button,
input,
select,
textarea {
  color: var(--primary-color);
}  


html,
body {
  font-family: var(--sans-serif);
  font-size: var(--font-size);
  line-height: var(--line-height);

  /* @media (prefers-color-scheme: dark) {
    filter: invert(1) hue-rotate(180deg);
    background-color: rgb(30, 30, 30);
  }   */
  &.dark-mode {
    @media (prefers-color-scheme: dark) {
      filter: invert(1) hue-rotate(180deg);
      background-color: rgb(30, 30, 30);
    }  
    /* filter: invert(100%); */
    /* filter: invert(1) hue-rotate(180deg);
    background-color: rgb(30, 30, 30);     */
    /* img {
      filter: invert(100%);
    } */
  }
}


/**
// ------------------------------------------
// Boilerplate: Text selection Boilerplate
// ------------------------------------------
*/
::selection {
  background: var(--brand-purp);
  color: var(--selection-color, #fff);
}

/**
// ------------------------------------------
// Boilerplate: thematic tags
// ------------------------------------------
*/
hr {
  border-bottom: 1px solid var(--border-color);
  border-left: none;
  border-right: none;
  border-top: none;
  margin: var(--line-height) 0;
}

/**
// ------------------------------------------
// Boilerplate: Media elements
// ------------------------------------------
*/
audio,
canvas,
img,
video {
  vertical-align: middle;
}


/**
// ------------------------------------------
// Boilerplate: Tables
// ------------------------------------------
*/
table {
  border-collapse: collapse;
  margin: calc(var(--line-height) / 2) 0;
  table-layout: fixed;
  width: 100%;
}

th {
  border-bottom: var(--border-width) solid lighten(var(--border-color), 15%);
  font-weight: bold;
  padding: calc(var(--line-height) / 2) 0;
  text-align: left;
}

td {
  border-bottom: var(--border-width) solid lighten(var(--border-color), 15%);
  padding: calc(var(--line-height) / 2) 0;
}

tr,
td,
th {
  vertical-align: middle;
}  

/**
// ------------------------------------------
// Boilerplate: Links
// ------------------------------------------
*/
a {
  color: var(--hyperlink-color);
  cursor: pointer;
  text-decoration: none;
}

a:hover,
a:active {
  /*color: fade-out(var(--hyperlink-color), .25); */
  text-decoration: none;
}

a img {
  border: 0;
  /* transition: all, 0.25s, ease-in-out; */
  /*&:hover {
    border-color: fade-out(var(--primary-color), .2); 
  }*/
}

/*
// ------------------------------------------
// Boilerplate: Images
// ------------------------------------------
*/
img {
  max-width: 100%;
  height: auto;
}

b,
bold {
  font-weight: bold;
}


/*
// ::::::::::::::::::::::::::::::::::::::::::
// ::::::::::::::::::::::::::::::::::::::::::
// Site-wide typography basics
// ::::::::::::::::::::::::::::::::::::::::::
// ::::::::::::::::::::::::::::::::::::::::::
*/

/**
// ------------------------------------------
// TYPOGRAPHY: HEADINGS (GENERAL)
// ------------------------------------------
*/
h1,
h2,
h3,
h4,
h5,
h6 {
  line-height: var(--line-height);
  margin: 0 0 0.2em 0;
  padding: 0;
  text-rendering: optimizeLegibility;
  /*// Fix the character spacing for headings*/
}

h1 {
  font-size: var(--h1-font-size);
}

h2 {
  font-size: var(--h2-font-size);
}

h3 {
  font-size: var(--h3-font-size);
}

h4 {
  font-size: var(--h4-font-size);
}

h5 {
  font-size: var(--h5-font-size);
}

h6 {
  font-size: var(--h6-font-size);
}



/**
// ------------------------------------------
// TYPOGRAPHY: PARAGRAPHS (GENERAL)
// ------------------------------------------
*/
p {
  margin: 0 0 1rem;
  /*var(--line-height);*/
  word-wrap: break-word;
  word-break: break-word;
}


/**
// ------------------------------------------
// TYPOGRAPHY: BLOCKQUOTES (GENERAL)
// ------------------------------------------
*/
blockquote {
  margin: var(--line-height) 0;
  padding: 0 var(--line-height);
  /*border-left: 5px solid lighten(var(--primary-color), 90);*/
}

blockquote cite {
  /*color: lighten(var(--primary-color), 35);*/
  display: block;
}


/**
// ------------------------------------------
// TYPOGRAPHY: PRE & CODE (GENERAL)
// ------------------------------------------
*/
code {
  background: #f9f9f9;
  font-family: var(--monospace);
  font-size: 90%;
  padding: 0.5em;
}

pre {
  word-wrap: normal;
}

pre code {
  display: block;
  white-space: pre;
}






// ------------------------------------------------
body {
  background: var(--background-color);
  color: var(--primary-color);
  font-family: var(--sans-serif);
  font-size: var(--font-size);
  line-height: var(--unitless-line-height);
  -webkit-font-smoothing: antialiased;
  margin: 0;
  padding: 0;
  height: 100%; 
}

.frame-root {
  height: 100%;
  .frame-content {
    height: 100%;
  }
}

h1 {
  font-family: var(--sans-serif);
  border: var(--border);
}


`
export default GlobalStyles
