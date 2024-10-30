# Scroll snap controls

Adding controls to scroll snap carousels.

_Docs under construction_

## Installation

```bash
npm i @thinktomorrow/scroll-snap-controls
```

## Usage

```js
import ScrollSnapControls from '@thinktomorrow/scroll-snap-controls';

const carouselControls = new ScrollSnapControls(document.getElementById('best-carousel-ever'));
carouselControls.init();
```

## Options

```js
const container = document.getElementById('best-carousel-ever');
const defaultOptions = {
    trackSelector: '[data-ssc-track]',
    itemSelector: '[data-ssc-item]',
    controlAttribute: 'data-ssc-control',
});

const carouselControls = new ScrollSnapControls(container, defaultOptions);
```

-   `trackSelector` (string): The selector for the track element. Defaults to `[data-ssc-track]`.
-   `itemSelector` (string): The selector for the item elements. Defaults to `[data-ssc-item]`.
-   `controlAttribute` (string): The attribute for the control elements. Defaults to `data-ssc-control`.

## Controls

Controls are elements that have a `controlAttribute`.

The attribute can be set to `<` or `>` to indicate the direction of the control.

```html
<button type="button" data-ssc-control="<">Go to previous item</button>
<button type="button" data-ssc-control=">">Go to next item</button>
```

## Extending

Still kinda rough at the moment, but you can extend the class to add your own functionality. For example to add an autoplay feature:

```js
class ExtendedScrollSnapControls extends ScrollSnapControls {
    constructor(container, options) {
        super(container, options);

        this.autoplayAttribute = 'data-ssc-autoplay';
    }

    _init() {
        super._init();

        this._handleAutoplay();
    }

    _handleAutoplay() {
        if (this.track.hasAttribute(this.autoplayAttribute)) {
            let autoplayPaused = false;

            setInterval(() => {
                if (!autoplayPaused) {
                    this._next();
                }
            }, parseInt(this.track.getAttribute(this.autoplayAttribute), 10) || 5000);

            this.track.addEventListener('mouseenter', () => {
                autoplayPaused = true;
            });

            this.track.addEventListener('mouseleave', () => {
                autoplayPaused = false;
            });
        }
    }
}

const carouselControls = new ExtendedScrollSnapControls(document.getElementById('best-carousel-ever'));
carouselControls.init();
```
