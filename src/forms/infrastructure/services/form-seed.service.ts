import { Injectable } from '@nestjs/common';
import { FormRepositoryPort } from '../../domain/ports/form-repository.port';

@Injectable()
export class FormSeedService {
  constructor(private readonly formRepository: FormRepositoryPort) {}

  async seedForms(): Promise<void> {
    console.log('🌱 Verificando formularios en base de datos...');

    try {
      // Eliminar formularios existentes para recrearlos con la configuración actualizada
      const existingForms = await this.formRepository.findAll();
      if (existingForms.length > 0) {
        console.log('🗑 Eliminando formularios existentes para actualizar...');
        for (const form of existingForms) {
          await this.formRepository.delete(form.id);
        }
      }

      console.log('🌱 Poblando base de datos con formularios actualizados...');

      // Formulario de Alta de Automotor
      await this.createVehicleRegistrationForm();

      // Formulario de Transferencia de Automotor
      await this.createVehicleTransferForm();

      console.log('✅ Formularios insertados exitosamente');
      console.log('📋 Formularios disponibles:');
      console.log(
        '   - vehicle-registration: Alta de Automotor (POST automotor/alta-modificacion)',
      );
      console.log(
        '   - vehicle-transfer: Transferencia de Automotor (PUT automotor/transferencia)',
      );
    } catch (error) {
      console.error('❌ Error al insertar formularios:', error);
    }
  }

