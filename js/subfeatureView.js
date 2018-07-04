
// How bright the color should be
let MIN_LIGHT = 20; // same color as title bar background
let MAX_LIGHT = 55; // brighter color

export class SubfeatureView {

    /**
     * Creates a horizontal bar for displaying a **subfeature**.
     * @param {*} percentage bar fill
     * @param {*} text text inside the bar
     * @param {*} tooltip text shown on hover
     */
    constructor(percentage, text, tooltip) {
        // linear interpolation
        let light = MIN_LIGHT + (MAX_LIGHT - MIN_LIGHT) * (percentage / 100);

        this.uiElement = $(`
            <div class='hbar'
                style='background: linear-gradient(to right, hsl(227, 41%, ${MIN_LIGHT}%) 0%, hsl(227, 41%, ${light}%) ${percentage}% , #bbb ${percentage}%);'
                title='${tooltip}'>
                ${text}
            </div>
        `);
        
        this.uiElement.tooltip();
    }

}