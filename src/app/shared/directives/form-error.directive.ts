import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Directive({
    selector: '[appFormError]',
    standalone: false
})
export class FormErrorDirective implements OnInit, OnDestroy {
  @Input('appFormError') control!: AbstractControl | string;
  @Input() controlName!: string;
  @Input() form!: FormGroup;

  private errorSpan!: HTMLElement;
  private unsubscribe$ = new Subject<void>();

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.errorSpan = this.renderer.createElement('span');
    if (this.errorSpan) {
      this.renderer.addClass(this.errorSpan, 'error-messages');
    }
  }

  ngOnInit() {
    const actualControl = typeof this.control === 'string' ? this.form.get(this.control) : this.control;
    if (actualControl) {
      this.form.statusChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
        this.updateErrorMessage(actualControl);
      });

      actualControl.statusChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
        this.updateErrorMessage(actualControl);
      });

      actualControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
        this.updateErrorMessage(actualControl);
      });
    }
  }

  private updateErrorMessage(control: AbstractControl) {
    const errors = control.errors;
    const parentErrors = control.parent?.errors;
    console.log(errors, parentErrors);
    if ((errors || parentErrors) && (control.dirty || control.touched || control.parent?.dirty || control.parent?.touched)) {
      let errorMessage = '';
      if (errors?.['required']) {
        errorMessage = `* ${this.controlName} is required`;
      } else if (errors?.['minlength']) {
        errorMessage = `* ${this.controlName} must be at least ${errors['minlength'].requiredLength} characters`;
      } else if (errors?.['maxlength']) {
        errorMessage = `* ${this.controlName} must be at most ${errors['maxlength'].requiredLength} characters`;
      } else if (errors?.['pattern']) {
        errorMessage = `* ${this.controlName} format is invalid`;
      } else if (errors?.['email']) {
        errorMessage = '* Email is invalid';
      } else if (parentErrors?.['mismatchedPasswords'] && (this.controlName === 'Confirm Password' || this.controlName === 'Password')) {
        errorMessage = '* Passwords do not match';
      }

      if (errorMessage && this.errorSpan) {
        this.renderer.setProperty(this.errorSpan, 'textContent', errorMessage);
        if (!this.el.nativeElement.nextSibling || this.el.nativeElement.nextSibling !== this.errorSpan) {
          this.renderer.insertBefore(this.el.nativeElement.parentNode, this.errorSpan, this.el.nativeElement.nextSibling);
        }
      } else {
        this.removeErrorMessage();
      }
    } else {
      this.removeErrorMessage();
    }
  }

  private removeErrorMessage() {
    if (this.el.nativeElement.nextSibling === this.errorSpan) {
      this.renderer.removeChild(this.el.nativeElement.parentNode, this.errorSpan);
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
