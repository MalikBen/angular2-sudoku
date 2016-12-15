import { Component } from '@angular/core';

export class Cellule {
    value: string;   
    line: number;
    col: number;
    cellClass: string;

    constructor(value: string, line: number, col: number, cellClass: string) {
        this.value = value;
        this.line = line;
        this.col = col;
        this.cellClass = cellClass;
    }
}