  private async createVehicleRegistrationForm(): Promise<void> {
    const form = {
      id: 'vehicle-registration',
      title: 'Alta de Automotor',
      subtitle:
        'Sistema de registro de nuevos vehículos - Formulario AUFA0030_CBA',
      description:
        'AUFA0030_CBA - Registre un nuevo vehículo en el sistema tributario',
      category: 'vehiculos',
      isActive: true,
      version: '1.0',
      buttonsConfig: JSON.stringify({
        submit: 'Registrar Vehículo',
        cancel: 'Cancelar',
        showBack: true,
        backRoute: '/home',
      }),
      layoutConfig: JSON.stringify({
        cols: 2,
        gap: '16px',
        rowHeight: '85px',
      }),
      submissionEndpoint: 'http://localhost:3000automotor/alta-modificacion',
      submissionMethod: 'POST',
      submissionSchema: JSON.stringify({
        type: 'object',
        mapping: {
          vehiculo: {
            type: 'object',
            mapping: {
              patente: { source: 'patente' },
              tipoVehiculo: { source: 'tipo_vehiculo' },
              anioFabricacion: { source: 'anio_fabricacion', type: 'number' },
              origenRnpa: { source: 'origen_rnpa' },
              colorVehiculo: { source: 'color_vehiculo' },
              numeroMotor: { source: 'numero_motor' },
              numeroChasis: { source: 'numero_chasis' },
              fechaPrimeraInscripcion: {
                source: 'fecha_primera_inscripcion',
                type: 'date',
              },
              marcaRnpa: { source: 'marca_rnpa' },
              marcaDescripcion: { source: 'marca_descripcion' },
              tipoRnpa: { source: 'tipo_rnpa' },
              tipoRnpaDescripcion: { source: 'tipo_rnpa_descripcion' },
              modeloRnpa: { source: 'modelo_rnpa' },
              modeloDescripcion: { source: 'modelo_descripcion' },
              versionModelo: { source: 'version_modelo' },
              combustible: { source: 'combustible' },
              cilindrada: { source: 'cilindrada', type: 'number' },
              potencia: { source: 'potencia', type: 'number' },
              pesoVehiculo: { source: 'peso_vehiculo', type: 'number' },
              capacidadCarga: { source: 'capacidad_carga', type: 'number' },
              cantidadEjes: { source: 'cantidad_ejes', type: 'number' },
              cantidadRuedas: { source: 'cantidad_ruedas', type: 'number' },
              tara: { source: 'tara', type: 'number' },
              pbt: { source: 'pbt', type: 'number' },
            },
          },
          registro: {
            type: 'object',
            mapping: {
              registroAutomotor: { source: 'registro_automotor' },
              registroDescripcion: { source: 'registro_descripcion' },
              codigoAlta: { source: 'codigo_alta' },
              codigoAltaDescripcion: { source: 'codigo_alta_descripcion' },
              numeroTitulo: { source: 'numero_titulo' },
              fechaEmisionTitulo: {
                source: 'fecha_emision_titulo',
                type: 'date',
              },
              observacionesTitulo: { source: 'observaciones_titulo' },
              usuarioAlta: { source: 'usuario_alta' },
              fechaAltaVehiculo: {
                source: 'fecha_alta_vehiculo',
                type: 'datetime',
              },
              observaciones: { source: 'observaciones' },
            },
          },
          propietario: {
            type: 'object',
            mapping: {
              cuit: { source: 'cuit_propietario' },
              descripcion: { source: 'propietario_descripcion' },
              porcentajePropiedad: {
                source: 'porcentaje_propiedad',
                type: 'number',
              },
              tipoVinculo: { source: 'tipo_vinculo' },
              fechaInicioVinculo: {
                source: 'fecha_inicio_vinculo',
                type: 'date',
              },
              esResponsable: { source: 'es_responsable', type: 'boolean' },
            },
          },
          documentacion: {
            type: 'object',
            mapping: {
              documentosPresentados: {
                source: 'documentos_presentados',
                type: 'array',
              },
              verificacionPolicial: {
                source: 'verificacion_policial',
                type: 'boolean',
              },
            },
          },
        },
      }),
      sectionsConfig: JSON.stringify([
        {
          title: 'Datos Básicos del Vehículo',
          fields: [
            'patente',
            'tipo_vehiculo',
            'anio_fabricacion',
            'origen_rnpa',
            'color_vehiculo',
            'numero_motor',
            'numero_chasis',
            'fecha_primera_inscripcion',
          ],
        },
        {
          title: 'Información RNPA',
          fields: [
            'marca_rnpa',
            'marca_descripcion',
            'tipo_rnpa',
            'tipo_rnpa_descripcion',
            'modelo_rnpa',
            'modelo_descripcion',
            'version_modelo',
            'combustible',
          ],
        },
        {
          title: 'Registro y Documentación',
          fields: [
            'registro_automotor',
            'registro_descripcion',
            'codigo_alta',
            'codigo_alta_descripcion',
            'numero_titulo',
            'fecha_emision_titulo',
            'observaciones_titulo',
          ],
        },
        {
          title: 'Propietario Inicial',
          fields: [
            'cuit_propietario',
            'propietario_descripcion',
            'porcentaje_propiedad',
            'tipo_vinculo',
            'fecha_inicio_vinculo',
            'es_responsable',
          ],
        },
        {
          title: 'Datos Técnicos',
          fields: [
            'cilindrada',
            'potencia',
            'peso_vehiculo',
            'capacidad_carga',
            'cantidad_ejes',
            'cantidad_ruedas',
            'tara',
            'pbt',
          ],
        },
        {
          title: 'Documentación y Control',
          fields: [
            'documentos_presentados',
            'verificacion_policial',
            'usuario_alta',
            'fecha_alta_vehiculo',
            'observaciones',
          ],
        },
      ]),
      validationsConfig: JSON.stringify({
        rules: [
          // Validaciones según el XML del formulario Oracle Forms AUFA0090_CBA
          {
            field: 'patente',
            type: 'oracle_where_clause',
            condition: 'atr_fecha_fin is null and atr_pcj_id is null',
            message: 'El vehículo no está activo para transferencias',
            description: 'Validación del bloque AUTOMOTORES según XML',
          },
          {
            field: 'cuit_vendedor',
            type: 'oracle_where_clause',
            condition: 'VSO_FECHA_FIN is null and VSO_FECHA_BAJA is null',
            message: 'El vendedor no tiene un vínculo activo con el vehículo',
            description:
              'Validación del bloque VINCULOS_SUJETO_OBJETO_ANT según XML',
          },
          {
            field: 'vendedor_pcj_id',
            type: 'oracle_where_clause',
            condition: "nvl(vso_pcj_id, '0') not in ('640','641','642','BUS')",
            message: 'El vínculo tiene códigos que impiden la transferencia',
            description: 'Validación de códigos especiales según XML',
          },
          {
            field: 'cuit_comprador',
            type: 'oracle_where_clause',
            condition:
              'SYSDATE BETWEEN VSO_FECHA_INICIO AND NVL(VSO_FECHA_FIN, SYSDATE+1)',
            message: 'Validación de vigencia de vínculo según XML',
            description: 'Validación del bloque VSO_ALTA según XML',
          },
          {
            field: 'cuit_vendedor',
            type: 'foreign_key',
            table: 'SUJETOS_PASIVOS',
            message: 'El CUIT del vendedor debe existir en el sistema',
          },
          {
            field: 'cuit_comprador',
            type: 'foreign_key',
            table: 'SUJETOS_PASIVOS',
            message: 'El CUIT del comprador debe existir en el sistema',
          },
          {
            field: 'tipo_vinculo',
            type: 'foreign_key',
            table: 'PAR_TIPOS_VINCULOS',
            message:
              'El tipo de vínculo debe ser válido según PAR_TIPOS_VINCULOS',
            description:
              'Validación según LOV CGFK$VSO_ALTA_VSO_PTV_ID del XML',
          },
          {
            field: 'moneda',
            type: 'foreign_key',
            table: 'PAR_MONEDAS',
            message: 'La unidad monetaria debe ser válida según PAR_MONEDAS',
            description:
              'Validación según LOV CGFK$TRANSFERENCIAS_TFA_PMA_ID del XML',
          },
        ],
        constraints: [
          {
            type: 'date_range',
            field: 'anio_fabricacion',
            min: 1900,
            max: new Date().getFullYear() + 1,
            message:
              'El año de fabricación debe estar entre 1900 y el año siguiente al actual',
          },
        ],
      }),
      eventsConfig: JSON.stringify({
        onMarcaChange: {
          type: 'query',
          target: 'PAR_MARCAS_RNPA',
          populate: ['marca_descripcion'],
        },
        onTipoChange: {
          type: 'query',
          target: 'PAR_TIPOS_RNPA',
          populate: ['tipo_rnpa_descripcion'],
        },
        onModeloChange: {
          type: 'query',
          target: 'PAR_MODELOS_RNPA',
          populate: ['modelo_descripcion'],
        },
        onRegistroChange: {
          type: 'query',
          target: 'PAR_REGISTRO_AUTOMOTORES',
          populate: ['registro_descripcion'],
        },
        onCodigoAltaChange: {
          type: 'query',
          target: 'PAR_CODIGOS_ALTAS',
          populate: ['codigo_alta_descripcion'],
        },
        onCuitLookup: {
          type: 'query',
          target: 'SUJETOS_PASIVOS',
          populate: ['propietario_descripcion'],
        },
        onOrigenChange: {
          type: 'conditional_label',
          field: 'origen_rnpa',
          conditions: {
            N: { label: 'Nacional' },
            I: { label: 'Importado' },
          },
        },
      }),
      createdAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2025-07-15T10:00:00Z'),
    };

    await this.formRepository.create(form);
  }

