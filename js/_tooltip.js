class Tooltip {
    constructor(element, position) {
        this.element = element;
        this.id = this.element.getAttribute('id');
        this.displayText = this.element.getAttribute('rlv-tooltip-text');

        this.setPosition(position);

        let span = document.createElement('span');
        span.appendChild(document.createTextNode(this.displayText));

        this._tooltip = document.createElement('div');
        this._tooltip.classList.add('rlv-tooltip');
        this._tooltip.appendChild(span);
        document.body.appendChild(this._tooltip);
        
        let styles = window.getComputedStyle(this._tooltip);
        this.padding = parseInt(styles.getPropertyValue('padding-right')) + parseInt(styles.getPropertyValue('padding-left'));

        let tooltipWidth = Math.max(this.element.offsetWidth - this.padding, 100);
        this._tooltip.style.width = `${tooltipWidth}px`;
        this.dimensions = {
            width: (Math.abs(this.element.offsetWidth - tooltipWidth - this.padding)),
            height: parseInt(styles.getPropertyValue('height'))
        };

        this._reposition();

        this.element.addEventListener('pointerover', (e) => {
            this._tooltip.style.opacity = '1';
            switch (this.position) {
                case 'left':
                    this._tooltip.style.left = `${this.x - 10}px`;
                    break;
                case 'right':
                    this._tooltip.style.left = `${this.x + 10}px`;
                    break;
                case 'above':
                    this._tooltip.style.top = `${this.y - 10}px`;
                    break;
                case 'below':
                    this._tooltip.style.top = `${this.y + 10}px`;
                    break;
                default:
                    break;
            }
        });
        this.element.addEventListener('pointerout', (e) => {
            this._tooltip.style.opacity = '0';
            this._tooltip.style.left = `${this.x}px`;
            this._tooltip.style.top = `${this.y}px`;
        });
        this._instantiated = true;
        
    }
    _reposition() {
        let bounds = this.element.getBoundingClientRect();
        switch (this.position) {
            case 'left':
                this.x = bounds.left - this.dimensions.width - this.element.offsetWidth;
                this.y = bounds.top - (Math.abs(this.element.offsetHeight - this.dimensions.height - this.padding)) / 2
                break;
            case 'right':
                this.x = bounds.right;
                this.y = bounds.top - (Math.abs(this.element.offsetHeight - this.dimensions.height - this.padding)) / 2;
                break;
            case 'above':
                this.x = bounds.left - this.dimensions.width / 2;
                this.y = bounds.top - (Math.abs(this.element.offsetHeight - this.dimensions.height - this.padding)) - this.element.offsetHeight;
                break;
            default:
                this.x = bounds.left - this.dimensions.width / 2;
                this.y = bounds.bottom;
                break;
        }
        this._tooltip.style.left = `${this.x}px`;
        this._tooltip.style.top = `${this.y}px`;
    }
    setPosition(position) {
        this.position = position;
        if (this.position) {
            if (['above', 'below', 'left', 'right'].includes(this.position)) {
                if (this._instantiated) this._reposition();
                return;
            } else {
                this.position = 'below';
            }
        } else {
            this.position = this.element.getAttribute('rlv-tooltip-position');
            if (this.position) {
                this.position = this.position.toLowerCase();
            } else {
                this.position = 'below';
            }
        }
        if (this._instantiated) this._reposition();
    }
}

class TooltipManager {
    constructor(options) {
        this._tooltips = [];
        let tooltips = document.getElementsByClassName('rlv-tooltipped');
        for (var i = 0; i < tooltips.length; i++) {
            let _el = tooltips[i];
            let _id = _el.getAttribute('id');
            if (options && _id && options[_id]) {
                this.append(new Tooltip(_el, options[_id]));
                continue;
            }
            this.append(new Tooltip(_el));
        }

        window.addEventListener('resize', () => {
            for (var i = 0; i < this._tooltips.length; i++) {
                this._tooltips[i]._reposition();
            }
        });
    }
    append(tooltip) {
        this._tooltips.push(tooltip);
    }
    getTooltipById(id) {
        let filtered = this._tooltips.filter(tooltip => tooltip.id == id);
        if (!filtered.length) throw new Error(`Could not find Tooltip of ID = ${id}`);
        return filtered[0];
    }
    getTooltips() {
        return this._tooltips;
    }
}