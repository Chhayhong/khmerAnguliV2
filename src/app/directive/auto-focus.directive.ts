import { AfterContentInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[autoFocus]'
})
export class AutofocusDirective implements AfterContentInit {

    private focus = true;

    constructor(private el: ElementRef) {
    }
    ngAfterContentInit(): void {
        throw new Error('Method not implemented.');
    }

    ngOnInit() {
        if (this.focus) {
            //Otherwise Angular throws error: Expression has changed after it was checked.
            window.setTimeout(() => {
                this.el.nativeElement.focus();
            });
        }
    }

    @Input() set autofocus(condition: boolean) {
        this.focus = condition !== false;
    }

}