'use strict';

var _debounce = require('lodash/debounce');

/**
 * @class ScrollSnapControls
 * @classdesc Adds scroll snapping controls to a container.
 * @param {HTMLElement} container - The container element.
 * @param {Object} options - The options object.
 * @param {string} options.trackSelector - The selector for the track element.
 * @param {string} options.itemSelector - The selector for the item elements.
 * @param {string} options.controlAttribute - The attribute for the control elements.
 */
class ScrollSnapControls {
    constructor(container, options = {}) {
        this.container = container;

        this.trackSelector = options.trackSelector || '[data-ssc-track]';
        this.itemSelector = options.itemSelector || '[data-ssc-item]';
        this.controlAttribute = options.controlAttribute || 'data-ssc-control';

        this.track = container.querySelector(this.trackSelector);
        this.items = Array.from(container.querySelectorAll(this.itemSelector));
        this.controls = Array.from(container.querySelectorAll(`[${this.controlAttribute}]`));

        this.currentItem = null;
    }

    init() {
        try {
            if (!this.track) {
                throw new Error('No track found');
            }

            if (this.items.length === 0) {
                throw new Error('No items found');
            }

            if (this.controls.length === 0) {
                throw new Error('No controls found');
            }
        } catch (error) {
            return console.error(error);
        }

        this._setInitialCurrentItem();

        this._handleControls();

        return 0;
    }

    _handleControls() {
        this.controls.forEach((control) => {
            const attribute = control.getAttribute(this.controlAttribute);
            const actions = {
                '>': () => this._next(),
                '<': () => this._previous(),
            };

            if (actions[attribute]) {
                control.addEventListener('click', actions[attribute]);
            } else {
                console.error(`Invalid attribute '${attribute}' on control element:\n ${control.outerHTML}`);
            }
        });

        this._toggleControls();
        this._toggleControlsOnResize();
    }

    _toggleControls() {
        const itemsFullyInContainer = this._getItemsFullyInContainer();

        if (itemsFullyInContainer.length === this.items.length) {
            this.controls.forEach((control) => control.classList.add('hidden'));
        } else {
            this.controls.forEach((control) => control.classList.remove('hidden'));
        }
    }

    _toggleControlsOnResize() {
        window.addEventListener(
            'resize',
            _debounce(() => {
                this._toggleControls();
            }, 500)
        );
    }

    _next() {
        const item = this._getNextItem();

        if (item === this.items[0]) {
            this.track.scrollLeft = 0;
        } else {
            this.track.scrollLeft += this.currentItem.getBoundingClientRect().width;
        }

        this.currentItem = item;
    }

    _previous() {
        const item = this._getPreviousItem();

        if (item === this.items[this.items.length - 1]) {
            this.track.scrollLeft = 99999999;
        } else {
            this.track.scrollLeft -= item.getBoundingClientRect().width;
        }

        this.currentItem = item;
    }

    _getNextItem() {
        const itemsFullyInContainer = this._getItemsFullyInContainer();

        if (itemsFullyInContainer.length === 0) {
            return this._getNextItemByIndex(this.items.indexOf(this.currentItem));
        }

        if (this.currentItem === this.items[this.items.length - 1]) {
            return this.items[0];
        }

        return this._getNextItemByIndex(
            this.items.findIndex((item) => item === itemsFullyInContainer[itemsFullyInContainer.length - 1])
        );
    }

    _getPreviousItem() {
        const itemsFullyInContainer = this._getItemsFullyInContainer();

        if (itemsFullyInContainer.length === 0) {
            return this._getPreviousItemByIndex(this.items.indexOf(this.currentItem));
        }

        if (this.currentItem === this.items[0]) {
            return this.items[this.items.length - 1];
        }

        return this._getPreviousItemByIndex(this.items.findIndex((item) => item === itemsFullyInContainer[0]));
    }

    _getNextItemByIndex(index) {
        if (index + 1 < this.items.length) {
            return this.items[index + 1];
        }

        return this.items[0];
    }

    _getPreviousItemByIndex(index) {
        if (index - 1 >= 0) {
            return this.items[index - 1];
        }

        return this.items[this.items.length - 1];
    }

    _getItemsFullyInContainer() {
        return this.items.filter((item) => this._isFullyInContainer(item));
    }

    // TODO: How to make API more explicit, so it's clear that these calculations are done on the container,
    // not on the viewport?
    _isFullyInContainer(element) {
        const rect = element.getBoundingClientRect();
        const container = this.container.getBoundingClientRect();

        return rect.left >= 0 && rect.right <= container.width + container.left;
    }

    _setInitialCurrentItem() {
        [this.currentItem] = this.items;
    }
}

module.exports = ScrollSnapControls;
