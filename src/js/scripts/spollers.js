class Spoller {
    constructor(element) {
        this.spoller = element;
        this.oneExpanded = this.spoller.classList.contains(
            '_spoller_one-expanded',
        );

        if (this.oneExpanded) {
            this.openedSpoller = null;
        }

        this.spollerItems = this.spoller.querySelectorAll('._spoller__item');

        for (let j = 0; j < this.spollerItems.length; j++) {
            const item = this.spollerItems[j];
            item.classList.toggle('_spoller__item_expanded', false);

            const controller = item.querySelector('._spoller__controller');
            if (controller) {
                controller.addEventListener('click', (e) => {
                    if (item.classList.contains('_spoller__item_expanded')) {
                        item.classList.toggle('_spoller__item_expanded', false);
                        if (this.oneExpanded) {
                            this.openedSpoller = null;
                        }
                    } else {
                        item.classList.toggle('_spoller__item_expanded', true);
                        if (this.oneExpanded) {
                            if (this.openedSpoller !== null) {
                                this.openedSpoller.classList.toggle(
                                    '_spoller__item_expanded',
                                    false,
                                );
                            }
                            this.openedSpoller = item;
                        }
                    }
                });
            }
        }
    }
}

const spollers = document.querySelectorAll('._spoller');
const spollersArray = [];
for (let i = 0; i < spollers.length; i++) {
    spollersArray.push(new Spoller(spollers[i]));
}
