import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Productos } from 'src/app/shared/models/productos';
import { ProductosService } from 'src/app/shared/services/productos.service';
import { AdminProductosComponent } from './admin-productos/admin-productos.component';

// const ELEMENT_DATA: Productos[] = [];

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent {
  displayedColumns: string[] = ['id', 'nombre', 'precio', 'acciones'];

  dataSource = new MatTableDataSource();

  constructor(
    private srvProductos: ProductosService,
    public dialog: MatDialog
  ) {}
  ngOnInit() {
    this.srvProductos.getAll().subscribe((datos) => {
      this.dataSource.data = datos;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  modificar(): void {
    alert('modificar');
  }

  eliminar(id: number): void {
    this.srvProductos.eliminar(id).subscribe(
      (dato) => {
        alert('Se eliminó el producto');
      },
      (error) => {
        alert('Error al eliminar');
      }
    );
  }

  detalle(dato: Productos): void {
    alert(dato.nombre);
  }

  abrirDialog(producto?: Productos): void {
    if (producto) {
      this.dialog.open(AdminProductosComponent, {
        width: '700px',
        height: '700px',
        data: { producto },
      });
    } else {
      this.dialog.open(AdminProductosComponent, {
        width: '700px',
        height: '700px',
      });
    }
  }
}