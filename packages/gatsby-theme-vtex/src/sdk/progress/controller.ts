import progress, { NProgressOptions } from 'nprogress'

interface SetupOptions extends Partial<NProgressOptions> {
  color: string
}

const getStyles = (color: string) => `
#nprogress {
 pointer-events: none;
}
#nprogress .bar {
  background: ${color};
  position: fixed;
  z-index: 1031;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
}
#nprogress .peg {
  display: block;
  position: absolute;
  right: 0px;
  width: 100px;
  height: 100%;
  box-shadow: 0 0 10px ${color}, 0 0 5px ${color};
  opacity: 1.0;
  -webkit-transform: rotate(3deg) translate(0px, -4px);
  -ms-transform: rotate(3deg) translate(0px, -4px);
  transform: rotate(3deg) translate(0px, -4px);
}
#nprogress .spinner {
  display: block;
  position: fixed;
  z-index: 1031;
  top: 15px;
  right: 15px;
}
#nprogress .spinner-icon {
  width: 18px;
  height: 18px;
  box-sizing: border-box;
  border: solid 2px transparent;
  border-top-color: ${color};
  border-left-color: ${color};
  border-radius: 50%;
  -webkit-animation: nprogress-spinner 400ms linear infinite;
  animation: nprogress-spinner 400ms linear infinite;
}
.nprogress-custom-parent {
  overflow: hidden;
  position: relative;
}
.nprogress-custom-parent #nprogress .spinner,
.nprogress-custom-parent #nprogress .bar {
  position: absolute;
}
@-webkit-keyframes nprogress-spinner {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes nprogress-spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
`

let once = true

export const setup = (options: SetupOptions) => {
  if (once) {
    const styles = getStyles(options.color)
    const node = document.createElement(`style`)

    node.id = `nprogress-styles`
    node.innerHTML = styles
    document.head.appendChild(node)

    progress.configure(options)
    once = false
  }

  return progress
}

export type NProgress = typeof progress
