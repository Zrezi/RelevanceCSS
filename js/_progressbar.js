class ProgressBar {
    constructor(element) {
        this.element = element;
        this.id = this.element.getAttribute('id');
        this.width = 0;

        let inner = document.createElement('div');
        inner.classList.add('rlv-progress-inner');
        this.element.appendChild(inner);
        this.element.children[0].style.width = `${this.width}%`;

        if (this.element.classList.contains('showtext')) {
            let span = document.createElement('span');
            span.classList.add('rlv-progress-text');
            span.appendChild(document.createTextNode(`${this.width}%`));
            this.element.children[0].appendChild(span);
            this.displayText = span;
            if (this.width > 0) this.displayText.style.display = 'block';
        }
    }
    setProgress(value) {
        this.width = value % 101;
        this.element.children[0].style.width = `${this.width}%`;

        if (this.displayText) {
            this.displayText.style.display = (this.width == 0) ? 'none' : 'block';
            if (this.width > 0) {
                this.displayText.innerHTML = `${this.width}%`;
            }
        }
    }
    getProgress() {
        return this.width;
    }
}

class ProgressBarManager {
    constructor() {
        this._bars = [];
        let _bars = document.getElementsByClassName('rlv-progress');
        for (var i = 0; i < _bars.length; i++) {
            this.append(new ProgressBar(_bars[i]));
        }
    }
    append(progressBar) {
        this._bars.push(progressBar);
    }
    getProgressBarById(id) {
        let filtered = this._bars.filter(bar => bar.id == id);
        if (!filtered.length) throw new Error(`Could not find Progress Bar of ID = ${id}`);
        return filtered[0];
    }
    getBars() {
        return this._bars;
    }
}