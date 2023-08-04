import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Usuarios } from 'src/app/shared/models/usuarios';
import { UsuariosService } from 'src/app/shared/services/usuarios.service';
import { AdminUsuariosComponent } from './admin-usuarios/admin-usuarios.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent {
  displayedColumns: string[] = [
    'cedula',
    'nombre',
    'apellido1',
    'apellido2',
    'fecha_ingreso',
    'correo',
    'rol',
    'acciones',
  ];

  dataSource = new MatTableDataSource();

  constructor(private srvUsuarios: UsuariosService, public dialog: MatDialog) { }
  ngOnInit() {
    this.srvUsuarios.getAll().subscribe((datos) => {
      this.dataSource.data = datos;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminar(cedula: string): void {
    this.srvUsuarios.eliminar(cedula).subscribe(
      (dato) => {
        alert('Se eliminó el usuario de forma satisfactoria.');
      },
      (error) => {
        alert('Falla al eliminar este usuario.');
      }
    );
  }

  detalle(dato: Usuarios): void {
    alert(dato.nombre);
  }

  abrirDialog(usuario?: Usuarios): void {
    if (usuario) {
      this.dialog.open(AdminUsuariosComponent, {
        width: '650px',
        height: '650px',
        data: { usuario },
      });
    } else {
      this.dialog.open(AdminUsuariosComponent, {
        width: '650px',
        height: '650px',
      });
    }
  }
}