  private async createVehicleTransferForm(): Promise<void> {
    const form = {
      id: 'vehicle-transfer',
      title: 'Transferencia de Automotor',
      subtitle:
        'Sistema de consulta y transferencia de vehículos - Formulario AUFA0090_CBA - TAXIDESI',
      description:
        'TAXIDESI - Complete la información para registrar la transferencia del vehículo',
      category: 'vehiculos',
      isActive: true,
      version: '1.0',
      buttonsConfig: JSON.stringify({
        submit: 'Registrar Transferencia',
        cancel: 'Cancelar',
        showBack: true,
        backRoute: '/home',
      }),
      layoutConfig: JSON.stringify({
        cols: 2,
        gap: '16px',
        rowHeight: '85px',
      }),
      submissionEndpoint:
        'http://localhost:3000/automotor/transferencia-formulario',
      submissionMethod: 'POST',
      submissionSchema: JSON.stringify({
        type: 'object',
        mapping: {
          vehiculo: {
            type: 'object',
            mapping: {
              dominio: { source: 'patente' },
              modeloRnpa: { source: 'modelo_rnpa' },
              modeloDescripcion: { source: 'modelo_descripcion' },
              codigoAlta: { source: 'codigo_alta' },
              codigoAltaDescripcion: { source: 'codigo_alta_descripcion' },
              registroAutomotor: { source: 'registro_automotor' },
              registroDescripcion: { source: 'registro_descripcion' },
              fechaAlta: { source: 'fecha_alta', type: 'date' },
              fechaInicio: { source: 'fecha_inicio', type: 'date' },
              fechaFabricacion: { source: 'fecha_fabricacion', type: 'number' },
              fechaRige: { source: 'fecha_rige', type: 'date' },
              origenRnpa: { source: 'origen_rnpa' },
              marcaRnpa: { source: 'marca_rnpa' },
              marcaDescripcion: { source: 'marca_descripcion' },
              tipoRnpa: { source: 'tipo_rnpa' },
              tipoRnpaDescripcion: { source: 'tipo_rnpa_descripcion' },
              modeloRnpaDescripcion: { source: 'modelo_rnpa_descripcion' },
              archivoId: { source: 'archivo_id' },
            },
          },
          transferencia: {
            type: 'object',
            mapping: {
              tipoTransferencia: { source: 'tipo_transferencia' },
              fechaTransferencia: {
                source: 'fecha_transferencia',
                type: 'date',
              },
              montoOperacion: { source: 'monto_operacion', type: 'number' },
              moneda: { source: 'moneda' },
              numeroTransferencia: { source: 'numero_transferencia' },
            },
          },
          vendedor: {
            type: 'object',
            mapping: {
              cuit: { source: 'cuit_vendedor' },
              descripcion: { source: 'vendedor_descripcion' },
            },
          },
          comprador: {
            type: 'object',
            mapping: {
              cuit: { source: 'cuit_comprador' },
              descripcion: { source: 'comprador_descripcion' },
              porcentajePropiedad: {
                source: 'porcentaje_propiedad',
                type: 'number',
              },
              tipoVinculo: { source: 'tipo_vinculo' },
              fechaInicioVinculo: {
                source: 'fecha_inicio_vinculo',
                type: 'date',
              },
              esResponsable: { source: 'es_responsable', type: 'boolean' },
            },
          },
          documentacion: {
            type: 'object',
            mapping: {
              documentosPresentados: {
                source: 'documentos_presentados',
                type: 'array',
              },
              situacionEspecial: { source: 'situacion_especial' },
              observaciones: { source: 'observaciones' },
              usuarioAlta: { source: 'usuario_alta' },
              fechaAltaTransferencia: {
                source: 'fecha_alta_transferencia',
                type: 'datetime',
              },
            },
          },
        },
      }),
      sectionsConfig: JSON.stringify([
        {
          title: 'Datos del Vehículo',
          fields: [
            'patente',
            'tipo_vehiculo',
            'modelo_rnpa',
            'modelo_descripcion',
            'codigo_alta',
            'codigo_alta_descripcion',
            'registro_automotor',
            'registro_descripcion',
            'fecha_alta',
            'fecha_inicio',
            'fecha_fabricacion',
            'fecha_rige',
            'origen_rnpa',
            'marca_rnpa',
            'marca_descripcion',
            'tipo_rnpa',
            'tipo_rnpa_descripcion',
            'modelo_rnpa_descripcion',
            'archivo_id',
          ],
        },
        {
          title: 'Propietarios',
          fields: [
            'cuit_vendedor',
            'vendedor_descripcion',
            'cuit_comprador',
            'comprador_descripcion',
            'porcentaje_propiedad',
            'tipo_vinculo',
            'fecha_inicio_vinculo',
            'es_responsable',
            'usuario_alta',
            'fecha_alta_transferencia',
          ],
        },
        {
          title: 'Datos de la Transferencia',
          fields: [
            'fecha_transferencia',
            'tipo_transferencia',
            'monto_operacion',
            'moneda',
            'numero_transferencia',
          ],
        },
        {
          title: 'Documentación y Observaciones',
          fields: [
            'documentos_presentados',
            'situacion_especial',
            'observaciones',
          ],
        },
      ]),
      validationsConfig: JSON.stringify({
        rules: [
          {
            field: 'cuit_vendedor',
            type: 'foreign_key',
            table: 'SUJETOS_PASIVOS',
            message: 'El CUIT del vendedor debe existir en el sistema',
          },
          {
            field: 'cuit_comprador',
            type: 'foreign_key',
            table: 'SUJETOS_PASIVOS',
            message: 'El CUIT del comprador debe existir en el sistema',
          },
          {
            field: 'patente',
            type: 'foreign_key',
            table: 'AUTOMOTORES',
            message:
              'La patente debe corresponder a un vehículo registrado y activo',
          },
          {
            field: 'tipo_vinculo',
            type: 'foreign_key',
            table: 'PAR_TIPOS_VINCULOS',
            message: 'Tipo de vínculo inválido',
          },
        ],
        constraints: [
          {
            type: 'unique',
            fields: ['patente', 'cuit_comprador', 'fecha_transferencia'],
            message:
              'Ya existe una transferencia para este vehículo, comprador y fecha',
          },
          {
            type: 'date_range',
            field: 'fecha_transferencia',
            min: 'fecha_alta',
            message:
              'La fecha de transferencia no puede ser anterior a la fecha de alta del vehículo',
          },
        ],
      }),
      eventsConfig: JSON.stringify({
        onPatenteLookup: {
          type: 'query',
          target: 'AUTOMOTORES',
          populate: [
            'modelo_rnpa',
            'modelo_descripcion',
            'codigo_alta',
            'registro_automotor',
            'fecha_alta',
            'origen_rnpa',
          ],
        },
        onCuitLookup: {
          type: 'query',
          target: 'SUJETOS_PASIVOS',
          populate: ['vendedor_descripcion', 'comprador_descripcion'],
        },
        onOrigenChange: {
          type: 'conditional_label',
          field: 'origen_rnpa',
          conditions: {
            N: { marca_rnpa: 'Marca Nacional', tipo_rnpa: 'Tipo Nacional' },
            I: { marca_rnpa: 'Marca Importada', tipo_rnpa: 'Tipo Importado' },
          },
        },
      }),
      createdAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2025-07-15T10:00:00Z'),
    };

    await this.formRepository.create(form);
  }
}
