import { AbstractControl, FormControl } from '@angular/forms';

// export function ValidateUserid(control: AbstractControl): { [key: string]: boolean } | null  {
//   if (control.value !== undefined && (control.value === 'sann')) {
//     return { 'validUserid': true };
//   }
//   return null;
// }

export function ValidateUserid(control: AbstractControl): { [key: string]: boolean } | null  {
    const userid = control.value;
    return {
        'validUserid': true
    };
}
