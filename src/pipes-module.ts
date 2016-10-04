import { NgModule } from '@angular/core';

import { StatefulSlicePipe, FontStylesPipe } from './pipes';

@NgModule({
    declarations: [ StatefulSlicePipe, FontStylesPipe ],
    exports: [ StatefulSlicePipe, FontStylesPipe ]
})
export class PipesModule { };
