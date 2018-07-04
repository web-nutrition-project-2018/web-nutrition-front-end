import { SubfeatureView } from "./subfeatureView.js";

export class CardView {
    constructor(card) {
        this.card = card;

        this.uiElement = $(`
            <div class="col-4 vertical-divider">
                <div class="col-content">
                    <div class="flip-container">
                        <div class="card" id="card_${this.card.label}">
                            <div class="card-info">${this.card.tooltip}</div>
                            <div class="front">
                                <div class="front-card-info-icon"><i class="fas fa-question-circle"></i></div>
                                <img class="label-icon img-fluid" src="images/${this.card.label}.png"/>
                                <h4 class="label-name">${this.card.displayName}</h4>
                            </div>
                            <div class="back">
                                <div class="header">
                                    <span><img class="label-icon img-fluid" src="images/${this.card.label}_small.png"/></span>
                                    <h4>${this.card.displayName}</h4>
                                </div>

                                <!-- Loader animation -->
                                <div class="loader">
                                    <div class="sk-cube-grid">
                                        <div class="sk-cube sk-cube1"></div>
                                        <div class="sk-cube sk-cube2"></div>
                                        <div class="sk-cube sk-cube3"></div>
                                        <div class="sk-cube sk-cube4"></div>
                                        <div class="sk-cube sk-cube5"></div>
                                        <div class="sk-cube sk-cube6"></div>
                                        <div class="sk-cube sk-cube7"></div>
                                        <div class="sk-cube sk-cube8"></div>
                                        <div class="sk-cube sk-cube9"></div>
                                    </div>
                                </div>

                                <!-- Subfeature bar chart will be generated here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
        
        this.backSide = this.uiElement.find('.back');
        this.frontSide = this.uiElement.find('.front');

        this.frontHintIcon = this.uiElement.find('.front-card-info-icon');
        this.backHintIcon = this.uiElement.find('.header');
        this.cardInfo = this.uiElement.find('.card-info');

        this.frontHintIcon.on('mouseenter', function() {
            this.cardInfo.addClass('card-info-visible');
        }.bind(this));

        this.frontHintIcon.on('mouseleave', function() {
            this.cardInfo.removeClass('card-info-visible');
        }.bind(this));

        this.backHintIcon.on('mouseenter', function() {
            this.cardInfo.addClass('card-info-visible');
        }.bind(this));

        this.backHintIcon.on('mouseleave', function() {
            this.cardInfo.removeClass('card-info-visible');
        }.bind(this));
    }
    
    showError() {
        this.backSide.append('<div>unavailable</div>');
        this.backSide.addClass('unavailable');
        this.frontSide.addClass('unavailable');
    }

    showData(data) {
        let label = this.card.label;
        let labelData = data.nutrition[label];
        let mainScore = Math.round(labelData.main_score);

        if (labelData.status != 'ok') {
            this.showError();
        } else {
            this.backSide.append(new SubfeatureView(mainScore, mainScore + '%', 'Overall ' + mainScore + '%').uiElement);
            this.backSide.append('<div class="main-score-spacer"></div>');
            this.backSide.append('<hr> ');
            
            let first = true;

            let subfeatureErrors = []
            labelData.subfeatures.forEach(subfeature => {
                if (subfeature.status != 'ok') {
                    subfeatureErrors.push(subfeature.name);
                } else {
                    if (!first) {
                        this.backSide.append('<div class="subfeature-spacer"></div>');
                    }
                    first = false;
    
                    // ellipsis (...) if subfeature name is too long (11 characters max)
                    let shortName = subfeature.name.length < 12
                        ? subfeature.name
                        : subfeature.name.substring(0, 10) + '..';
                    let text = shortName + ': ' + Math.round(subfeature.value);
                    
                    let tooltip = 'tooltip' in subfeature ? subfeature.tooltip : subfeature.name

                    this.backSide.append(new SubfeatureView(subfeature.percentage, text, tooltip).uiElement);
                }
            });

            if (subfeatureErrors.length > 0) {
                // TODO: show info that some subfeatures are missing
            }
        }
    }

}
