export class UtilArrays {


  static getTipoDocumentoList(): any[] {
    return [
      {value: '001', viewValue: 'DNI'},
      {value: '002', viewValue: 'PASSAPORTE'},
      {value: '003', viewValue: 'CEDULA'}
    ];
  }

  static getColegioAbogadoList(): any[] {
    return [
      {value: '001', viewValue: 'LIMA'},
      {value: '002', viewValue: 'ANCASH'},
      {value: '003', viewValue: 'HUANCAYO'}
    ];
  }

  static getTipoPersonaList() {

    return [
      {value: '001', viewValue: 'NATURAL'},
      {value: '002', viewValue: 'JURIDICA'},
    ];

  }

  static getPopulateFormsList(userDbInfo: any) {
    return [
      // {labelText: 'IMAGEN PERFIL', columName: 'photoURL', value: userDbInfo.photoURL},
      {labelText: 'APELLIDO PATERNO', columName: 'apellidoPaterno', value: userDbInfo.apellidoPaterno},
      {labelText: 'APELLIDO MATERNO', columName: 'apellidoMaterno', value: userDbInfo.apellidoMaterno},
      {labelText: 'NOMBRES', columName: 'nombres', value: userDbInfo.nombres},
      {labelText: 'NOMBRE PUBLICO', columName: 'displayName', value: userDbInfo.displayName},

      // {labelText: 'EMAIL VERIFICADO', columName: 'emailVerified', value: userDbInfo.emailVerified},
      {labelText: 'TELEFONO', columName: 'telefono', value: userDbInfo.telefono},
      {labelText: 'FECHA NACIMIENTO', columName: 'fechaNacimiento', value: userDbInfo.fechaNacimiento, isDate: true},
      {
        labelText: 'TIPO DOCUMENTO', columName: 'tipoDoc', value: userDbInfo.tipoDoc,
        isSelect: true,
        valueSelect: this.getTipoDocumentoList(),
        selected: ''
      },
      {labelText: 'NRO DOCUMENTO', columName: 'tipoDocValue', value: userDbInfo.tipoDocValue},
      {
        labelText: 'COLEGIO ABOGADO',
        columName: 'colegioAbogado',
        value: userDbInfo.colegioAbogado,
        isSelect: true,
        valueSelect: this.getColegioAbogadoList(),
        selected: ''
      },
      {
        labelText: 'TIPO PERSONA ',
        columName: 'tipoPersona',
        value: userDbInfo.tipoPersona,
        isSelect: true,
        valueSelect: this.getTipoPersonaList(),
        selected: ''
      },

      {labelText: 'NRO. COLEGIO ABOGADO', columName: 'nroColegioAbo', value: userDbInfo.nroColegioAbo},
      {labelText: 'SINOE', columName: 'sinoe', value: userDbInfo.sinoe},];
  }
}
