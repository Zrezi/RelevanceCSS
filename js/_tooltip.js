class Tooltip {
    constructor(element) {
        this.element = element;
        this.id = this.element.getAttribute('id');
        this.displayText = this.element.getAttribute('rlv-tooltip');

        let span = document.createElement('span');
        span.appendChild(document.createTextNode(this.displayText));

        this._tooltip = document.createElement('div');
        this._tooltip.classList.add('rlv-tooltip');
        this._tooltip.appendChild(span);
        document.body.appendChild(this._tooltip);
        
        let styles = window.getComputedStyle(this._tooltip);
        let padding = parseInt(styles.getPropertyValue('padding-right')) + parseInt(styles.getPropertyValue('padding-left'));

        console.log(this.element.offsetWidth);

        this._tooltip.style.width = `${this.element.offsetWidth - padding}px`;
        
        let bounds = this.element.getBoundingClientRect();
        this._tooltip.style.left = `${bounds.left}px`;
        this._tooltip.style.top = `${bounds.bottom}px`;

        this.element.addEventListener('pointerover', (e) => {
            this._tooltip.style.opacity = '1';
            this._tooltip.style.top = `${bounds.bottom + 10}px`;
        });
        this.element.addEventListener('pointerout', (e) => {
            this._tooltip.style.opacity = '0';
            this._tooltip.style.top = `${bounds.bottom}px`;
        });
    }
}

class TooltipManager {
    constructor() {
        this._tooltips = [];
        let tooltips = document.getElementsByClassName('rlv-has-tooltip');
        for (var i = 0; i < tooltips.length; i++) {
            this.append(new Tooltip(tooltips[i]));
        }
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