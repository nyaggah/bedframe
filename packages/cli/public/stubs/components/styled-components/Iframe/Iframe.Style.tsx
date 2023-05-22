import styled from 'styled-components/macro'
import Frame from 'react-frame-component'
import { IntroAnimation } from '@/styles'

const Iframe = styled(Frame)`
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

  --iframe-intro-animation: ${IntroAnimation} 0.2s 0.1s forwards
    cubic-bezier(0.2, 0.8, 0.2, 1);

  border: var(--border);
  width: var(--iframe-width);
  font-family: var(--sans-serif);
  opacity: var(--iframe-opacity);
  min-width: var(--iframe-min-width);
  max-width: var(--iframe-max-width);
  min-height: var(--iframe-min-height);
  box-shadow: var(--iframe-box-shadow);
  animation: var(--iframe-intro-animation);
  border-radius: var(--iframe-border-radius);
  background: var(--iframe-background-color);
  pointer-events: auto; // in case we have no pointer-events on the overlay, revert to back here
  z-index: var(--iframe-z-index);
`

export const Styled = {
  Iframe,
}
