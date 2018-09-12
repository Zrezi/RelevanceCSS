class Perspective {
    constructor(element) {
        this.element = element;
        this.inner = this.element.children[0];

        this.mouse = {
            origin: { x: 0, y: 0 },
            position: { x: 0, y: 0 },
            update: function(e) {
                this.position.x = e.clientX - this.origin.x;
                this.position.y = (e.clientY - this.origin.y) * -1;
            },
            setOrigin: function(el) {
                this.origin.x = el.offsetLeft + Math.floor(el.offsetWidth / 2);
                this.origin.y = el.offsetTop + Math.floor(el.offsetHeight / 2);
            }
        }
        this._resetOrigin();

        this.updateCounter = 0;

        this.element.addEventListener('mouseenter', (e) => {
            this.mouse.update(e);
            this._animate();
        });
        this.element.addEventListener('mousemove', (e) => {
            this.mouse.update(e);
            if (this._shouldUpdate()) this._animate();
        });
        this.element.addEventListener('mouseleave', (e) => {
            this.inner.style = "";
        });
    }
    _animate() {
        let x = (this.mouse.position.y / this.inner.offsetHeight / 2).toFixed(2);
        let y = (this.mouse.position.x / this.inner.offsetWidth / 2).toFixed(2);

        let style = `rotateX(${x}deg) rotateY(${y}deg)`;
        this.inner.style.transform = style;
        this.inner.style.webkitTransform = style;
        this.inner.style.mozTransform = style;
        this.inner.style.msTransform = style;
        this.inner.style.oTransform = style;
    }
    _shouldUpdate() {
        return this.updateCounter++ % 5 === 0;
    }
    _resetOrigin() {
        this.mouse.setOrigin(this.element);
    }
    setPerspective(perspective) {
        if (typeof perspective === 'number') {
            this.element.style.perspective = `${perspective}px`;
        }
    }
}

class PerspectiveManager {
    constructor() {
        this. _perspectives = [];
        let perspectives = document.getElementsByClassName('rlv-perspective');
        for (var i = 0; i < perspectives.length; i++) {
            this.append(new Perspective(perspectives[i]));
        }
        window.addEventListener('resize', () => {
            for (var i = 0; i < this._perspectives.length; i++) {
                this._perspectives[i]._resetOrigin();
            }
        });
    }
    append(perspective) {
        this._perspectives.push(perspective);
    }
    getPerspectiveById(id) {
        let filtered = this._perspectives.filter(perspective => perspective.id == id);
        if (!filtered.length) throw new Error(`Could not find Tooltip of ID = ${id}`);
        return filtered[0];
    }
    getTooltips() {
        return this._tooltips;
    }
}