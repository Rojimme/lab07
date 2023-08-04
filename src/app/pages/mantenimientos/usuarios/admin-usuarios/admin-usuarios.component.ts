import { Component, Inject } from '@angular/core';
import { UsuariosForm } from 'src/app/shared/formsModels/usuariosForms';
import { UsuariosService } from 'src/app/shared/services/usuarios.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.scss'],
})
export class AdminUsuariosComponent {
  titulo = 'Creación de usuarios';
  isCreate = true;
  usuarioCarga: any;
  constructor(
    public usuarioForm: UsuariosForm,
    private srvUsuarios: UsuariosService,
    @Inject(MAT_DIALOG_DATA) public data: { usuario: any }
  ) {}

  ngOnInit() {
    if (this.data?.usuario) {
      this.isCreate = false;
      this.titulo = 'Modificaficación de su usuario';
      this.cargarDatosCarga();
    } else {
      this.isCreate = true;
      this.titulo = 'cree el usuario';
    }
  }

  cargarDatosCarga() {
    this.usuarioCarga.baseForm.patchValue({
      cedula: this.data.usuario.cedula,
      nombre: this.data.usuario.nombre,
      apellido1: this.data.usuario.apellido1,
      apellido2: this.data.usuario.apellido2,
      fecha_ingreso: this.data.usuario.fecha_ingreso,
      correo: this.data.usuario.correo,
      rol: this.data.usuario.rol,
      contrasena: this.data.usuario.contrasena,
      estado: true,
    });
  }

  guardar() {
    if (this.usuarioCarga.baseForm.valid) {
      if (this.isCreate) {
        this.srvUsuarios.guardar(this.usuarioCarga.baseForm.value).subscribe(
          (dato) => {
            this.usuarioCarga.baseForm.reset();
            alert('SE HA GUARDADO CORRECTAMENTE');
          },
          (error) => {
            alert('Error AL SER GUARDADO');
          }
        );
      }
    }
  }
}
