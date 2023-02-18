import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExportExcellService {

  constructor() {}

  exportarExcel(json: any[], excelFileName: string){
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const wb: XLSX.WorkBook = {
          Sheets    : {'Score': ws},
          SheetNames: ['Score']
    };

    const excelBuffer: any = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});

    // Llammamos al metodo - buffer anf filename
    this.guardarArchExcel(excelBuffer, excelFileName)
  }


  guardarArchExcel(buffer: any, fileName: string){
    const EXCEL_TYPE      = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx'

    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_export_'+ new Date().getTime() + EXCEL_EXTENSION);
    }

}
