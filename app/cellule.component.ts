import { Component } from '@angular/core';

@Component({
    selector: 'cellule',
    template: '<td>{{value}}</td>'
})

export class CelluleComponent {
    value: string;   
    line: number;
    col: number;
    cellClass: string;
}