/* eslint-disable no-mixed-operators */
export function scroll(element) {
    let start = null;
    const target = element && element ? element.getBoundingClientRect().top : 0;
    const firstPos = window.pageYOffset || document.documentElement.scrollTop;
    let pos = 0;

    function showAnimation(timestamp) {

        if (!start) { start = timestamp || new Date().getTime(); }

        let elapsed = timestamp - start;
        let progress = elapsed / 150; // animation duration 150ms

        const outQuad = function (n) {
            return n * (2 - n);
        };

        let easeInPercentage = +(outQuad(progress)).toFixed(2);

        pos = (target === 0) ? (firstPos - (firstPos * easeInPercentage)) : (firstPos + (target * easeInPercentage));

        window.scrollTo(0, pos);

        if (target !== 0 && pos >= (firstPos + target) || target === 0 && pos <= 0) {
            cancelAnimationFrame(start);
            if (element) {
                element.setAttribute("tabindex", -1);
                element.focus();
            }
            pos = 0;
        } else {
            window.requestAnimationFrame(showAnimation);
        }

    }
    window.requestAnimationFrame(showAnimation);

}