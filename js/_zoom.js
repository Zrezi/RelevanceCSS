window.addEventListener('load', () => {
    Array.from(document.getElementsByClassName('rlv-zoomed-img')).forEach((element) => {
        element.style.cursor = 'zoom-in';
        element.addEventListener('click', (e) => {
            let zoom = document.createElement('div');
            zoom.classList.add('rlv-zoom');
            let zoomImage = document.createElement('img');
            zoomImage.src = element.src;
            zoom.appendChild(zoomImage);
            document.body.appendChild(zoom);
        });
    });
});