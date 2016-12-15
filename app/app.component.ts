import { Component, OnInit } from '@angular/core';
import { Cellule } from './cellule';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
})

export class AppComponent  { 
    
    lines : Cellule[][];
    column : Cellule[][];
    section : Cellule[][][];
    data: any[];
    data1: any[];
    data2: any[];
    cell: Cellule;
    sectLine: number;
    sectCol: number;
    secIndex: number;
    currentRow: number;
    currentCol: number;
    availableNumbers: any[];
    currentDataId: number;
    
    constructor(){
        this.data = [
            '1-36-47-9',
            '-2--9--1-',
            '7-------6',
            '2-4-3-9-8',
            '---------',
            '5--9-7--1',
            '6---5---2',
            '----7----',
            '9--8-2--5'
        ];
        
        this.data1 = [
            '-76-1--43',
            '---7-29--',
            '-9---6---',
            '----632-4',
            '46-----19',
            '1-542----',
            '---2---9-',
            '--48-7--1',
            '91--5-72-'
        ];
        this.data2 = [
            '1---3-59-',
            '3--5---2-',
            '-5-9-2638',
            '43-------',
            '---6-1---',
            '-------87',
            '6473-8-5-',
            '-1---5--9',
            '-92-7---3'
        ];

    }
    
    ngOnInit() : void {
        this.initGrid(this.data);
        this.currentDataId = 0;
    }
    
    changeData(id:number) {
        let dataCollection = [this.data, this.data1, this.data2];
        this.initGrid(dataCollection[id]);
        this.currentDataId = id;
    }
    
    initGrid(data:any[]){
        this.lines = [];
        this.column = [];
        this.section = [];
        let cellClass = "";
        for(var i = 0; i < 9; i++) {
            this.lines[i] = [];
            for(var j = 0; j < 9; j++) {
                this.column[j] = ( typeof this.column[j] != 'undefined' && this.column[j] instanceof Array ) ? this.column[j] : [];
                
                this.sectLine = Math.floor( i / 3 );
                this.sectCol = Math.floor( j / 3 );
                this.secIndex = ( i % 3 ) * 3 + ( j % 3 );
                
                if ( ( this.sectLine + this.sectCol ) % 2 === 0 ) {
                    cellClass = "one";
                }else{
                    cellClass = "two";
                }
                
                this.section[this.sectLine] = ( typeof this.section[this.sectLine] != 'undefined' && this.section[this.sectLine] instanceof Array ) ? this.section[this.sectLine] : [];
                this.section[this.sectLine][this.sectCol] = ( typeof this.section[this.sectLine][this.sectCol] != 'undefined' && this.section[this.sectLine][this.sectCol] instanceof Array ) ? this.section[this.sectLine][this.sectCol] : [];
                
                if(data[i].charAt(j) > 0){
                    this.cell = new Cellule(data[i].charAt(j), i, j, cellClass);
                }else{
                    cellClass += " empty";
                    this.cell = new Cellule('-', i, j, cellClass);
                }
                
                this.lines[i][j] = this.cell;
                this.column[j][i] = this.cell;
                this.section[this.sectLine][this.sectCol][this.secIndex] = this.cell;
            }
        }
    }
    
    solveClick(){
        this.solveSudoku(0,0);
    }
    
    solveSudoku(lineid:number, colid:number){
        let nextCell = this.findNextCell(lineid, colid);
        
        if (typeof nextCell !== 'undefined') {
            
            let possiblevalues = this.findPossibleValues( nextCell.line, nextCell.col );
            
            let sectLine = Math.floor( nextCell.line / 3 );
            let sectCol = Math.floor( nextCell.col / 3 );
            let secIndex = ( nextCell.line % 3 ) * 3 + ( nextCell.col % 3 );

            for ( var i = 0; i < possiblevalues.length; i++ ) {
                let legalValue = possiblevalues[i];
                nextCell.value = legalValue;
                if (!(nextCell.cellClass.indexOf(' bigEntrance') > -1))
                {
                  nextCell.cellClass = nextCell.cellClass + ' bigEntrance';
                }
                        
                
                this.lines[nextCell.line][nextCell.col] = nextCell;
                this.column[nextCell.col][nextCell.line] = nextCell;
                this.section[sectLine][sectCol][secIndex] = nextCell;

                if ( this.solveSudoku( nextCell.line, nextCell.col ) ) {
                    return true;
                } else {

                    this.lines[nextCell.line][nextCell.col].value = '-';
                    this.column[nextCell.col][nextCell.line].value = '-';
                    this.section[sectLine][sectCol][secIndex].value = '-';
                }
            }
            
            return false;
            
        }else{
            return true;
        }
        
    }
    
    findNextCell(lineid:number, colid:number){
        this.currentRow = 0;
        this.currentCol = 0;
        
        for ( let i = ( colid + 9*lineid ); i < 81; i++ ) {
            this.currentRow = Math.floor( i / 9 );
            this.currentCol = i % 9;
            if ( this.lines[this.currentRow][this.currentCol].value == '-' ) {
                return this.lines[this.currentRow][this.currentCol];
            }
        }
    }
    
    findPossibleValues(lineid:number, colid:number){
        
        this.availableNumbers = [1,2,3,4,5,6,7,8,9];
        
        //Check lines
        for ( let i = 0; i < 9; i++ ) {
            
            let val = Number( this.lines[lineid][i].value );
            if ( val > 0 ) {
                // Remove from array
                if ( this.availableNumbers.indexOf( val ) > -1 ) {
                    this.availableNumbers.splice( this.availableNumbers.indexOf( val ), 1 );
                }
            }
        }
        //Check columns
        for ( let i = 0; i < 9; i++ ) {
            let val = Number( this.column[colid][i].value );
            if ( val > 0 ) {
                // Remove from array
                if ( this.availableNumbers.indexOf( val ) > -1 ) {
                    this.availableNumbers.splice( this.availableNumbers.indexOf( val ), 1 );
                }
            }
        }
        
        // Check section
        let sectLine = Math.floor( lineid / 3 );
        let sectCol = Math.floor( colid / 3 );
        for ( let i = 0; i < 9; i++ ) {
            let val = Number( this.section[sectLine][sectCol][i].value );
            if ( val > 0 ) {
                // Remove from array
                if ( this.availableNumbers.indexOf( val ) > -1 ) {
                    this.availableNumbers.splice( this.availableNumbers.indexOf( val ), 1 );
                }
            }
        }
        
        return this.shuffle(this.availableNumbers);
        
    }
    
    shuffle(array:any[]) {
        let counter = array.length;

        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            let index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter--;

            // And swap the last element with it
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        return array;
    }
    
    
    
}
