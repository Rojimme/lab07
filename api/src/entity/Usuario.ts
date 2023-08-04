import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity()
export class Usuario {
  @PrimaryColumn()
  @IsNotEmpty({ message: 'Falta la cedula' })
  cedula: string;

  @Column()
  @IsNotEmpty({ message: 'Falta el nombre' })
  nombre: string;

  @Column()
  @MaxLength(50)
  @IsNotEmpty({ message: 'Falta el apellido 1' })
  apellido1: string;

  @Column()
  @MaxLength(50)
  @IsNotEmpty({ message: 'Falta el apellido 2' })
  apellido2: string;

  @Column()
  fecha_ingreso: Date;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty({ message: 'Falta el correo' })
  @MaxLength(50)
  correo: string;

  @Column()
  @IsNotEmpty({ message: 'Falta el rol' })
  rol: string;

  @Column()
  @MaxLength(30)
  @IsNotEmpty({ message: 'Falta la contraseña' })
  contrasena: string;

  @Column({ default: true })
  estado: boolean;

  hashPassword(): void {
    const salt = bcrypt.genSaltSync(10);
    this.contrasena = bcrypt.hashSync(this.contrasena, salt);
  }

  checkPassword(contra: string): boolean {
    return bcrypt.compareSync(contra, this.contrasena);
  }
}
