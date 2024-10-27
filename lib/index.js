'use strict';

var _debounce = require('lodash/debounce');

class ScrollSnapControls {
    constructor(
        container,
        trackSelector = '[data-carousel-track]',
        itemSelector = '[data-carousel-item]',
        navNextSelector = '[data-carousel-nav-next]',
        navPreviousSelector = '[data-carousel-nav-previous]'
    ) {
        this.container = container;
        this.track = container.querySelector(trackSelector);
        this.items = Array.from(container.querySelectorAll(itemSelector));
        this.nextButtons = Array.from(container.querySelectorAll(navNextSelector));
        this.previousButtons = Array.from(container.querySelectorAll(navPreviousSelector));

        this.itemSelector = itemSelector;
    }

    init() {
        if (!this.track) return;
        if (this.items.length === 0) return;
        if (this.nextButtons.length === 0) return;
        if (this.previousButtons.length === 0) return;

        [this.currentItem] = this.items;

        this._initButtons();
    }

    _generateItemIds() {
        this.items.forEach((item, index) => {
            item.id = `carousel-item-${index}`;
        });
    }

    _initButtons() {
        this.nextButtons.forEach((button) => {
            button.addEventListener('click', () => {
                this._scrollToNextItem(this._getNextItem());
            });
        });

        this.previousButtons.forEach((button) => {
            button.addEventListener('click', () => {
                this._scrollToPreviousItem(this._getPreviousItem());
            });
        });

        this._toggleButtons();

        window.addEventListener(
            'resize',
            _debounce(() => {
                this._toggleButtons();
            }, 500)
        );
    }

    _toggleButtons() {
        const buttons = [...this.nextButtons, ...this.previousButtons];
        const itemsFullyInViewport = this._getItemsFullyInViewport();

        if (itemsFullyInViewport.length === this.items.length) {
            buttons.forEach((button) => button.classList.add('hidden'));
        } else {
            buttons.forEach((button) => button.classList.remove('hidden'));
        }
    }

    _scrollToNextItem(item) {
        if (item === this.items[0]) {
            this.track.scrollLeft = 0;
        } else {
            this.track.scrollLeft += this.currentItem.getBoundingClientRect().width;
        }

        this.currentItem = item;
    }

    _scrollToPreviousItem(item) {
        if (item === this.items[this.items.length - 1]) {
            this.track.scrollLeft = 99999999;
        } else {
            this.track.scrollLeft -= item.getBoundingClientRect().width;
        }

        this.currentItem = item;
    }

    _getNextItem() {
        const itemsFullyInViewport = this._getItemsFullyInViewport();

        if (itemsFullyInViewport.length === 0) {
            return this._getNextItemByIndex(this.items.indexOf(this.currentItem));
        }

        if (this.currentItem === this.items[this.items.length - 1]) {
            return this.items[0];
        }

        return this._getNextItemByIndex(
            this.items.findIndex((item) => item === itemsFullyInViewport[itemsFullyInViewport.length - 1])
        );
    }

    _getPreviousItem() {
        const itemsFullyInViewport = this._getItemsFullyInViewport();

        if (itemsFullyInViewport.length === 0) {
            return this._getPreviousItemById(this.items.indexOf(this.currentItem));
        }

        if (this.currentItem === this.items[0]) {
            return this.items[this.items.length - 1];
        }

        return this._getPreviousItemById(this.items.findIndex((item) => item === itemsFullyInViewport[0]));
    }

    _getNextItemByIndex(id) {
        if (id + 1 < this.items.length) {
            return this.items[id + 1];
        }

        return this.items[0];
    }

    _getPreviousItemById(id) {
        if (id - 1 >= 0) {
            return this.items[id - 1];
        }

        return this.items[this.items.length - 1];
    }

    _getItemsFullyInViewport() {
        return this.items.filter((item) => this._isFullyInViewport(item));
    }

    _isFullyInViewport(element) {
        const rect = element.getBoundingClientRect();
        const container = this.container.getBoundingClientRect();

        return rect.left >= 0 && rect.right <= container.width + container.left;
    }
}

const initScrollSnapControls = (containerSelector = '[data-carousel]') => {
    const containers = Array.from(document.querySelectorAll(containerSelector));

    containers.forEach((container) => {
        const scrollSnapControls = new ScrollSnapControls(container);

        scrollSnapControls.init();
    });
};

module.exports = initScrollSnapControls;
